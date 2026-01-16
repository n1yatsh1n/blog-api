import { UserSafe } from "../types/shared";

declare global {
  namespace Express {
    interface Request {
      user?: UserSafe;
    }
  }
}
export {};
