import { Router } from "express";
import articles from "./articles";
import users from "./users";

const router = Router();

router.use("/api", users);
router.use("/api", articles);

export default router;
