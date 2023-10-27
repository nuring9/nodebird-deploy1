const Sequelize = require("sequelize");
const User = require("./user");
const config = require("../config/config")["test"];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
// sequelize에 config 연결.

describe("User 모델", () => {
  test("static init 메서드 호출", () => {
    expect(User.initiate(sequelize)).toBe(undefined); // models/use.js의 static initiate(sequelize) 부분
  });
  test("static associate 메서드 호출", () => {
    // associate 부분
    const db = {
      User: {
        hasMany: jest.fn(),
        belongsToMany: jest.fn(),
      },
      Post: {},
    };
    User.associate(db);
    expect(db.User.hasMany).toHaveBeenCalledWith(db.Post); // 한번 호출
    expect(db.User.belongsToMany).toHaveBeenCalledTimes(2); // 두번 호출
  });
});
