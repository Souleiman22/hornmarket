import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Prisma unique constraint violation
  if ((err as any).code === "P2002") {
    const field = (err as any).meta?.target?.[0] ?? "field";
    res.status(409).json({ error: `${field} already exists` });
    return;
  }

  // Prisma record not found
  if ((err as any).code === "P2025") {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: "Internal server error",
    ...(env.isDev && { details: err.message }),
  });
}
