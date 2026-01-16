import app from "./app";
import { initModels } from "./models";
import { sequelize, testConnection } from "./config/database";

const PORT = process.env.PORT || 8000;

async function start() {
  try {
    await testConnection();
    initModels();
    app.listen(PORT, () => {
      console.log(`Users API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
