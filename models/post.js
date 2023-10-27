const Sequelize = require("sequelize");

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init(
      {
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        img: {
          // 1개만 업로드 가능하게 했는데, 이미지를 여러개 올리고 싶으면 별도의 테이블로 분리를해서 관계를 맺어주는게 좋다. 게시글이 1 이미지가 N가 된다. 1대다
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        paranoid: false, // 게시글은 복구 할 생각이 없기 때문에
        modelName: "Post",
        tableName: "posts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User); // User에 속해있다.
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // 게시글과 해시태그는 다대다 관계
    // db.sequelize.models.PostHashtag; 중간 테이블 접근하는 방법
  }
}

module.exports = Post;
