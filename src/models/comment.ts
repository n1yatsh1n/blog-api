import { DataTypes, Model, Sequelize, Optional } from "sequelize";

export interface CommentAttributes {
  id: number;
  body: string;
  articleId: number;
  authorId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CommentCreationAttributes = Optional<CommentAttributes, "id" | "createdAt" | "updatedAt">;

export class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public body!: string;
  public articleId!: number;
  public authorId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initComment(sequelize: Sequelize) {
  Comment.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      body: { type: DataTypes.TEXT, allowNull: false },
      articleId: { type: DataTypes.INTEGER, allowNull: false },
      authorId: { type: DataTypes.INTEGER, allowNull: false }
    },
    { sequelize, modelName: "Comment", tableName: "Comments" }
  );
}
