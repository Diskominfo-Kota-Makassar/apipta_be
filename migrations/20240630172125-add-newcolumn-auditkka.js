"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("audit_kka", "bpkp", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("audit_kka", "dalnis", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("audit_kka", "pj", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("audit_kka", "obrik", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("audit_kka", "bpkp");
    await queryInterface.removeColumn("audit_kka", "dalnis");
    await queryInterface.removeColumn("audit_kka", "pj");
    await queryInterface.removeColumn("audit_kka", "obrik");
  },
};
