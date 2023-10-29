const express = require("express");
const fs = require("fs"); // 파일 조작
const path = require("path");
const multer = require("multer");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();
const { afterUploadImage, uploadImage } = require("../controllers/post");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

try {
  fs.readdirSync("uploads"); // uploads라는 폴더가 있는지 확인.  readdirSync: 동기방식으로 파일을 불러옴.
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads"); // 없으면 폴더 만들기.   mkdirSync: Directory 생성.
}

const s3 = new S3Client({
  // s3 연결
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: "ap-northeast-2", // 본인 지역 : 서울인지역
});

const upload = multer({
  // storage가 multerS3로 바뀐다.
  storage: multerS3({
    s3,
    bucket: "nodebirdbook2", // 내 버킷이름
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${file.originalname}`); // 나중에 람다를 위해 original/라는 폴더를 추가함.
    },
  }),
  Limits: { fileSize: 5 * 1024 * 1024 }, // 파일 사이즈 5mg bite가 작을수도 있으니 변경 가능.
});

router.post("/img", isLoggedIn, upload.single("img"), afterUploadImage); //로그인 해야만 사용. 이미지 하나 업로드

const upload2 = multer(); // 새로만든 이유는 설정이 다르기 때문.
router.post("/", isLoggedIn, upload2.none(), uploadImage); // 실제 게시글을 올릴때는 이미지를 올리지 않기 때문에 none.

module.exports = router;
