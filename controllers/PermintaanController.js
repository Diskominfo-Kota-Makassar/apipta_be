const db = require("../models");
const minioClient = require("../services/minio");
require("dotenv").config();

exports.add = async (req, res) => {
  const { no, tgl_penugasan, uraian, no_ref_kka, no_ref_pka, judul_doc, ket } =
    req.body;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileName = Date.now() + "_" + req.file.originalname;
  const filePath = `${fileName}`;
  minioClient.putObject(
    "inspektorat",
    filePath,
    req.file.buffer,
    (err, etag) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      db.permintaan
        .create({
          no,
          tgl_penugasan,
          uraian,
          no_ref_kka,
          no_ref_pka,
          judul_doc,
          ket,
          file: filePath,
        })
        .then(() => res.status(201).send({ message: "permintaan successful!" }))
        .catch((err) => res.status(500).send(err));
    }
  );
};

exports.updateStatus = async (req, res) => {
  const { id, status } = req.body;

  try {
    // Find the Permintaan record by id
    const permintaan = await db.permintaan.findOne({ id: id });

    if (!permintaan) {
      return res.status(404).json({ message: "Permintaan not found" });
    }
    const permintaanUpdate = await db.permintaan.update(
      {
        status: status,
      },
      {
        where: { id: id },
      }
    );

    return res
      .status(200)
      .json({ message: "Status updated successfully", permintaanUpdate });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.get = async (req, res) => {
  try {
    const permintaan = await db.permintaan.findAll();
    return res
      .status(200)
      .json({ message: "permintaan successful!", data: permintaan });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const permintaan = await db.permintaan.findOne({
      where: { id: req.params.id },
    });
    return res
      .status(200)
      .json({ message: "permintaan successful!", data: permintaan });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params; // assuming the role ID is passed as a URL parameter

  try {
    const [updated] = await db.permintaan.update(req.body, {
      where: { id: id },
    });

    if (updated) {
      const updatedData = await db.permintaan.findOne({ where: { id: id } });
      return res.status(200).json({
        message: "permintaan updated successfully!",
        data: updatedData,
      });
    }
    throw new Error("permintaan not found");
  } catch (error) {
    console.error("Update permintaan Error:", error);
    res.status(500).json({ message: "Error updating permintaan." });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params; // assuming the role ID is passed as a URL parameter

  try {
    const permintaan = await db.permintaan.findOne({ where: { id: id } });
    if (permintaan) {
      await permintaan.destroy();
      return res
        .status(200)
        .json({ message: "permintaan deleted successfully!" });
    }
    return res.status(404).json({ message: "permintaan not found" });
  } catch (error) {
    console.error("Delete permintaan Error:", error);
    res.status(500).json({ message: "Error deleting permintaan." });
  }
};
