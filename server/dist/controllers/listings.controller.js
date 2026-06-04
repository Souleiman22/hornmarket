"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListings = getListings;
exports.getListing = getListing;
exports.createListing = createListing;
exports.updateListing = updateListing;
exports.deleteListing = deleteListing;
exports.getMyListings = getMyListings;
const prisma_1 = require("../lib/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
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
};
async function getListings(req, res, next) {
    try {
        const { page, limit, search, categoryId, location, country, minPrice, maxPrice, sort, status, } = req.query;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where = { status };
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }
        if (categoryId)
            where.categoryId = categoryId;
        if (country)
            where.country = country;
        if (location)
            where.location = { contains: location };
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        const orderBy = sort === "oldest" ? { createdAt: "asc" }
            : sort === "price_asc" ? { price: "asc" }
                : sort === "price_desc" ? { price: "desc" }
                    : { createdAt: "desc" };
        const skip = (page - 1) * limit;
        const [listings, total] = await Promise.all([
            prisma_1.prisma.listing.findMany({ where, orderBy, skip, take: limit, select: listingSelect }),
            prisma_1.prisma.listing.count({ where }),
        ]);
        res.json({
            data: listings,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        });
    }
    catch (err) {
        next(err);
    }
}
async function getListing(req, res, next) {
    try {
        const listing = await prisma_1.prisma.listing.findUniqueOrThrow({
            where: { id: String(req.params.id) },
            select: listingSelect,
        });
        res.json(listing);
    }
    catch (err) {
        next(err);
    }
}
async function createListing(req, res, next) {
    try {
        const { title, description, price, location, country, categoryId, images } = req.body;
        const category = await prisma_1.prisma.category.findUnique({ where: { id: categoryId } });
        if (!category)
            throw new errorHandler_1.AppError(404, "Category not found");
        const listing = await prisma_1.prisma.listing.create({
            data: {
                title,
                description,
                price,
                location,
                country: country ?? "SN",
                images: JSON.stringify(images),
                categoryId,
                userId: req.user.userId,
            },
            select: listingSelect,
        });
        res.status(201).json(listing);
    }
    catch (err) {
        next(err);
    }
}
async function updateListing(req, res, next) {
    try {
        const existing = await prisma_1.prisma.listing.findUniqueOrThrow({ where: { id: String(req.params.id) } });
        if (existing.userId !== req.user.userId)
            throw new errorHandler_1.AppError(403, "Forbidden");
        const body = req.body;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = { ...body };
        if (body.images)
            data.images = JSON.stringify(body.images);
        const listing = await prisma_1.prisma.listing.update({
            where: { id: String(req.params.id) },
            data,
            select: listingSelect,
        });
        res.json(listing);
    }
    catch (err) {
        next(err);
    }
}
async function deleteListing(req, res, next) {
    try {
        const existing = await prisma_1.prisma.listing.findUniqueOrThrow({ where: { id: String(req.params.id) } });
        if (existing.userId !== req.user.userId)
            throw new errorHandler_1.AppError(403, "Forbidden");
        await prisma_1.prisma.listing.delete({ where: { id: String(req.params.id) } });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
async function getMyListings(req, res, next) {
    try {
        const listings = await prisma_1.prisma.listing.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: "desc" },
            select: listingSelect,
        });
        res.json(listings);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=listings.controller.js.map