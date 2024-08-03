"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("penugasans", "catatan_kpk", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("penugasans", "catatan_pj", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("penugasans", "catatan_kpk");
    await queryInterface.removeColumn("penugasans", "catatan_pj");
  },
};
