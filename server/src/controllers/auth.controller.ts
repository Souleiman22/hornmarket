import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, phone, location } = req.body as RegisterInput;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError(409, "Email already in use");

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone, location },
      select: { id: true, name: true, email: true, phone: true, location: true, createdAt: true },
    });

    const payload = { userId: user.id, email: user.email };
    res.status(201).json({
      user,
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) throw new AppError(401, "Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError(401, "Invalid credentials");

    const payload = { userId: user.id, email: user.email };
    res.json({
      user: { id: user.id, name: user.name, email: user.email, image: user.image },
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body as { refreshToken: string };
    const payload = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new AppError(401, "User not found");

    const newPayload = { userId: user.id, email: user.email };
    res.json({
      accessToken: signAccessToken(newPayload),
      refreshToken: signRefreshToken(newPayload),
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        image: true,
        createdAt: true,
        _count: { select: { listings: true } },
      },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
}
