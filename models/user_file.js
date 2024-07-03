"use strict";
const { Model } = require("sequelize");
const { models } = require("./index");
module.exports = (sequelize, DataTypes) => {
  class UserFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserFile.init(
    {
      user_id: DataTypes.INTEGER,
      penugasan_id: DataTypes.INTEGER,
      file: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user_files",
    }
  );

  return UserFile;
};
