const db = require("../models");
const bcryptjs = require("bcryptjs");

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
  const { username, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    bcryptjs.compare(password, user.password, (err, result) => {
      if (result) {
        return res
          .status(200)
          .json({ message: "Authentication successful!", data: user });
      } else {
        return res
          .status(401)
          .json({ message: "Authentication failed. Passwords did not match." });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getall = async (req, res) => {
  try {
    const user = await db.User.findAll();
    return res
      .status(200)
      .json({ message: "Authentication successful!", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
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
