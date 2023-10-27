const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local").Strategy;
// 위 코드랑 동일 const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = () => {
  passport.use(
    // 1. 첫번째 인수, 전략에 관한 설정
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email 를 usernameField로 하겠다.
        passwordField: "password", // req.body.password 를 passwordField로 하겠다.
        passReqToCallback: false, // 이게 true 면 async에 req가 추가가 된다. fals면 req가 빠짐.
      },
      // 2. 두번째 인수, 실제 전략을 수행.
      async (email, password, done) => {
        // done(서버실패, 성공유저, 로직실패)
        try {
          const exUser = await User.findOne({ where: { email } }); // 이메일이 있는지 확인. db에 저장된 유저다.
          if (exUser) {
            // 이메일이 있다면, 비밀번호를 비교한다.
            const result = await bcrypt.compare(password, exUser.password); // 사용자비밀번호 와 db 유저의 비밀번호 일치한지 비교
            if (result) {
              // 일치한다면,
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            // 사용자가 없는 경우,
            done(null, false, { message: "가입되지 않는 회원입니다." });
          }
        } catch (error) {
          console.error(error);
        }
      }
    )
  );
};
