const db = require("../models");
const bcryptjs = require("bcryptjs");

// Example of Create operation
exports.register = async (req, res) => {
  const { nama, username, password, role_id } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }

    // Create new user
    const user = await db.User.create({ nama, username, password, role_id });
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
        return res.status(200).json({ message: "Authentication successful!" });
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
