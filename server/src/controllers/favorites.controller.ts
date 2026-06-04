import { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

const listingSelect = {
  id: true, title: true, price: true, location: true, country: true,
  images: true, status: true, createdAt: true,
  category: { select: { id: true, name: true, slug: true, icon: true } },
  user: { select: { id: true, name: true, image: true } },
} as const;

export async function getFavorites(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      include: { listing: { select: listingSelect } },
    });
    res.json(favorites.map((f) => f.listing));
  } catch (err) { next(err); }
}

export async function addFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { listingId } = req.body as { listingId: string };
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new AppError(404, "Listing not found");
    await prisma.favorite.create({ data: { userId: req.user!.userId, listingId } });
    res.status(201).json({ message: "Added to favorites" });
  } catch (err: any) {
    if (err.code === "P2002") { res.status(200).json({ message: "Already in favorites" }); return; }
    next(err);
  }
}

export async function removeFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.favorite.deleteMany({
      where: { userId: req.user!.userId, listingId: req.params.listingId },
    });
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function checkFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const fav = await prisma.favorite.findUnique({
      where: { userId_listingId: { userId: req.user!.userId, listingId: req.params.listingId } },
    });
    res.json({ isFavorite: !!fav });
  } catch (err) { next(err); }
}
