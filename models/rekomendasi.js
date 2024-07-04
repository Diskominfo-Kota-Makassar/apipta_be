"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rekomendasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the association here
      Rekomendasi.belongsTo(models.Kompilasi, {
        foreignKey: "id_kompilasi",
        as: "kompilasi",
      });
      Rekomendasi.hasMany(models.Aksi, {
        foreignKey: "id_rekomendasi",
        as: "aksis", // Use a different alias to avoid collision
      });
    }
  }

  Rekomendasi.init(
    {
      id_kompilasi: DataTypes.INTEGER,
      masukan: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Rekomendasi",
      tableName: "rekomendasi",
    }
  );

  return Rekomendasi;
};
