require("dotenv").config();

module.exports = {
  development: {
    username: process.env.USER_NAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: "nodebird_book2",
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
  test: {
    username: process.env.USER_NAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: "nodebird_test",
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
  production: {
    username: process.env.USER_NAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: "nodebird",
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    logging: false,
  },
};
