"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Penugasan extends Model {
    static associate(models) {
      Penugasan.hasMany(models.Kompilasi, {
        foreignKey: "penugasan_id",
        as: "kompilasis", // Ubah alias ini jika diperlukan
      });
    }
  }

  Penugasan.init(
    {
      no: DataTypes.STRING,
      tgl: DataTypes.DATE,
      uraian: DataTypes.STRING,
      bpkp: DataTypes.STRING,
      tgl_mulai: DataTypes.DATE,
      tgl_berakhir: DataTypes.DATE,
      pj_id: DataTypes.INTEGER,
      wpj_id: DataTypes.INTEGER,
      obrik_id: DataTypes.INTEGER,
      dalnis_id: DataTypes.INTEGER,
      catatan_kpk: DataTypes.STRING,
      catatan_pj: DataTypes.STRING,
      catatan_dalnis: DataTypes.STRING,
      catatan_wpj: DataTypes.STRING,
      bpkp: DataTypes.STRING,
      tim_id: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      kt_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "penugasans",
      modelName: "Penugasan",
    }
  );

  return Penugasan;
};
