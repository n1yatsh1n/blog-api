import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFound } from "./middleware/error";
import routes from "./routes";
import { setupSwaggerUsers } from "./swagger";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(routes);

setupSwaggerUsers(app);

app.use(notFound);
app.use(errorHandler);

export default app;
