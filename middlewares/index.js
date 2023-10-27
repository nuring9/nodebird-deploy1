exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // "IsAuthenticated"는 인증이 성공적으로 완료되었는지 여부,
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};
