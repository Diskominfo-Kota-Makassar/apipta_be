"use strict";
const { Model } = require("sequelize");
const bcryptjs = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      nama: DataTypes.STRING,
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      masa_berlaku: DataTypes.DATE,
      entitas: DataTypes.STRING,
      email: DataTypes.STRING,
      nip: DataTypes.STRING,
      golongan: DataTypes.STRING,
      jabatan: DataTypes.STRING,
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Role",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "users",
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcryptjs.genSalt(10);
          user.password = await bcryptjs.hash(user.password, salt);
        },
      },
    }
  );

  return User;
};
