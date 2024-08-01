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
    // Ensure ID is provided
    if (!id) {
      return res.status(400).json({ message: "Missing ID parameter" });
    }

    // Find the Permintaan record by id
    const permintaan = await db.permintaan.findByPk(id);

    // Check if the permintaan exists
    if (!permintaan) {
      console.log(`No permintaan found with ID: ${id}`); // Debug log
      return res.status(404).json({ message: "Permintaan not found" });
    }

    // Update the status
    await permintaan.update({ status });

    // Respond with success
    return res.status(200).json({
      message: "Status updated successfully",
      permintaan: { id: permintaan.id, status: permintaan.status },
    });
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
          .update(
            { file: filePath },
            {
              where: { id: id },
            }
          )
          .then(
            () => {}
            // res.status(201).send({ message: "permintaan successful!" })
          )
          .catch((err) => res.status(500).send(err));
      }
    );

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
