import app from "./app";
import { initModels } from "./models";
import { sequelize, testConnection } from "./config/database";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await testConnection();
    initModels();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
