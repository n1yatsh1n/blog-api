import { Router } from "express";
import users from "./users";
import articles from "./articles";

const router = Router();

router.use("/api", users);
router.use("/api", articles);

export default router;
