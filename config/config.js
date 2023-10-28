require("dotenv").config();

module.exports = {
  development: {
    username: process.env.USER_NAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: "nodebird",
    host: process.env.HOST,
    dialect: "mysql",
  },
  test: {
    username: process.env.USER_NAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: "nodebird_test",
    host: process.env.HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.USER_NAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: "nodebird",
    host: process.env.HOST,
    dialect: "mysql",
    logging: false,
  },
};
