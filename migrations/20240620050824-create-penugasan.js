"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("penugasans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      no: {
        type: Sequelize.STRING,
      },
      tgl: {
        type: Sequelize.DATE,
      },
      uraian: {
        type: Sequelize.STRING,
      },
      tgl_mulai: {
        type: Sequelize.DATE,
      },
      tgl_berakhir: {
        type: Sequelize.DATE,
      },
      pj_id: {
        type: Sequelize.INTEGER,
      },
      wpj_id: {
        type: Sequelize.INTEGER,
      },
      dalnis_id: {
        type: Sequelize.INTEGER,
      },
      tim_id: {
        type: Sequelize.INTEGER,
      },
      kt_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("penugasans");
  },
};
