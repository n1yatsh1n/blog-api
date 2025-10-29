import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import type { ModelStatic } from "sequelize";
import { initUser, User } from "./user";
import { initArticle, Article } from "./article";
import { initComment, Comment } from "./comment";
import { initTag, Tag } from "./tag";
import { initArticleTag, ArticleTag } from "./articleTag";

export function initModels() {
  initUser(sequelize);
  initArticle(sequelize);
  initComment(sequelize);
  initTag(sequelize);
  initArticleTag(sequelize);

  // Associations
  User.hasMany(Article, { foreignKey: "authorId", as: "articles", onDelete: "CASCADE" });
  Article.belongsTo(User, { foreignKey: "authorId", as: "author" });

  Article.belongsToMany(Tag, { through: ArticleTag, foreignKey: "articleId", otherKey: "tagId", as: "tags" });
  Tag.belongsToMany(Article, { through: ArticleTag, foreignKey: "tagId", otherKey: "articleId", as: "articles" });

  User.hasMany(Comment, { foreignKey: "authorId", as: "comments", onDelete: "CASCADE" });
  Comment.belongsTo(User, { foreignKey: "authorId", as: "author" });

  Article.hasMany(Comment, { foreignKey: "articleId", as: "comments", onDelete: "CASCADE" });
  Comment.belongsTo(Article, { foreignKey: "articleId", as: "article" });
}

export { sequelize, User, Article, Comment, Tag, ArticleTag };
