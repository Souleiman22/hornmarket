import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { UpdateProfileInput } from "../schemas/user.schema";

export async function getPublicProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        image: true,
        location: true,
        createdAt: true,
        listings: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            location: true,
            createdAt: true,
            category: { select: { name: true, slug: true, icon: true } },
          },
        },
        _count: { select: { listings: { where: { status: "ACTIVE" } } } },
      },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: req.body as UpdateProfileInput,
      select: { id: true, name: true, email: true, phone: true, location: true, image: true },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };

    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.userId } });
    if (!user.password) throw new AppError(400, "Password login not available for this account");

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new AppError(401, "Current password is incorrect");

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
}

export async function getDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const [user, listingStats, unreadMessages] = await Promise.all([
      prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { id: true, name: true, email: true, image: true, phone: true, location: true },
      }),
      prisma.listing.groupBy({
        by: ["status"],
        where: { userId },
        _count: true,
      }),
      prisma.message.count({
        where: { listing: { userId }, senderId: { not: userId }, read: false },
      }),
    ]);

    const stats = {
      active: 0, sold: 0, paused: 0,
      ...Object.fromEntries(listingStats.map((s: { status: string; _count: number }) => [s.status.toLowerCase(), s._count])),
    };

    res.json({ user, stats, unreadMessages });
  } catch (err) {
    next(err);
  }
}
