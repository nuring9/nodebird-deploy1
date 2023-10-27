const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // user === exUser
    done(null, user.id); // id만 추출
  });
  // 세션 { 123456780123 : 1 }  === { 세션쿠키 : 유저아이디 } -> 메모리에 저장.

  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        {
          model: User, // 팔로잉
          attributes: ["id", "nick"], // password는 항상 빼주기
          as: "Followers", // models/user.js의 as와 일치해야 한다.
        },
        {
          model: User, // 팔로워
          attributes: ["id", "nick"],
          as: "Followings", // models/user.js의 as와 일치해야 한다.
        },
      ],
    }) // id로부터 유저정보를 복원시킨다.
      .then((user) => done(null, user)) //  그 복원된 유저가 req.user가 된다. 뿐만아니라 req.session도 생성됨.
      .catch((err) => done(err));
  });
  local();
  kakao();
};
