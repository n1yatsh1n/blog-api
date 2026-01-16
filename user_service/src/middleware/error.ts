import { NextFunction, Request, Response } from "express";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: { message: "Not found" } });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: { message: err.message } });
  }
  res.status(500).json({ error: { message: "Internal server error" } });
}
