"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kompilasi", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      kondisi: {
        type: Sequelize.STRING,
      },
      kriteria: {
        type: Sequelize.STRING,
      },
      sebab: {
        type: Sequelize.STRING,
      },
      akibat: {
        type: Sequelize.STRING,
      },
      rekomendasi: {
        type: Sequelize.STRING,
      },
      aksi: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("kompilasi");
  },
};
