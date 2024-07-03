"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("audit_kka", "dalnis", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Optional: define how to revert the JSON array back to INTEGER or another type
    await queryInterface.changeColumn("audit_kka", "dalnis", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
