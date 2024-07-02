"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update existing data to valid JSON
    await queryInterface.sequelize.query(`
      UPDATE audit_kka
      SET tim_anggota = 'null'
      WHERE tim_anggota IS NULL OR tim_anggota = ''
    `);

    // Change column type to JSON
    await queryInterface.changeColumn("audit_kka", "tim_anggota", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("audit_kka", "tim_anggota", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
