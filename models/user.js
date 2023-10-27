const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true, // 카카오 같은경우는 없을수도 있다.
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100), // 암호화되면 길어진다.
          allowNull: true,
        },
        provider: {
          type: Sequelize.ENUM("local", "kakao"), // 문자열로하면 자유롭게 입력하기 때문에, ENUM은 local,kakao 둘중에 하나만 적겠금 제한. 사용자 구분
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          // 카카오 로그인 전용
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize, // initiate의 두번째 인수는 테이블 옵션이다.
        timestamps: true, // createdAt, updatedAt 유저 생성일과 회원가입하는 시간과 유저 정보 수정된 시간을 자동으로 기록해준다.
        underscored: false, //true로 설정하면 created_at, updated_at
        modelName: "User", // 자바스크립트에서 쓰는 이름
        tableName: "users", // db에서 쓰는 이름
        paranoid: true, // deletedAt 유저 삭제 시간을 생성. row로 데이터는 남아있고 삭제시간만 생성. 중요한 데이터는 직접 삭제하지 않고 삭제 시간만 생성하여 시간이 있다면 탈퇴한걸로 친다는 식으로 이런걸 soft delete, soft delete를 사용하여 추후 복구도 가능하게 하는 옵션. / 데이터를 싹 날리면 hard delete
        charset: "utf8", // 이모티콘 포함이면 'utf8mb4'
        collate: "utf8_general_ci", // 저장된 문자를 어떤방식으로 정렬할 것인지
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      // 팔로워
      foreignKey: "followingId", // 1. 유명연예인의 id는 팔로잉이다. id를 찾아야지만
      as: "Followers", // 2. 그사람의 팔로워들을 그 다음에 찾을 수 있다.
      through: "Follow",
    });
    db.User.belongsToMany(db.User, {
      // 팔로잉
      foreignKey: "followerId", // 1. 내 id를 찾아야지만,
      as: "Followings", // 2. 팔로잉한 사람들을 찾을 수 있다.
      through: "Follow",
    });
  }
}

module.exports = User;
