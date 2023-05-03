const { Sequelize } = require("sequelize");

const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    dialectOptions: {
      multipleStatements: true,
      connectTimeout: 30000,
    },
    pool: {
      max: 15,
      min: 5,
      idle: 20000,
      evict: 15000,
      acquire: 30000,
    },
    define: {
      timestamps: false,
      raw: true,
    },
  }
);

module.exports = connection;
