// models/audit_kka.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AuditKka extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  AuditKka.init(
    {
      no_penugasan: DataTypes.STRING,
      no_ref_kka: DataTypes.STRING,
      no_ref_pka: DataTypes.STRING,
      judul: DataTypes.STRING,
      tim_anggota: {
        type: DataTypes.JSON, // Use JSON to store array
        allowNull: true,
      },
      tim_ketua: DataTypes.STRING,
      obrik: DataTypes.STRING,
      pj: DataTypes.STRING,
      bpkp: DataTypes.STRING,
      dalnis: DataTypes.STRING,
      catatan_review: DataTypes.TEXT,
      catatan_wpj: DataTypes.TEXT,
      file_kesimpulan: DataTypes.STRING,
      file_bukti_dukung: DataTypes.STRING,
      hasil_pengujian: {
        type: DataTypes.JSON,
      },
    },
    {
      sequelize,
      modelName: "audit_kka",
      tableName: "audit_kka",
      timestamps: true,
    }
  );

  return AuditKka;
};
