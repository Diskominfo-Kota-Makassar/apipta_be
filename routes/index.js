const express = require("express");
const minioClient = require("../services/minio");
const mime = require("mime-types");
const router = express.Router();
try {
  require("dotenv").config();
} catch (e) {}

const rr = require("../controllers/UserController");
const rc = require("../controllers/ChatController");
const roleController = require("../controllers/RoleController");
const kompilasiCont = require("../controllers/KompilasiController");
const penugasan = require("../controllers/PenugasanController");
const permintaan = require("../controllers/PermintaanController");
const auditCon = require("../controllers/AuditKkaController");
const notifCon = require("../controllers/NotifController");

const {
  requireAuth,
  requireAdmin,
  authorizeTargetUser,
  loginRateLimit,
} = require("../middleware/auth");

// Import multer and upload setup with hardened limits (F03)
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum 10MB per file
    files: 5,                   // Maximum 5 files
    fields: 20,                  // Maximum 20 form fields
    parts: 30,                   // Maximum 30 multipart parts
  },
  fileFilter: (req, file, cb) => {
    // Reject dangerous executable and script files
    const dangerousExtensions = /\.(exe|bat|cmd|sh|php|phtml|cgi|py|js|vbs|msi|dll|svg|html|htm)$/i;
    if (dangerousExtensions.test(file.originalname)) {
      return cb(
        new Error(
          "Format file berbahaya ditolak demi keamanan server."
        ),
        false
      );
    }
    cb(null, true);
  },
});

