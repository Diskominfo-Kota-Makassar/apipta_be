const db = require("../models");

exports.add = async (req, res) => {
  // const { kondisi,kriteria,sebab,akibat,rekomendasi } = req.body;

  try {
    // Create new kompilasi
    const dataa = await db.Kompilasi.create(req.body);
    res.status(201).json({ message: "kompilasi.", data: dataa });
  } catch (error) {
    console.error("kompilasi Error:", error);
    res.status(500).json({ message: "Error registering new kompilasi." });
  }
};

exports.addRekom = async (req, res) => {
  const { id_kompilasi, masukan } = req.body;

  try {
    // Create new kompilasi
    const dataa = await db.Rekomendasi.create({ id_kompilasi, masukan });
    res.status(201).json({ message: "kompilasi.", data: dataa });
  } catch (error) {
    console.error("kompilasi Error:", error);
    res.status(500).json({ message: "Error registering new kompilasi." });
  }
};

exports.UpdateRekom = async (req, res) => {
  const { id } = req.params;

  try {
    // Create new kompilasi
    const [updated] = await db.Rekomendasi.update(req.body, {
      where: { id: id },
    });
    if (updated) {
      const updatedkompilasi = await db.Kompilasi.findOne({
        where: { id: id },
      });
      return res.status(200).json({
        message: "Rekomendasi updated successfully!",
        data: updatedkompilasi,
      });
    }
    throw new Error("kompilasi not found");
  } catch (error) {
    console.error("kompilasi Error:", error);
    res.status(500).json({ message: "Error update  kompilasi." });
  }
};

exports.addAksi = async (req, res) => {
  const { id_rekomendasi, masukan } = req.body;

  try {
    // Create new kompilasi
    const dataa = await db.Aksi.create({ id_rekomendasi, masukan });
    res.status(201).json({ message: "kompilasi.", data: dataa });
  } catch (error) {
    console.error("kompilasi Error:", error);
    res.status(500).json({ message: "Error registering new kompilasi." });
  }
};

exports.UpdateAksi = async (req, res) => {
  const { id } = req.params; // assuming the kompilasi ID is passed as a URL parameter

  try {
    const [updated] = await db.Aksi.update(req.body, {
      where: { id: id },
    });

    if (updated) {
      const updatedkompilasi = await db.Aksi.findOne({
        where: { id: id },
      });
      return res.status(200).json({
        message: "aksi updated successfully!",
        data: updatedkompilasi,
      });
    }
    throw new Error("aksi not found");
  } catch (error) {
    console.error("Update kompilasi Error:", error);
    res.status(500).json({ message: "Error updating aksi." });
  }
};

exports.get = async (req, res) => {
  try {
    const kompilasi = await db.Kompilasi.findAll({
      include: [
        { model: db.Penugasan, as: "penugasan" },
        {
          model: db.Rekomendasi,
          as: "rekomendasis", // Use the alias defined in the association
          include: [
            {
              model: db.Aksi,
              as: "aksis", // Use the alias defined in the association
            },
          ],
        },
      ],
    });
    for (const datakom of kompilasi) {
      if (datakom.penugasan) {
        // Get user name for kt_id
        if (datakom.penugasan.kt_id) {
          const userKT = await db.User.findOne({
            where: { id: datakom.penugasan.kt_id },
          });
          datakom.penugasan.setDataValue(
            "nama_kt",
            userKT ? userKT.nama : null
          );
        }

        // Get user name for pj_id
        if (datakom.penugasan.pj_id) {
          const userPJ = await db.User.findOne({
            where: { id: datakom.penugasan.pj_id },
          });
          datakom.penugasan.setDataValue(
            "nama_pj",
            userPJ ? userPJ.nama : null
          );
        }

        // Get user name for wpj_id
        if (datakom.penugasan.wpj_id) {
          const userWPJ = await db.User.findOne({
            where: { id: datakom.penugasan.wpj_id },
          });
          datakom.penugasan.setDataValue(
            "nama_wpj",
            userWPJ ? userWPJ.nama : null
          );
        }

        // Get user name for dalnis_id
        if (datakom.penugasan.dalnis_id) {
          const userDalnis = await db.User.findOne({
            where: { id: datakom.penugasan.dalnis_id },
          });
          datakom.penugasan.setDataValue(
            "nama_dalnis",
            userDalnis ? userDalnis.nama : null
          );
        }

        if (datakom.penugasan.obrik_id) {
          const userObrik = await db.User.findOne({
            where: { id: datakom.penugasan.obrik_id },
          });
          datakom.penugasan.setDataValue(
            "nama_obrik",
            userObrik ? userObrik.nama : null
          );
        }

        // Get user names for tim_id (assuming tim_id is an array of JSON)
        if (datakom.penugasan.tim_id) {
          const timIds = JSON.parse(datakom.penugasan.tim_id);
          const usersTim = await db.User.findAll({ where: { id: timIds } });
          const namaTim = usersTim.map((user) => user.nama);
          datakom.penugasan.setDataValue("nama_tim", namaTim);
        }
      }
    }

    return res
      .status(200)
      .json({ message: "kompilasi successful!", data: kompilasi });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const kompilasi = await db.Kompilasi.findOne({
      where: { id: req.params.id },
    });
    return res
      .status(200)
      .json({ message: "kompilasi successful!", data: kompilasi });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params; // assuming the kompilasi ID is passed as a URL parameter

  try {
    const [updated] = await db.Kompilasi.update(req.body, {
      where: { id: id },
    });

    if (updated) {
      const updatedkompilasi = await db.Kompilasi.findOne({
        where: { id: id },
      });
      return res.status(200).json({
        message: "kompilasi updated successfully!",
        data: updatedkompilasi,
      });
    }
    throw new Error("kompilasi not found");
  } catch (error) {
    console.error("Update kompilasi Error:", error);
    res.status(500).json({ message: "Error updating kompilasi." });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params; // assuming the kompilasi ID is passed as a URL parameter

  try {
    const kompilasi = await db.Kompilasi.findOne({ where: { id: id } });
    if (kompilasi) {
      await kompilasi.destroy();
      return res
        .status(200)
        .json({ message: "kompilasi deleted successfully!" });
    }
    return res.status(404).json({ message: "kompilasi not found" });
  } catch (error) {
    console.error("Delete kompilasi Error:", error);
    res.status(500).json({ message: "Error deleting kompilasi." });
  }
};
exports.deleteRekomendasi = async (req, res) => {
  const { id } = req.params; // assuming the kompilasi ID is passed as a URL parameter

  try {
    const kompilasi = await db.Rekomendasi.findOne({ where: { id: id } });
    if (kompilasi) {
      await kompilasi.destroy();
      return res
        .status(200)
        .json({ message: "rekomendasi deleted successfully!" });
    }
    return res.status(404).json({ message: "kompilasi not found" });
  } catch (error) {
    console.error("Delete kompilasi Error:", error);
    res.status(500).json({ message: "Error deleting kompilasi." });
  }
};
exports.deleteAksi = async (req, res) => {
  const { id } = req.params; // assuming the kompilasi ID is passed as a URL parameter

  try {
    const kompilasi = await db.Aksi.findOne({ where: { id: id } });
    if (kompilasi) {
      await kompilasi.destroy();
      return res.status(200).json({ message: "aksi deleted successfully!" });
    }
    return res.status(404).json({ message: "kompilasi not found" });
  } catch (error) {
    console.error("Delete kompilasi Error:", error);
    res.status(500).json({ message: "Error deleting kompilasi." });
  }
};
