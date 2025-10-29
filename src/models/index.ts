import { sequelize } from "../config/database";
import { Article, initArticle } from "./article";
import { ArticleTag, initArticleTag } from "./articleTag";
import { Comment, initComment } from "./comment";
import { initTag, Tag } from "./tag";
import { initUser, User } from "./user";

export function initModels() {
  initUser(sequelize);
  initArticle(sequelize);
  initComment(sequelize);
  initTag(sequelize);
  initArticleTag(sequelize);

  // Associations
  User.hasMany(Article, {
    foreignKey: "authorId",
    as: "articles",
    onDelete: "CASCADE",
  });
  Article.belongsTo(User, { foreignKey: "authorId", as: "author" });

  Article.belongsToMany(Tag, {
    through: ArticleTag,
    foreignKey: "articleId",
    otherKey: "tagId",
    as: "tags",
  });
  Tag.belongsToMany(Article, {
    through: ArticleTag,
    foreignKey: "tagId",
    otherKey: "articleId",
    as: "articles",
  });

  User.hasMany(Comment, {
    foreignKey: "authorId",
    as: "comments",
    onDelete: "CASCADE",
  });
  Comment.belongsTo(User, { foreignKey: "authorId", as: "author" });

  Article.hasMany(Comment, {
    foreignKey: "articleId",
    as: "comments",
    onDelete: "CASCADE",
  });
  Comment.belongsTo(Article, { foreignKey: "articleId", as: "article" });
}

export { Article, ArticleTag, Comment, sequelize, Tag, User };
