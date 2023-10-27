const { follow } = require("../services/user");

exports.follow = async (req, res, next) => {
  // req.user.id(내아이디) 와 req.params.id(상대방아이디)
  try {
    const result = await follow(req.user.id, req.params.id);
    if (result === "ok") {
      // 혹시나 DB에 user가 없을 수도 있으니 안전장치로 if문 사용.
      res.send("success");
    } else if (result === "no user") {
      res.status(404).send("no user"); // user가 없다고 404페이지를 보냄.
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/* 서비스 분리 전 코드
const User = require("../models/user");

exports.follow = async (req, res, next) => {
  // req.user.id(내아이디) 와 req.params.id(상대방아이디)
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // 내아이디를 조회
    if (user) {
      // 혹시나 DB에 user가 없을 수도 있으니 안전장치로 if문 사용.
      await user.addFollowing(parseInt(req.params.id, 10)); //나한테 팔로우 누른사람을 추가한다. 그럼 상대방을 내가 팔로우 하게됨. req.params.id가 문자열 -> parseInt로 숫자.
      res.send("success");
    } else {
      res.status(404).send("no user"); // user가 없다고 404페이지를 보냄.
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
*/
