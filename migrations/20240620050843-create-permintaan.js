"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("permintaans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      no: {
        type: Sequelize.STRING,
      },
      tgl_penugasan: {
        type: Sequelize.DATE,
      },
      uraian: {
        type: Sequelize.STRING,
      },
      no_ref_kka: {
        type: Sequelize.STRING,
      },
      np_ref_pka: {
        type: Sequelize.STRING,
      },
      judul_doc: {
        type: Sequelize.STRING,
      },
      ket: {
        type: Sequelize.STRING,
      },
      file: {
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
    await queryInterface.dropTable("permintaans");
  },
};
