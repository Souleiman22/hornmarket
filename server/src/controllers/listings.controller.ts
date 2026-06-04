import { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { CreateListingInput, UpdateListingInput, ListingQuery } from "../schemas/listing.schema";
const listingSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  location: true,
  country: true,
  images: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true, icon: true } },
  user: { select: { id: true, name: true, image: true, phone: true, location: true } },
  _count: { select: { messages: true } },
} as const;

export async function getListings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      page, limit, search, categoryId, location, country, minPrice, maxPrice, sort, status,
    } = req.query as unknown as ListingQuery;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { status };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (country) where.country = country;
    if (location) where.location = { contains: location };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy =
      sort === "oldest" ? { createdAt: "asc" as const }
      : sort === "price_asc" ? { price: "asc" as const }
      : sort === "price_desc" ? { price: "desc" as const }
      : { createdAt: "desc" as const };

    const skip = (page - 1) * limit;
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({ where, orderBy, skip, take: limit, select: listingSelect }),
      prisma.listing.count({ where }),
    ]);

    res.json({
      data: listings,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const listing = await prisma.listing.findUniqueOrThrow({
      where: { id: req.params.id },
      select: listingSelect,
    });
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

export async function createListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, description, price, location, country, categoryId, images } = req.body as CreateListingInput;

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new AppError(404, "Category not found");

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price,
        location,
        country: country ?? "SN",
        images: JSON.stringify(images),
        categoryId,
        userId: req.user!.userId,
      },
      select: listingSelect,
    });
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
}

export async function updateListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.listing.findUniqueOrThrow({ where: { id: req.params.id } });
    if (existing.userId !== req.user!.userId) throw new AppError(403, "Forbidden");

    const body = req.body as UpdateListingInput;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = { ...body };
    if (body.images) data.images = JSON.stringify(body.images);

    const listing = await prisma.listing.update({
      where: { id: req.params.id },
      data,
      select: listingSelect,
    });
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

export async function deleteListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.listing.findUniqueOrThrow({ where: { id: req.params.id } });
    if (existing.userId !== req.user!.userId) throw new AppError(403, "Forbidden");

    await prisma.listing.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getMyListings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const listings = await prisma.listing.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      select: listingSelect,
    });
    res.json(listings);
  } catch (err) {
    next(err);
  }
}
