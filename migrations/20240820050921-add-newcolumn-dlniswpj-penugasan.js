"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("penugasans", "catatan_dalnis", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("penugasans", "catatan_wpj", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("penugasans", "catatan_dalnis");
    await queryInterface.removeColumn("penugasans", "catatan_wpj");
  },
};
