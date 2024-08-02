const db = require("../models");
const bcryptjs = require("bcryptjs");
const { Op } = require("sequelize");

// Example of Create operation
exports.register = async (req, res) => {
  // const { nama, username, password, role_id } = req.body;

  try {
    const existingUser = await db.User.findOne({
      where: { username: req.body.username },
    });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }

    // Create new user
    const user = await db.User.create(req.body);
    res
      .status(201)
      .json({ message: "User registered successfully.", userId: user.id });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Error registering new user." });
  }
};

exports.login = async (req, res) => {
  const { username, password, id_penugasan } = req.body;

  try {
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    bcryptjs.compare(password, user.password, async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error." });
      }
      if (result) {
        return res.status(200).json({
          message: "Authentication successful!",
          data: user,
        });
        // try {
        //   const assignments = await exports.findUserAssignments(
        //     user.id,
        //     id_penugasan
        //   );
        //   if (assignments.length > 0) {
        //     return res.status(200).json({
        //       message: "Authentication successful!",
        //       data: user,
        //       assignments: assignments,
        //     });
        //   } else {
        //     return res
        //       .status(404)
        //       .json({ message: "No assignments found for the specified ID." });
        //   }
        // } catch (error) {
        //   return res.status(500).json({ message: error.message });
        // }
      } else {
        return res
          .status(401)
          .json({ message: "Authentication failed. Passwords did not match." });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.findUserAssignments = async (userId, id_penugasan) => {
  try {
    const assignments = await db.Penugasan.findAll({
      where: {
        id: id_penugasan, // Ensure this condition is part of the query
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
    const user = await db.User.findAll({
      include: [
        {
          model: db.Role,
          as: "role",
        },
      ],
    });
    return res
      .status(200)
      .json({ message: "Authentication successful!", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.UpdateUser = async (req, res) => {
  const { id } = req.params; // assuming the kompilasi ID is passed as a URL parameter
  if (req.body.password != null) {
    const salt = await bcryptjs.genSalt(10);
    req.body.password = await bcryptjs.hash(req.body.password, salt);
  }
  try {
    const [updated] = await db.User.update(req.body, {
      where: { id: id },
    });

    if (updated) {
      const updatedkompilasi = await db.User.findOne({
        where: { id: id },
      });
      return res.status(200).json({
        message: "User updated successfully!",
        data: updatedkompilasi,
      });
    }
    throw new Error("User not found");
  } catch (error) {
    console.error("Update kompilasi Error:", error);
    res.status(500).json({ message: "Error updating User." });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params; // assuming the role ID is passed as a URL parameter

  try {
    const user = await db.User.findOne({ where: { id: id } });
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
