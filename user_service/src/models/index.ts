import { sequelize } from "../config/database";
import { initUser, User } from "./user";

export function initModels() {
  initUser(sequelize);
}

export { sequelize, User };
