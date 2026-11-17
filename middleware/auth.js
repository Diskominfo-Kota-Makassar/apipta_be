const crypto = require("crypto");
try {
  require("dotenv").config();
} catch (e) {
  // dotenv optional if environment variables already loaded
}

const JWT_SECRET =
  process.env.JWT_SECRET || "apipta_default_secure_secret_key_2026_mks";

/**
 * Base64URL encode a buffer or string
 */
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Base64URL decode to string
 */
function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return Buffer.from(str, "base64").toString("utf8");
}

/**
 * Sign a payload using HMAC-SHA256 (RFC 7519 standard JWT)
 */
function generateToken(payload, expiresInSeconds = 86400) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresInSeconds;

  const data = {
    ...payload,
    iat: now,
    exp: exp,
  };

  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(data));
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${encHeader}.${encPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encHeader}.${encPayload}.${signature}`;
}

/**
 * Verify a JWT token
 */
function verifyToken(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;

  const [encHeader, encPayload, signature] = parts;

  try {
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${encHeader}.${encPayload}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    // Constant-time comparison to prevent timing attacks
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Token expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Middleware: Requires valid authentication token
 */
const requireAuth = (req, res, next) => {
  let token = null;

  // 1. Check Authorization header: Bearer <token>
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && typeof authHeader === "string") {
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  // 2. Check x-access-token header
  if (!token && req.headers["x-access-token"]) {
    token = String(req.headers["x-access-token"]).trim();
  }

  // 3. Check query parameter for file streaming / download if permitted
  if (!token && req.query && req.query.token) {
    token = String(req.query.token).trim();
  }

  if (!token) {
    return res.status(401).json({
      message: "Akses ditolak. Token autentikasi diperlukan.",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      message: "Akses ditolak. Token tidak valid atau telah kedaluwarsa.",
    });
  }

  req.user = decoded;
  next();
};

/**
 * Middleware: Requires specific role(s)
 * @param {Array<number|string>} allowedRoles e.g. [1] or [1, 2]
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Akses ditolak. Autentikasi diperlukan.",
      });
    }

    const userRoleId = Number(req.user.role_id);
    const rolesNum = allowedRoles.map(Number);

    if (!rolesNum.includes(userRoleId)) {
      return res.status(403).json({
        message: "Akses ditolak. Anda tidak memiliki izin untuk tindakan ini.",
      });
    }

    next();
  };
};

/**
 * Middleware: Shortcut for Admin role (role_id 1)
 */
const requireAdmin = requireRole([1]);

/**
 * Middleware: Authorize target user (user can only modify their own profile unless admin)
 */
const authorizeTargetUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Akses ditolak. Autentikasi diperlukan.",
    });
  }

  const targetId = parseInt(req.params.id, 10);
  const isSelf = req.user.id === targetId;
  const isAdmin = Number(req.user.role_id) === 1;

  if (!isSelf && !isAdmin) {
    return res.status(403).json({
      message:
        "Akses ditolak. Anda hanya diizinkan untuk mengubah data akun Anda sendiri.",
    });
  }

  next();
};

/**
 * In-memory rate limiter for login attempts (10 requests per minute per IP)
 */
const loginAttempts = new Map();
const loginRateLimit = (req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxAttempts = 10;

  let record = loginAttempts.get(ip);
  if (!record || now - record.startTime > windowMs) {
    record = { count: 1, startTime: now };
    loginAttempts.set(ip, record);
  } else {
    record.count++;
  }

  // Periodic cleanup
  if (loginAttempts.size > 5000) {
    for (const [k, v] of loginAttempts.entries()) {
      if (now - v.startTime > windowMs) {
        loginAttempts.delete(k);
      }
    }
  }

  if (record.count > maxAttempts) {
    return res.status(429).json({
      message:
        "Terlalu banyak percobaan login. Silakan coba kembali dalam beberapa saat.",
    });
  }

  next();
};

module.exports = {
  generateToken,
  verifyToken,
  requireAuth,
  requireRole,
  requireAdmin,
  authorizeTargetUser,
  loginRateLimit,
};
