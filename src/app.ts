import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import "express-async-errors";
import dotenv from "dotenv";
import routes from "./routes";
import { notFound, errorHandler } from "./middleware/error";
import { setupSwagger } from "./swagger";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(routes);

setupSwagger(app);

app.use(notFound);
app.use(errorHandler);

export default app;
