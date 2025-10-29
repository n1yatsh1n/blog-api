import { Router } from "express";
import { register, login, getCurrent, updateUser } from "../controllers/userController";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { loginSchema, registerSchema, updateUserSchema } from "../validation/schemas";

const router = Router();

router.post("/users", validateBody(registerSchema), register);
router.post("/users/login", validateBody(loginSchema), login);
router.get("/user", requireAuth, getCurrent);
router.put("/user", requireAuth, validateBody(updateUserSchema), updateUser);

export default router;
