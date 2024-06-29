"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "permintaans",
      "np_ref_pka",
      "no_ref_pka"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "permintaans",
      "no_ref_pka",
      "np_ref_pka"
    );
  },
};
