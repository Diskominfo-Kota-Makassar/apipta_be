const db = require("../models");
const minioClient = require("../services/minio");
require("dotenv").config();

exports.firstAdd = async (req, res) => {
  const {
    no_penugasan,
    no_ref_kka,
    no_ref_pka,
    judul,
    tim_anggota,
    rincian_pengujian,
  } = req.body;

  try {
    // Create audit_kka entry in the database
    const newAuditKka = await db.Audit.create({
      no_penugasan,
      no_ref_kka,
      no_ref_pka,
      judul,
      tim_anggota,
      rincian_pengujian,
    });

    res.status(201).send({
      message: "Audit KKA first created successfully!",
      auditKka: newAuditKka,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.userFileGet = async (req, res) => {
  try {
    const auditKka = await db.UserFile.findAll({
      where: {
        penugasan_id: req.params.id_penugasan,
      },
    });

    for (let i = 0; i < auditKka.length; i++) {
      const user = await db.User.findOne({
        where: { id: auditKka[i].user_id },
        include: [
          {
            model: db.Role,
            as: "role",
          },
        ],
      });

      // Convert to plain object if necessary
      if (auditKka[i].toJSON) {
        auditKka[i] = auditKka[i].toJSON();
      }

      auditKka[i]["user"] = user ? user.toJSON() : null; // Add user data with role
    }

    return res
      .status(200)
      .json({ message: "userfile successful!", data: auditKka });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.obrikFileAdd = async (req, res) => {
  const { id_audit, obrik } = req.body;
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const fileName = Date.now() + "_" + req.file.originalname;
    const filePath = `${fileName}`;
    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      filePath,
      req.file.buffer
    );
    const newUserFile = await db.Audit.update(
      {
        obrik,
        file_obrik: filePath,
      },
      {
        where: { id: id_audit },
      }
    );
    res.status(201).send({
      message: "UserFile created successfully!",
      auditKka: newAuditKka,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.bpkpFileAdd = async (req, res) => {
  const { id_audit, bpkp } = req.body;
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const fileName = Date.now() + "_" + req.file.originalname;
    const filePath = `${fileName}`;
    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      filePath,
      req.file.buffer
    );
    await db.Audit.update(
      {
        bpkp,
        file_bpkp: filePath,
      },
      {
        where: { id: id_audit },
      }
    );
    res.status(201).send({
      message: "UserFile created successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || "Internal Server Error");
  }
};

exports.userFileAdd = async (req, res) => {
  const { penugasan_id, user_id } = req.body;
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const fileName = Date.now() + "_" + req.file.originalname;
    const filePath = `${fileName}`;

    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      filePath,
      req.file.buffer
    );
    const newUserFile = await db.UserFile.create({
      user_id,
      penugasan_id,
      file: filePath,
    });
    res.status(201).send({
      message: "UserFile created successfully!",
      auditKka: newUserFile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.userFileUpdate = async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const fileName = Date.now() + "_" + req.file.originalname;
    const filePath = `${fileName}`;

    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      filePath,
      req.file.buffer
    );
    const dataaaa = await db.UserFile.update(
      {
        file: filePath,
      },
      {
        where: { id: id },
      }
    );
    // const userfileCheck = await db.UserFile.findByPk(id);

    // // Check if the permintaan exists
    // if (!userfileCheck) {
    //   console.log(`No userfile found with ID: ${id}`); // Debug log
    //   return res.status(404).json({ message: "userfile not found" });
    // }

    // // Update the status
    // await UserFile.update({ file: filePath });

    res.status(201).send({
      message: "UserFile updated successfully!",
      // auditKka: newUserFile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.add = async (req, res) => {
  const { id_audit, tim_ketua, catatan_review, catatan_wpj, hasil_pengujian } =
    req.body;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  try {
    // Upload single file for file_kesimpulan
    const fileKesimpulan = req.files["file_kesimpulan"][0];
    const fileKesimpulanName = Date.now() + "_" + fileKesimpulan.originalname;
    const fileKesimpulanPath = `${fileKesimpulanName}`;
    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      fileKesimpulanPath,
      fileKesimpulan.buffer
    );

    // Upload single file for file_bukti_dukung
    const fileBuktiDukung = req.files["file_bukti_dukung"][0];
    const fileBuktiDukungName = Date.now() + "_" + fileBuktiDukung.originalname;
    const fileBuktiDukungPath = `${fileBuktiDukungName}`;
    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      fileBuktiDukungPath,
      fileBuktiDukung.buffer
    );

    // Upload multiple files for hasil_pengujian
    const hasilPengujianFiles = req.files["hasil_pengujian"];
    const hasilPengujianPaths = [];
    for (let i = 0; i < hasilPengujianFiles.length; i++) {
      const file = hasilPengujianFiles[i];
      const fileName = Date.now() + "_" + file.originalname;
      const filePath = `${fileName}`;
      await minioClient.putObject(
        process.env.MINIO_BUCKET,
        filePath,
        file.buffer
      );
      hasilPengujianPaths.push(filePath);
    }

    // Create audit_kka entry in the database
    const newAuditKka = await db.Audit.update(
      {
        tim_ketua,
        catatan_review,
        catatan_wpj,
        file_kesimpulan: fileKesimpulanPath,
        file_bukti_dukung: fileBuktiDukungPath,
        hasil_pengujian: hasilPengujianPaths,
      },
      {
        where: { id: id_audit },
      }
    );

    res.status(201).send({
      message: "Audit KKA created successfully!",
      auditKka: newAuditKka,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.get = async (req, res) => {
  try {
    const auditKka = await db.Audit.findAll();
    return res
      .status(200)
      .json({ message: "auditKka successful!", data: auditKka });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const auditKka = await db.Audit.findOne({
      where: { id: req.params.id },
    });
    return res
      .status(200)
      .json({ message: "auditKka successful!", data: auditKka });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOnePenugasan = async (req, res) => {
  try {
    const penugasan = await db.Penugasan.findOne({
      where: { id: req.params.id_penugasan },
    });
    if (penugasan != null) {
      console.log("askjdnasjkndjasd");
      console.log(penugasan);
      const auditKka = await db.Audit.findAll({
        where: { no_penugasan: penugasan.no },
      });
      return res
        .status(200)
        .json({ message: "auditKka successful!", data: auditKka });
    }
    return res.status(200).json({ message: "Not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params; // assuming the role ID is passed as a URL parameter

  try {
    const [updated] = await db.Audit.update(req.body, {
      where: { id: id },
    });

    if (updated) {
      const updatedData = await db.Audit.findOne({ where: { id: id } });
      return res.status(200).json({
        message: "auditKka updated successfully!",
        data: updatedData,
      });
    }
    throw new Error("auditKka not found");
  } catch (error) {
    console.error("Update auditKka Error:", error);
    res.status(500).json({ message: "Error updating auditKka." });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params; // assuming the role ID is passed as a URL parameter

  try {
    const auditKka = await db.Audit.findOne({ where: { id: id } });
    if (auditKka) {
      await auditKka.destroy();
      return res
        .status(200)
        .json({ message: "auditKka deleted successfully!" });
    }
    return res.status(404).json({ message: "auditKka not found" });
  } catch (error) {
    console.error("Delete auditKka Error:", error);
    res.status(500).json({ message: "Error deleting auditKka." });
  }
};
