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
          as: "rekomendasis",
          include: [{ model: db.Aksi, as: "aksis" }],
        },
      ],
    });

    // Process and format the data to exclude specific properties
    const result = await Promise.all(
      kompilasi.map(async (datakom) => {
        if (datakom.penugasan) {
          const {
            catatan_kpk,
            catatan_pj,
            catatan_dalnis,
            catatan_wpj,
            uraian,
            ...penugasanData
          } = datakom.penugasan.get({ plain: true });

          if (datakom.penugasan.kt_id) {
            const userKT = await db.User.findOne({
              where: { id: datakom.penugasan.kt_id },
            });
            penugasanData.nama_kt = userKT ? userKT.nama : null;
            penugasanData.nip_kt = userKT ? userKT.nip : null;
          }

          if (datakom.penugasan.pj_id) {
            const userPJ = await db.User.findOne({
              where: { id: datakom.penugasan.pj_id },
            });
            penugasanData.nama_pj = userPJ ? userPJ.nama : null;
            penugasanData.nip_pj = userPJ ? userPJ.nip_pj : null;
          }

          if (datakom.penugasan.wpj_id) {
            const userWPJ = await db.User.findOne({
              where: { id: datakom.penugasan.wpj_id },
            });
            penugasanData.nama_wpj = userWPJ ? userWPJ.nama : null;
            penugasanData.nip_wpj = userWPJ ? userWPJ.nip : null;
          }

          if (datakom.penugasan.dalnis_id) {
            const userDalnis = await db.User.findOne({
              where: { id: datakom.penugasan.dalnis_id },
            });
            penugasanData.nama_dalnis = userDalnis ? userDalnis.nama : null;
            penugasanData.nip_dalnis = userDalnis ? userDalnis.nip : null;
          }

          if (datakom.penugasan.obrik_id) {
            const userObrik = await db.User.findOne({
              where: { id: datakom.penugasan.obrik_id },
            });
            penugasanData.nama_obrik = userObrik ? userObrik.nama : null;
            penugasanData.nip_obrik = userObrik ? userObrik.nip : null;
          }

          if (datakom.penugasan.tim_id) {
            const timIds = JSON.parse(datakom.penugasan.tim_id);
            const usersTim = await db.User.findAll({ where: { id: timIds } });
            penugasanData.tim = usersTim.map((user) => ({
              nama: user.nama,
              nip: user.nip,
            }));
          }

          return {
            ...datakom.get({ plain: true }),
            penugasan: penugasanData,
          };
        }

        return datakom.get({ plain: true });
      })
    );

    return res.status(200).json({
      message: "kompilasi successful!",
      data: result,
    });
  } catch (error) {
    console.error(error);
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