// Middleware to handle Multer upload errors cleanly
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Ukuran file melebihi batas maksimum 10MB." });
    }
    return res
      .status(400)
      .json({ message: `Kesalahan upload: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================

// Health check (minimal info)
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Auth
router.post("/login", loginRateLimit, rr.login);
router.post("/register", loginRateLimit, rr.register);

// Public data & dropdown (digunakan sebelum login oleh frontend)
router.get("/roles", roleController.get);
router.get("/penugasan", penugasan.get);
router.get("/penugasan/:id", penugasan.getOne);

// ==========================================
// 2. PROTECTED ROUTES (Require Authentication)
// ==========================================

// User management (F01)
// Daftar seluruh user hanya boleh diakses oleh Admin
router.get("/user/all", requireAuth, requireAdmin, rr.getall);
// Update user: hanya boleh diakses oleh user itu sendiri atau Admin
router.put("/user/:id", requireAuth, authorizeTargetUser, rr.UpdateUser);
// Hapus user: hanya boleh diakses oleh Admin
router.delete("/user/:id", requireAuth, requireAdmin, rr.delete);

// Chats
router.post("/chats", requireAuth, rc.save);
router.get("/chats/:pengirim", requireAuth, rc.getchat);

// Roles (F01)
router.post("/roles", requireAuth, requireAdmin, roleController.add);
router.get("/roles/user", requireAuth, requireAdmin, roleController.getAllRolesWithUsers);
router.put("/roles/:id", requireAuth, requireAdmin, roleController.update);
router.delete("/roles/:id", requireAuth, requireAdmin, roleController.delete);

// Kompilasi, Rekomendasi, Aksi
router.post("/kompilasi", requireAuth, kompilasiCont.add);
router.post("/rekomendasi", requireAuth, kompilasiCont.addRekom);
router.post("/aksi", requireAuth, kompilasiCont.addAksi);
router.put("/aksi/:id", requireAuth, kompilasiCont.UpdateAksi);
router.get("/kompilasi", requireAuth, kompilasiCont.get);
router.get("/kompilasi/:id", requireAuth, kompilasiCont.getOne);
router.put("/kompilasi/:id", requireAuth, kompilasiCont.update);
router.put("/rekomendasi/:id", requireAuth, kompilasiCont.UpdateRekom);
router.delete("/kompilasi/:id", requireAuth, requireAdmin, kompilasiCont.delete);
router.delete("/kompilasi/aksi/:id", requireAuth, requireAdmin, kompilasiCont.deleteAksi);
router.delete("/kompilasi/rekomendasi/:id", requireAuth, requireAdmin, kompilasiCont.deleteRekomendasi);

// Penugasan (Mutation)
router.post("/penugasan", requireAuth, penugasan.add);
router.put("/penugasan/:id", requireAuth, penugasan.update);
router.delete("/penugasan/:id", requireAuth, requireAdmin, penugasan.delete);

// Notif
router.post("/notif", requireAuth, notifCon.add);
router.get("/notif/by/user/:id_user", requireAuth, notifCon.getByUser);
router.get("/notif", requireAuth, notifCon.get);
router.get("/notif/read/:id/:id_user", requireAuth, notifCon.baca);
router.put("/notif/:id", requireAuth, notifCon.update);
router.delete("/notif/:id", requireAuth, requireAdmin, notifCon.delete);

// Permintaan (Upload parser placed AFTER requireAuth - F03)
router.post(
  "/permintaan",
  requireAuth,
  upload.single("file"),
  handleUploadError,
  permintaan.add
);
router.get("/permintaan", requireAuth, permintaan.get);
router.get("/permintaan/:id", requireAuth, permintaan.getOne);
router.put(
  "/permintaan/:id",
  requireAuth,
  upload.single("file"),
  handleUploadError,
  permintaan.update
);
router.delete("/permintaan/:id", requireAuth, permintaan.delete);
router.post("/permintaan/status", requireAuth, permintaan.updateStatus);

// Audit KKA (Upload parser placed AFTER requireAuth - F03)
router.post("/audit_kka/awal", requireAuth, auditCon.firstAdd);
router.get("/audit_kka/user/file/all", requireAuth, auditCon.getGroupedUserFiles);
router.post(
  "/audit_kka/user/file",
  requireAuth,
  upload.single("file"),
  handleUploadError,
  auditCon.userFileAdd
);
router.put(
  "/audit_kka/user/file/update/:id",
  requireAuth,
  upload.single("file"),
  handleUploadError,
  auditCon.userFileUpdate
);
router.post(
  "/audit_kka/obrik/file",
  requireAuth,
  upload.single("file"),
  handleUploadError,
  auditCon.obrikFileAdd
);
router.post(
  "/audit_kka/bpkp/file",
  requireAuth,
  upload.single("file"),
  handleUploadError,
  auditCon.bpkpFileAdd
);
router.get("/audit_kka/user/file/:id_penugasan", requireAuth, auditCon.userFileGet);

router.post(
  "/audit_kka",
  requireAuth,
  upload.fields([
    { name: "file_kesimpulan", maxCount: 1 },
    { name: "file_bukti_dukung", maxCount: 1 },
    { name: "hasil_pengujian", maxCount: 5 },
  ]),
  handleUploadError,
  auditCon.add
);
router.get("/audit_kka", requireAuth, auditCon.get);
router.get("/audit_kka/:id", requireAuth, auditCon.getOne);
router.get("/audit_kka/penugasan/:id_penugasan", requireAuth, auditCon.getOnePenugasan);
router.put("/audit_kka/:id", requireAuth, auditCon.update);
router.delete("/audit_kka/:id", requireAuth, requireAdmin, auditCon.delete);

// ==========================================
// 3. MINIO FILE SERVING (Protected & Sanitized - F04)
// ==========================================

const serveMinioFile = async (req, res, isDownload = false) => {
  try {
    const rawObjectName = req.params.objectName;
    if (!rawObjectName) {
      return res.status(400).json({ error: "Nama objek file diperlukan." });
    }

    const objectName = decodeURIComponent(rawObjectName);

    // Path traversal check
    if (
      objectName.includes("..") ||
      objectName.includes("/") ||
      objectName.includes("\\") ||
      /\x00/.test(objectName)
    ) {
      return res.status(400).json({ error: "Nama objek file tidak valid." });
    }

    const bucketName = process.env.MINIO_BUCKET || "inspektorat";
    const downloadRequested =
      isDownload ||
      req.query.download === "true" ||
      req.query.action === "download";

    // Clean original filename by stripping timestamp prefix (e.g. 1712345678_file.pdf -> file.pdf)
    const displayName =
      objectName.replace(/^\d+_/, "").replace(/["\r\n]/g, "") || objectName;
    const mimeType = mime.lookup(objectName) || "application/octet-stream";

    const dataStream = await minioClient.getObject(bucketName, objectName);

    // Security headers to prevent inline XSS from uploaded HTML/SVG
    res.setHeader(
      "Content-Disposition",
      `${downloadRequested ? "attachment" : "inline"}; filename="${displayName}"`
    );
    res.setHeader("Content-Type", mimeType);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", "default-src 'none'");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );

    dataStream.on("error", (streamErr) => {
      console.error("Error during streaming from MinIO:", streamErr);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error during streaming" });
      }
    });

    dataStream.pipe(res);
  } catch (err) {
    console.error("Error fetching object from MinIO:", err);
    if (err.code === "NoSuchKey" || err.code === "NotFound") {
      return res.status(404).json({ error: "File not found" });
    }
    if (err.code === "AccessDenied") {
      return res.status(403).json({ error: "Access Denied by MinIO" });
    }
    return res
      .status(500)
      .json({ error: err.message || "Internal Server Error" });
  }
};

// Download file MinIO (attachment) - Requires Authentication
router.get("/file/download/:objectName", requireAuth, (req, res) => {
  serveMinioFile(req, res, true);
});

// Show / Read file MinIO (inline) - Requires Authentication
router.get("/file/:objectName", requireAuth, (req, res) => {
  serveMinioFile(req, res, false);
});

module.exports = router;
