"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chat.init(
    {
      no: DataTypes.STRING,
      penugasan_id: DataTypes.INTEGER,
      tim_id: DataTypes.INTEGER,
      penerima: DataTypes.STRING,
      pengirim: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "chat",
    }
  );
  return Chat;
};
