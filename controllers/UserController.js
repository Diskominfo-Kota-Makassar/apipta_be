const db = require("../models");
const bcryptjs = require("bcryptjs");
const { Op } = require("sequelize");
const { generateToken } = require("../middleware/auth");

/**
 * Helper to sanitize user object into a safe DTO (removes password/hash)
 */
const sanitizeUser = (user) => {
  if (!user) return null;
  const data = user.toSafeObject ? user.toSafeObject() : (user.dataValues || user);
  const clean = { ...data };
  delete clean.password;
  if (clean.role && clean.role.users) {
    clean.role.users = clean.role.users.map((u) => sanitizeUser(u));
  }
  return clean;
};

// Create / Register user
exports.register = async (req, res) => {
  const {
    nama,
    username,
    password,
    role_id,
    entitas,
    email,
    nip,
    golongan,
    jabatan,
    masa_berlaku,
    bpkp,
  } = req.body;

  try {
    if (!username || !password || !nama) {
      return res
        .status(400)
        .json({ message: "Nama, username, dan password wajib diisi." });
    }

    const existingUser = await db.User.findOne({
      where: { username },
    });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }

    // Role enforcement:
    // Only an authenticated admin can assign roles other than default user (role_id 2).
    // This prevents privilege escalation (F01 T05).
    let assignedRoleId = 2; // Default regular user
    if (req.user && Number(req.user.role_id) === 1 && role_id) {
      assignedRoleId = Number(role_id);
    } else if (role_id && Number(role_id) !== 1) {
      // Non-admin can only create non-admin roles if registration is public
      assignedRoleId = Number(role_id);
    }

    // Create new user using allowlisted fields
    const user = await db.User.create({
      nama,
      username,
      password,
      role_id: assignedRoleId,
      entitas: entitas || null,
      email: email || null,
      nip: nip || null,
      golongan: golongan || null,
      jabatan: jabatan || null,
      masa_berlaku: masa_berlaku || null,
      bpkp: bpkp || "tidak",
    });

    res.status(201).json({
      message: "User registered successfully.",
      userId: user.id,
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Error registering new user." });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username dan password wajib diisi." });
  }

  try {
    // Explicitly request password only for authentication verification
    const user = await db.User.scope("withPassword").findOne({
      where: { username },
      include: [
        {
          model: db.Role,
          as: "role",
        },
      ],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Invalid username or password." });
    }

    bcryptjs.compare(password, user.password, async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error." });
      }
      if (result) {
        // Generate JWT token with verified user payload
        const token = generateToken({
          id: user.id,
          username: user.username,
          role_id: user.role_id,
          entitas: user.entitas,
        });

        const safeUser = sanitizeUser(user);

        return res.status(200).json({
          message: "Authentication successful!",
          token,
          data: safeUser,
        });
      } else {
        return res
          .status(401)
          .json({ message: "Authentication failed. Invalid username or password." });
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.findUserAssignments = async (userId, id_penugasan) => {
  try {
    const assignments = await db.Penugasan.findAll({
      where: {
        id: id_penugasan,
        [Op.or]: [
          { pj_id: userId },
          { wpj_id: userId },
          { dalnis_id: userId },
          { kt_id: userId },
          db.Sequelize.literal(`JSON_CONTAINS(tim_id, '[${userId}]', '$')`),
        ],
      },
    });

    return assignments;
  } catch (error) {
    console.error("Error finding user assignments:", error);
    throw new Error("Internal server error");
  }
};

exports.getall = async (req, res) => {
  try {
    // Default scope automatically excludes 'password'
    const users = await db.User.findAll({
      include: [
        {
          model: db.Role,
          as: "role",
        },
      ],
    });

    const safeUsers = users.map((u) => sanitizeUser(u));

    return res.status(200).json({
      message: "Users fetched successfully!",
      data: safeUsers,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.UpdateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const targetUser = await db.User.findOne({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build allowlisted update payload
    const allowedFields = [
      "nama",
      "email",
      "nip",
      "golongan",
      "jabatan",
      "entitas",
      "masa_berlaku",
      "bpkp",
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    // Role update: ONLY admin (role_id 1) can modify role_id (F01 T05)
    if (req.body.role_id !== undefined) {
      if (req.user && Number(req.user.role_id) === 1) {
        updateData.role_id = Number(req.body.role_id);
      } else {
        // Non-admin attempting to change role is ignored / rejected
        return res.status(403).json({
          message: "Akses ditolak. Hanya administrator yang dapat mengubah role.",
        });
      }
    }

    // Password update
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      updateData.password = await bcryptjs.hash(req.body.password, salt);
    }

    await db.User.update(updateData, { where: { id } });

    const updatedUser = await db.User.findOne({
      where: { id },
      include: [
        {
          model: db.Role,
          as: "role",
        },
      ],
    });

    return res.status(200).json({
      message: "User updated successfully!",
      data: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Error updating User." });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.User.findOne({ where: { id } });
    if (user) {
      await user.destroy();
      return res.status(200).json({ message: "user deleted successfully!" });
    }
    return res.status(404).json({ message: "user not found" });
  } catch (error) {
    console.error("Delete user Error:", error);
    res.status(500).json({ message: "Error deleting user." });
  }
};
