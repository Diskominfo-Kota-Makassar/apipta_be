"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Kompilasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the association here
      Kompilasi.hasMany(models.Rekomendasi, {
        foreignKey: "id_kompilasi",
        as: "rekomendasis", // Use a different alias to avoid collision
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
      rekomendasi: DataTypes.STRING,
      aksi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Kompilasi",
      tableName: "kompilasi",
    }
  );

  return Kompilasi;
};
