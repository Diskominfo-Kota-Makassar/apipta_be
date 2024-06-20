"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Penugasan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Penugasan.init(
    {
      No: DataTypes.STRING,
      tgl: DataTypes.DATE,
      uraian: DataTypes.STRING,
      tgl_mulai: DataTypes.DATE,
      tgl_berakhir: DataTypes.DATE,
      pj_id: DataTypes.INTEGER,
      wpj_id: DataTypes.INTEGER,
      dalnis_id: DataTypes.INTEGER,
      tim_id: DataTypes.INTEGER,
      kt_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "penugasan",
    }
  );
  return Penugasan;
};
