import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/blog";

export const sequelize = new Sequelize(url, {
  dialect: "postgres",
  logging: false
});

export async function testConnection() {
  await sequelize.authenticate();
}
