import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const url =
  process.env.DATABASE_URL ||
  "postgres://app:app@localhost:5432/app_users";

export const sequelize = new Sequelize(url, {
  dialect: "postgres",
  logging: false,
});

export async function testConnection() {
  await sequelize.authenticate();
}
