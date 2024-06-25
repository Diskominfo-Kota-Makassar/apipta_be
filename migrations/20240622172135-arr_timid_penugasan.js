"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("penugasans", "tim_id", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Optional: define how to revert the JSON array back to INTEGER or another type
    await queryInterface.changeColumn("penugasans", "tim_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
