"use strict";
const { Model } = require("sequelize");
const { models } = require("./index");
module.exports = (sequelize, DataTypes) => {
  class Kompilasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Kompilasi.init(
    {
      kondisi: DataTypes.STRING,
      kriteria: DataTypes.STRING,
      sebab: DataTypes.STRING,
      akibat: DataTypes.STRING,
      rekomendasi: DataTypes.STRING,
      aksi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "kompilasi",
      tableName: "kompilasi",
    }
  );

  return Kompilasi;
};
