import { sequelize } from "../config/database";
import { Article, initArticle } from "./article";
import { ArticleTag, initArticleTag } from "./articleTag";
import { Comment, initComment } from "./comment";
import { initTag, Tag } from "./tag";

export function initModels() {
  initArticle(sequelize);
  initComment(sequelize);
  initTag(sequelize);
  initArticleTag(sequelize);

  // Associations (removed User associations - user_id is now just a number without FK)
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

  Article.hasMany(Comment, {
    foreignKey: "articleId",
    as: "comments",
    onDelete: "CASCADE",
  });
  Comment.belongsTo(Article, { foreignKey: "articleId", as: "article" });
}

export { Article, ArticleTag, Comment, sequelize, Tag };
