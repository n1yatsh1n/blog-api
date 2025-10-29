import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserSafe } from "../types/shared";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(u: UserSafe): string {
  return jwt.sign(
    { id: u.id, email: u.email, username: u.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers["authorization"];
    if (!header)
      return res
        .status(401)
        .json({ error: { message: "Authorization header is missing" } });
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token)
      return res
        .status(401)
        .json({ error: { message: "Invalid Authorization header format" } });
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      username: string;
    };
    // Optionally ensure user exists
    req.user = {
      id: payload.id,
      email: payload.email,
      username: payload.username,
    };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: { message: "Invalid or expired token" } });
  }
}
