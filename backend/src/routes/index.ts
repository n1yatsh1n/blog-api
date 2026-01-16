import { Router } from "express";
import articles from "./articles";

const router = Router();

router.use("/api", articles);

export default router;
