import { Router } from "express";
import users from "./users";

const router = Router();

router.use("/api", users);

export default router;
