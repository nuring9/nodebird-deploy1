const Post = require("../models/post");
const Hashtag = require("../models/hashtag");

exports.afterUploadImage = (req, res) => {
  // 이미지 업로드 하는 부분.
  const originalUrl = req.file.location;
  const url = originalUrl.replace(/\/original\//, "/thumb/");
  res.json({ url, originalUrl });
};

exports.uploadImage = async (req, res, next) => {
  // 실제 게시글 업로드 하는 부분.
  // req.body.content , req.body.url
  try {
    const post = await Post.create({
      // 게시글 저장
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    //  await post.addUser(req.user.id);  이런식으로 userid를 업로드할 수도 있는데 쿼리를 두번 사용하므로 그냥 한번에 함.
    const hashtags = req.body.content.match(/#[^\s#]*/g); // 해시태그를 정규표현식을 사용하여 추출. #과 공백 또는 #아닌 나머지들
    if (hashtags) {
      const result = await Promise.all(
        //hashtags.map이 promise이기 때문에 await을 해줌.
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            // 시퀄라이즈에서 제공해주는 메서드.
            where: { title: tag.slice(1).toLowerCase() }, //앞의 #빼고 대문자를 소문자로
          });
        })
      );
      console.log("result", result); // result가 어떤형태인지..
      await post.addHashtags(result.map((r) => r[0])); // 2차원배열의 첫번째를 꺼냄. post와 hashtag랑 이어줌. 다대다 관계 형성
    }
    res.redirect("/"); // 게시글 업로드 후 메인페이지 이동
  } catch (error) {
    console.error(error);
    next(error);
  }
};
