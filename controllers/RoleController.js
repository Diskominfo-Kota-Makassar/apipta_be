const db = require("../models");

exports.add = async (req, res) => {
  const { name } = req.body;

  try {
    // Create new user
    const user = await db.role.create({ name });
    res.status(201).json({ message: "Role.", userId: user.id });
  } catch (error) {
    console.error("Role Error:", error);
    res.status(500).json({ message: "Error registering new role." });
  }
};

exports.get = async (req, res) => {
  try {
    const role = await db.role.findAll();
    return res.status(200).json({ message: "Role successful!", data: role });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllRolesWithUsers = async (req, res) => {
  try {
    const rolesWithUsers = await db.Role.findAll({
      include: [
        {
          model: db.User,
          as: "users",
        },
      ],
    });

    res.status(200).json({
      message: "Roles and associated users fetched successfully",
      data: rolesWithUsers,
    });
  } catch (error) {
    console.error("Error fetching roles with users:", error);
    res.status(500).json({
      message: "Error fetching roles with associated users",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params; // assuming the role ID is passed as a URL parameter
  const { name } = req.body; // new name for the role

  try {
    const [updated] = await db.role.update(
      { name },
      {
        where: { id: id },
      }
    );

    if (updated) {
      const updatedRole = await db.role.findOne({ where: { id: id } });
      return res
        .status(200)
        .json({ message: "Role updated successfully!", data: updatedRole });
    }
    throw new Error("Role not found");
  } catch (error) {
    console.error("Update Role Error:", error);
    res.status(500).json({ message: "Error updating role." });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params; // assuming the role ID is passed as a URL parameter

  try {
    const role = await db.role.findOne({ where: { id: id } });
    if (role) {
      await role.destroy();
      return res.status(200).json({ message: "Role deleted successfully!" });
    }
    return res.status(404).json({ message: "Role not found" });
  } catch (error) {
    console.error("Delete Role Error:", error);
    res.status(500).json({ message: "Error deleting role." });
  }
};
