"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notif extends Model {
    static associate(models) {
      Notif.belongsTo(models.Penugasan, {
        foreignKey: "penugasan_id",
        as: "penugasan",
      });
      Notif.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "users_pembuat",
      });
    }
  }

  Notif.init(
    {
      user_id: DataTypes.INTEGER,
      penugasan_id: DataTypes.INTEGER,
      audit_id: DataTypes.INTEGER,
      permintaan_id: DataTypes.INTEGER,
      user_id_baca: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "notif",
      modelName: "Notif", // Use proper model name
    }
  );

  return Notif;
};
