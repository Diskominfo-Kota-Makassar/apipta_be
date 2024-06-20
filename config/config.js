require("dotenv").config(); // This line ensures that environment variables from .env file are read

module.exports = {
  development: {
    username: "userdb",
    password: "satudata@MKS2024DB",
    database: "inspektorat_apipta",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  test: {
    username: "userdb",
    password: "satudata@MKS2024DB",
    database: "inspektorat_apipta",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  production: {
    username: "userdb",
    password: "satudata@MKS2024DB",
    database: "inspektorat_apipta",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};
