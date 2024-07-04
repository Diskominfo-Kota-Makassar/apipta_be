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

exports.get = async (req, res) => {
  try {
    const kompilasi = await db.Kompilasi.findAll();
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
