"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = getCategories;
exports.getCategory = getCategory;
const prisma_1 = require("../lib/prisma");
async function getCategories(_req, res, next) {
    try {
        const categories = await prisma_1.prisma.category.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { listings: { where: { status: "ACTIVE" } } } } },
        });
        res.json(categories);
    }
    catch (err) {
        next(err);
    }
}
async function getCategory(req, res, next) {
    try {
        const category = await prisma_1.prisma.category.findFirstOrThrow({
            where: {
                OR: [{ id: String(req.params.idOrSlug) }, { slug: String(req.params.idOrSlug) }],
            },
            include: { _count: { select: { listings: { where: { status: "ACTIVE" } } } } },
        });
        res.json(category);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=categories.controller.js.map