const db = require("../models");

exports.add = async (req, res) => {
  try {
    const penugasan = await db.penugasan.create({
      ...req.body,
      tim_id: JSON.stringify(req.body.tim_id), // Ensure tim_id is serialized; only necessary if DB or Sequelize doesn't handle it automatically
    });
    res.status(201).json({ message: "Penugasan.", data: penugasan });
  } catch (error) {
    console.error("Penugasan Error:", error);
    res.status(500).json({ message: "Error registering new penugasan." });
  }
};

exports.get = async (req, res) => {
  try {
    const role = await db.penugasan.findAll();
    return res.status(200).json({ message: "Role successful!", data: role });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const role = await db.penugasan.findOne({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Role successful!", data: role });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params; // assuming the role ID is passed as a URL parameter

  try {
    const [updated] = await db.penugasan.update(req.body, {
      where: { id: id },
    });

    if (updated) {
      const updatedData = await db.penugasan.findOne({ where: { id: id } });
      return res.status(200).json({
        message: "penugasan updated successfully!",
        data: updatedData,
      });
    }
    throw new Error("penugasan not found");
  } catch (error) {
    console.error("Update penugasan Error:", error);
    res.status(500).json({ message: "Error updating penugasan." });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params; // assuming the role ID is passed as a URL parameter

  try {
    const penugasan = await db.penugasan.findOne({ where: { id: id } });
    if (penugasan) {
      await penugasan.destroy();
      return res
        .status(200)
        .json({ message: "penugasan deleted successfully!" });
    }
    return res.status(404).json({ message: "penugasan not found" });
  } catch (error) {
    console.error("Delete penugasan Error:", error);
    res.status(500).json({ message: "Error deleting penugasan." });
  }
};
