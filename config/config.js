try {
  require("dotenv").config();
} catch (e) {}

module.exports = {
  development: {
    username: process.env.DB_USER || "userdb",
    password: process.env.DB_PASSWORD || "satudata@MKS2024DB",
    database: process.env.DB_NAME || "inspektorat_apipta",
    host: process.env.DB_HOST || "103.151.20.87",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER || "userdb",
    password: process.env.DB_PASSWORD || "satudata@MKS2024DB",
    database: process.env.DB_NAME || "inspektorat_apipta",
    host: process.env.DB_HOST || "103.151.20.87",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER || "userdb",
    password: process.env.DB_PASSWORD || "satudata@MKS2024DB",
    database: process.env.DB_NAME || "inspektorat_apipta",
    host: process.env.DB_HOST || "103.151.20.87",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    dialect: "mysql",
    logging: false, // Prevent SQL query parameters & hash logging in production
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
