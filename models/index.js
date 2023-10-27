const Sequelize = require("sequelize");
const fs = require("fs"); // 폴더 파일 읽을 수 있는 모듈
const path = require("path"); // 읽을 파일 경로 가져올수 있는 모듈

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env]; // sequelize 연결

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

const basename = path.basename(__filename);
// fs.readdirSync('models') 이렇게 직접 디렉토리를 넣지 말자. path는 항상 join이나 __filename, __dirname으로 사용. 오타 방지
fs.readdirSync(__dirname) // 현재폴더의 모든 파일을 조회
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      !file.includes("test") &&
      file !== basename &&
      file.slice(-3) === ".js"
    ); // 숨긴파일과 테스트 파일, js 확장자가 아닌 파일은 모델이 아니기 때문에 제외, 끝에서 3번째 자리수까지만 .js확장자만 포함
  })
  .forEach((file) => {
    // 필터링 된 모델폴더안에 있는 파일들을 require 불러온다.
    const model = require(path.join(__dirname, file));
    // console.log(file, model.name);
    db[model.name] = model; // db객체에 made.name(즉, 클래스명)을 넣어주고, 이제 db에는 Hashtag,Post,User가 들어있음.
    // console.log(db[model.name]);
    model.initiate(sequelize); // 그 모델들을 전부다 initiate를 호출해준다.
    // model.associate 여기에 작성하지 않는 이유는, 순서가 정해져 있다. initiate를 전부 다 하고나서 associate를 해야하기 때문.
  });
Object.keys(db).forEach((modelName) => {
  console.log(modelName);
  // 다시 모델들을 불러와서...
  if (db[modelName].associate) {
    // 만약에 db객체안의 모델들이 associate가 있다면,
    db[modelName].associate(db); // initiate한 애들을 다시 associate를 호출한다.
  }
});

module.exports = db;
