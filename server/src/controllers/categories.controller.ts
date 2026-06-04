import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { listings: { where: { status: "ACTIVE" } } } } },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await prisma.category.findFirstOrThrow({
      where: {
        OR: [{ id: String(req.params.idOrSlug) }, { slug: String(req.params.idOrSlug) }],
      },
      include: { _count: { select: { listings: { where: { status: "ACTIVE" } } } } },
    });
    res.json(category);
  } catch (err) {
    next(err);
  }
}
