import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface TagAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TagCreationAttributes = Optional<
  TagAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class Tag
  extends Model<TagAttributes, TagCreationAttributes>
  implements TagAttributes
{
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initTag(sequelize: Sequelize) {
  Tag.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    { sequelize, modelName: "Tag", tableName: "Tags" }
  );
}
