const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

// 회원가입
exports.join = async (req, res, next) => {
  const { nick, email, password } = req.body; // 구조분해 할당

  try {
    const exUser = await User.findOne({ where: { email } }); // 해당 이메일로 가입한 유저가 있는지 찾는다.
    if (exUser) {
      // 유저가 이미 있다면,
      return res.redirect("/join?error=exist"); // join.html의 alert("이미 존재하는 이메일입니다.");
    }
    const hash = await bcrypt.hash(password, 12); // 숫자가 높으면 높을수록 보안에 좋긴하지만 속도가 많이 느려지기 때문에 12가 적당.
    await User.create({
      // 사용자 등록
      email,
      nick,
      password: hash, // 사용자가 올린 패스워드를 그대로 사용하면 안되고 암호화 변경 코드 hash로 적용.
    });
    return res.redirect("/"); // 사용자 등록 완료 후 메인화면으로 리다이렉트
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// 로그인
// POST /auth/login   여기로 form 요청
exports.login = (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      // 서버실패
      console.error(authError); // 에러 로깅
      return next(authError); // 서버에러는 항상 next로 넘겨준다. 에러처리 미들웨어에서 알아서 하도록.
    }
    if (!user) {
      // 로직실패
      // 만약에 유저가 없다면,
      return res.redirect(`/?error=${info.message}`); // done에 넣어두었던 message를 그대로 받아오기때문에 에러메세지를 띄운다.
    }
    return req.login(user, (loginError) => {
      // 로그인 성공
      // 로그인 성공인 경우 user를 넣어주는데, 혹시나 로그인에러도 생길 경우를 대비하여 넣어줌.
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/"); // 로그인 성공시 메인화면으로 초기화
    });
  })(req, res, next); // 미들웨어 확장패턴.
};

// 로그아웃
exports.logout = (req, res, next) => {
  req.logout(() => {
    res.redirect("/");
  });
};
