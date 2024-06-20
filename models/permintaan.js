"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permintaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Permintaan.init(
    {
      no: DataTypes.STRING,
      tgl_penugasan: DataTypes.DATE,
      uraian: DataTypes.STRING,
      no_ref_kka: DataTypes.STRING,
      np_ref_pka: DataTypes.STRING,
      judul_doc: DataTypes.STRING,
      ket: DataTypes.STRING,
      file: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "permintaan",
    }
  );
  return Permintaan;
};
