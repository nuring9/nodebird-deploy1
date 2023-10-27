const request = require("supertest");
const { sequelize } = require("../models");
const app = require("../app");

// 테스트 하기 전에 DB와 연결해 주고 싶다면, beforeAll 함수를 사용하여 딱 한번 실행함.
beforeAll(async () => {
  await sequelize.sync();
});

// 회원가입
describe("POST/join", () => {
  test("로그인 안했으면 회원가입", (done) => {
    request(app)
      .post("/auth/join")
      .send({
        email: "for95@nate.com",
        nick: "눌",
        password: "1234",
      })
      .expect("Location", "/")
      .expect(302, done);
  });
});

describe("POST/join", () => {
  const agent = request.agent(app);
  beforeEach((done) => {
    // 여기에 로그인을 시켜줌.
    agent
      .post("/auth/login")
      .send({
        email: "for95@nate.com",
        password: "1234",
      })
      .end(done);
  });
  test("이미 로그인했으면 redirect /", (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");
    agent
      .post("/auth/join")
      .send({
        email: "for95@nate.com",
        nick: "눌",
        password: "1234",
      })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});

// 로그인
describe("POST /login", () => {
  test("가입되지 않은 회원", (done) => {
    const message = encodeURIComponent("가입되지 않는 회원입니다.");
    request(app)
      .post("/auth/login")
      .send({
        email: "for1@nate.com",
        password: "1234",
      })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });

  test("로그인 수행", (done) => {
    request(app)
      .post("/auth/login") // app에다가 "/auth/login" 요청을 날리는 셈.
      .send({
        email: "for95@nate.com",
        password: "1234",
      })
      .expect("Location", "/")
      .expect(302, done); // res.redirect를 하면 http 상태코드가 302가 된다.
  });

  test("비밀번호 틀림", (done) => {
    const message = encodeURIComponent("비밀번호가 일치하지 않습니다.");
    request(app)
      .post("/auth/login")
      .send({
        email: "for95@nate.com",
        password: "xxxx",
      })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});

// 로그 아웃
describe("POST /login", () => {
  test("로그인 되어 있지 않으면 403", (done) => {
    request(app).get("/auth/logout").expect(403, done);
  });

  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({
        email: "for95@nate.com",
        password: "1234",
      })
      .end(done);
  });
  test("로그아웃 수행", (done) => {
    agent.get("/auth/logout").expect("Location", "/").expect(302, done);
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
