"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Penugasan extends Model {
    static associate(models) {
      // Penugasan.hasMany(models.Notif, {
      //   foreignKey: "penugasan_id",
      //   as: "notifss", // Use a different alias to avoid collision
      // });
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
      dalnis_id: DataTypes.INTEGER,
      catatan_kpk: DataTypes.STRING,
      catatan_pj: DataTypes.STRING,
      catatan_dalnis: DataTypes.STRING,
      catatan_wpj: DataTypes.STRING,
      bpkp: DataTypes.STRING,
      tim_id: {
        type: DataTypes.JSON, // Use JSON to store array
        allowNull: true,
      },
      kt_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "penugasans",
      modelName: "Penugasan", // Use proper model name
    }
  );

  return Penugasan;
};
