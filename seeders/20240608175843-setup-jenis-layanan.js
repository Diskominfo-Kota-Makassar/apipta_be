"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        // { nama: "Buku Tamu", createdAt: new Date(), updatedAt: new Date() },
        // {
        //   nama: "Surat Keterangan Tidak Mampu",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   nama: "Surat Keterangan Belum Menikah",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   nama: "Surat Keterangan Kelahiran",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   nama: "Surat Keterangan Domisili",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   nama: "Surat Keterangan Kewarisan",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // { nama: "Surat Masuk", createdAt: new Date(), updatedAt: new Date() },
        // { nama: "Surat Keluar", createdAt: new Date(), updatedAt: new Date() },
        // { nama: "Serba-serbi", createdAt: new Date(), updatedAt: new Date() },
        // {
        //   nama: "Register Menikah",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   nama: "Keterangan Kematian",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   nama: "Keterangan Pengesahan",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   nama: "Keterangan Usaha",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
