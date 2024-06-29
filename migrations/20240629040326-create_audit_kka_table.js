"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("audit_kka", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      no_penugasan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      no_ref_kka: {
        type: Sequelize.STRING,
      },
      no_ref_pka: {
        type: Sequelize.STRING,
      },
      judul: {
        type: Sequelize.STRING,
      },
      tim_anggota: {
        type: Sequelize.STRING,
      },
      tim_ketua: {
        type: Sequelize.STRING,
      },
      catatan_review: {
        type: Sequelize.TEXT,
      },
      catatan_wpj: {
        type: Sequelize.TEXT,
      },
      file_kesimpulan: {
        type: Sequelize.STRING,
      },
      file_bukti_dukung: {
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("audit_kka");
  },
};
