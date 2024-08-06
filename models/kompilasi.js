"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kompilasi extends Model {
    static associate(models) {
      Kompilasi.hasMany(models.Rekomendasi, {
        foreignKey: "id_kompilasi",
        as: "rekomendasis", // Alias unik
      });
      Kompilasi.belongsTo(models.Penugasan, {
        foreignKey: "penugasan_id", // Pastikan ini adalah foreignKey yang benar
        as: "penugasan", // Gunakan alias yang berbeda dari "penugasankompilasi"
      });
    }
  }

  Kompilasi.init(
    {
      kondisi: DataTypes.STRING,
      kriteria: DataTypes.STRING,
      sebab: DataTypes.STRING,
      akibat: DataTypes.STRING,
      no_lhp: DataTypes.STRING,
      tgl_lhp: DataTypes.STRING,
      temuan: DataTypes.STRING,
      no_temuan: DataTypes.STRING,
      penugasan_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Kompilasi",
      tableName: "kompilasi",
    }
  );

  return Kompilasi;
};
