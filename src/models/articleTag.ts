import { DataTypes, Model, Sequelize } from "sequelize";

export class ArticleTag extends Model {
  public articleId!: number;
  public tagId!: number;
}

export function initArticleTag(sequelize: Sequelize) {
  ArticleTag.init(
    {
      articleId: { type: DataTypes.INTEGER, primaryKey: true },
      tagId: { type: DataTypes.INTEGER, primaryKey: true }
    },
    { sequelize, modelName: "ArticleTag", tableName: "ArticleTags", timestamps: false }
  );
}
