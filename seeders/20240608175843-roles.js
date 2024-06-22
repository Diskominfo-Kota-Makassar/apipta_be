"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Inserting data into 'roles' table
    await queryInterface.bulkInsert(
      "roles",
      [
        { name: "admin", createdAt: new Date(), updatedAt: new Date() },
        { name: "tim", createdAt: new Date(), updatedAt: new Date() },
        { name: "pj", createdAt: new Date(), updatedAt: new Date() },
        { name: "wpj", createdAt: new Date(), updatedAt: new Date() },
        { name: "dalnis", createdAt: new Date(), updatedAt: new Date() },
        { name: "kt", createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Deleting data from 'roles' table
    await queryInterface.bulkDelete("roles", null, {});
  },
};
