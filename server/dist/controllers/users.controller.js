"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicProfile = getPublicProfile;
exports.updateProfile = updateProfile;
exports.changePassword = changePassword;
exports.getDashboard = getDashboard;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
async function getPublicProfile(req, res, next) {
    try {
        const user = await prisma_1.prisma.user.findUniqueOrThrow({
            where: { id: String(req.params.id) },
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
    }
    catch (err) {
        next(err);
    }
}
async function updateProfile(req, res, next) {
    try {
        const user = await prisma_1.prisma.user.update({
            where: { id: req.user.userId },
            data: req.body,
            select: { id: true, name: true, email: true, phone: true, location: true, image: true },
        });
        res.json(user);
    }
    catch (err) {
        next(err);
    }
}
async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await prisma_1.prisma.user.findUniqueOrThrow({ where: { id: req.user.userId } });
        if (!user.password)
            throw new errorHandler_1.AppError(400, "Password login not available for this account");
        const valid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!valid)
            throw new errorHandler_1.AppError(401, "Current password is incorrect");
        const hashed = await bcryptjs_1.default.hash(newPassword, 12);
        await prisma_1.prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
        res.json({ message: "Password updated successfully" });
    }
    catch (err) {
        next(err);
    }
}
async function getDashboard(req, res, next) {
    try {
        const userId = req.user.userId;
        const [user, listingStats, unreadMessages] = await Promise.all([
            prisma_1.prisma.user.findUniqueOrThrow({
                where: { id: userId },
                select: { id: true, name: true, email: true, image: true, phone: true, location: true },
            }),
            prisma_1.prisma.listing.groupBy({
                by: ["status"],
                where: { userId },
                _count: true,
            }),
            prisma_1.prisma.message.count({
                where: { listing: { userId }, senderId: { not: userId }, read: false },
            }),
        ]);
        const stats = {
            active: 0, sold: 0, paused: 0,
            ...Object.fromEntries(listingStats.map((s) => [s.status.toLowerCase(), s._count])),
        };
        res.json({ user, stats, unreadMessages });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=users.controller.js.map