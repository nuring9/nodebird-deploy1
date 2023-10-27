const passport = require("passport");
const { Strategy: kakaoStrategy } = require("passport-kakao");
const User = require("../models/user");

module.exports = () => {
  // 카카오 로그인 설정
  passport.use(
    new kakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      // 콜백 설정
      async (accessToken, refreshToken, profile, done) => {
        console.log("profile", profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          if (exUser) {
            // 로그인
            done(null, exUser); // 로그인 마지막엔 꼭 done
          } else {
            // 회원가입
            const newUser = await User.create({
              email: profile._json?.kakao_account?.email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
            done(null, newUser); // 회원가입도 마찬가지로 마지막에 done
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
