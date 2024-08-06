"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("kompilasi", "penugasan_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("kompilasi", "temuan", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("kompilasi", "no_temuan", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("kompilasi", "tgl_lhp", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("kompilasi", "penugasan_id");
    await queryInterface.removeColumn("kompilasi", "temuan");
    await queryInterface.removeColumn("kompilasi", "no_temuan");
    await queryInterface.removeColumn("kompilasi", "tgl_lhp");
  },
};
