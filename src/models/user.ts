import { DataTypes, Model, Sequelize, Optional } from "sequelize";

export interface UserAttributes {
  id: number;
  email: string;
  username: string;
  passwordHash: string;
  bio?: string | null;
  image_url?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, "id" | "bio" | "image_url" | "createdAt" | "updatedAt">;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public username!: string;
  public passwordHash!: string;
  public bio!: string | null;
  public image_url!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initUser(sequelize: Sequelize) {
  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      bio: { type: DataTypes.TEXT, allowNull: true },
      image_url: { type: DataTypes.STRING, allowNull: true }
    },
    { sequelize, modelName: "User", tableName: "Users" }
  );
}
