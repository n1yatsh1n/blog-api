import { Router } from "express";
import {
  getCurrent,
  login,
  register,
  updateUser,
} from "../controllers/userController";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
} from "../validation/schemas";

const router = Router();

router.post("/users", validateBody(registerSchema), register);
router.post("/users/login", validateBody(loginSchema), login);
router.get("/user", requireAuth, getCurrent);
router.put("/user", requireAuth, validateBody(updateUserSchema), updateUser);

export default router;
