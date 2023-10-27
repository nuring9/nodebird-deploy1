const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");
const helmet = require("helmet");
const hpp = require("hpp");
const redis = require("redis");
const RedisStore = require("connect-redis").default;

dotenv.config(); // 위치 중요
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
  legacyMode: false,
});
redisClient.connect().catch(console.error);

const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

const { sequelize } = require("./models"); // models에서 sequelize를 가져옴.
const passportConfig = require("./passport"); // passport 설정을 불러옴.
const logger = require("./logger");

const app = express();
passportConfig(); // 패스포드 설정
app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app, // express에 app 객체 연결
  watch: true, // HTML 파일이 변경될 때에 템플릿 엔진을 reload하게 됨.
});
sequelize
  .sync({ force: false }) // 개발시에 테이블 잘못 만들었을 때 force: true 해둔 다음 서버 재시작하면 테이블들 싹 제거됬다가 다시 생성된다. 배포할땐 꼭 false
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(express.json()); // req.body를 ajax json 요청으로부터
app.use(express.urlencoded({ extended: false })); // req.body를 폼으로부터
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true, // 자바스크립트 접근 금지
    secure: false, // https 관련 추후 배포시 변경.
  },
  store: new RedisStore({ client: redisClient }),
};

if (process.env.NODE_ENV === "production") {
  sessionOption.proxy = true;
  // sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));
// passport 미들웨어 위치 중요! 꼭 express session 미들웨어 밑에 작성.
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout 생성.
app.use(passport.session()); // passport를 쿠키로 로그인을 도와주는 역할.

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  logger.info("hello");
  logger.error(error.message);
  next(error);
});

app.use((err, req, res, next) => {
  // 미들웨어 에러처리 매개변수 4개사용.
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {}; // 개발시에만 에러보이게
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
