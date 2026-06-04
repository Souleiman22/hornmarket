"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = getFavorites;
exports.addFavorite = addFavorite;
exports.removeFavorite = removeFavorite;
exports.checkFavorite = checkFavorite;
const prisma_1 = require("../lib/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
const listingSelect = {
    id: true, title: true, price: true, location: true, country: true,
    images: true, status: true, createdAt: true,
    category: { select: { id: true, name: true, slug: true, icon: true } },
    user: { select: { id: true, name: true, image: true } },
};
async function getFavorites(req, res, next) {
    try {
        const favorites = await prisma_1.prisma.favorite.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: "desc" },
            include: { listing: { select: listingSelect } },
        });
        res.json(favorites.map((f) => f.listing));
    }
    catch (err) {
        next(err);
    }
}
async function addFavorite(req, res, next) {
    try {
        const { listingId } = req.body;
        const listing = await prisma_1.prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing)
            throw new errorHandler_1.AppError(404, "Listing not found");
        await prisma_1.prisma.favorite.create({ data: { userId: req.user.userId, listingId } });
        res.status(201).json({ message: "Added to favorites" });
    }
    catch (err) {
        if (err.code === "P2002") {
            res.status(200).json({ message: "Already in favorites" });
            return;
        }
        next(err);
    }
}
async function removeFavorite(req, res, next) {
    try {
        await prisma_1.prisma.favorite.deleteMany({
            where: { userId: req.user.userId, listingId: String(req.params.listingId) },
        });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
async function checkFavorite(req, res, next) {
    try {
        const fav = await prisma_1.prisma.favorite.findUnique({
            where: { userId_listingId: { userId: req.user.userId, listingId: String(req.params.listingId) } },
        });
        res.json({ isFavorite: !!fav });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=favorites.controller.js.map