const express = require("express");
const fs = require("fs"); // 파일 조작
const path = require("path");
const multer = require("multer");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares/index");
const router = express.Router();
const { afterUploadImage, uploadImage } = require("../controllers/post");

try {
  fs.readdirSync("uploads"); // uploads라는 폴더가 있는지 확인.  readdirSync: 동기방식으로 파일을 불러옴.
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads"); // 없으면 폴더 만들기.   mkdirSync: Directory 생성.
}

const upload = multer({
  // nmulter 설정.
  storage: multer.diskStorage({
    // 어디에 저장할 것인가, 우리는 사용자가 업로드한 것을 disk에 저장한다.
    destination(req, file, cb) {
      cb(null, "uploads/"); // uploads폴더에 저장.
    },
    filename(req, file, cb) {
      // 파일 이름 설정
      const ext = path.extname(file.originalname);
      // 확장자 추출.  이미지.png -> 이미지2023090234.png = 이미지+날짜스트링.png
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일명에 확장자를 분리 시킨뒤 사이에 날짜를 넣고 다시 확장자를 넣어 줌.
    },
  }),
  Limits: { fileSize: 5 * 1024 * 1024 }, // 파일 사이즈 5mg bite가 작을수도 있으니 변경 가능.
});

router.post("/img", isLoggedIn, upload.single("img"), afterUploadImage); //로그인 해야만 사용. 이미지 하나 업로드

const upload2 = multer(); // 새로만든 이유는 설정이 다르기 때문.
router.post("/", isLoggedIn, upload2.none(), uploadImage); // 실제 게시글을 올릴때는 이미지를 올리지 않기 때문에 none.

module.exports = router;
