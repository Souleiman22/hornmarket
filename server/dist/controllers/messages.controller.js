"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
exports.getConversation = getConversation;
exports.getMyConversations = getMyConversations;
const prisma_1 = require("../lib/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
async function sendMessage(req, res, next) {
    try {
        const { listingId, content } = req.body;
        const listing = await prisma_1.prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing)
            throw new errorHandler_1.AppError(404, "Listing not found");
        if (listing.userId === req.user.userId)
            throw new errorHandler_1.AppError(400, "Cannot message your own listing");
        const message = await prisma_1.prisma.message.create({
            data: { content, listingId, senderId: req.user.userId },
            include: {
                sender: { select: { id: true, name: true, image: true } },
                listing: { select: { id: true, title: true } },
            },
        });
        res.status(201).json(message);
    }
    catch (err) {
        next(err);
    }
}
async function getConversation(req, res, next) {
    try {
        const listingId = String(req.params.listingId);
        const listing = await prisma_1.prisma.listing.findUniqueOrThrow({ where: { id: listingId } });
        const isOwner = listing.userId === req.user.userId;
        const where = isOwner
            ? { listingId }
            : { listingId, senderId: req.user.userId };
        const messages = await prisma_1.prisma.message.findMany({
            where,
            orderBy: { createdAt: "asc" },
            include: { sender: { select: { id: true, name: true, image: true } } },
        });
        if (!isOwner) {
            await prisma_1.prisma.message.updateMany({
                where: { listingId, senderId: { not: req.user.userId }, read: false },
                data: { read: true },
            });
        }
        res.json(messages);
    }
    catch (err) {
        next(err);
    }
}
async function getMyConversations(req, res, next) {
    try {
        const userId = req.user.userId;
        // All listings the user owns with incoming messages
        const ownedConversations = await prisma_1.prisma.listing.findMany({
            where: { userId, messages: { some: {} } },
            select: {
                id: true,
                title: true,
                images: true,
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    include: { sender: { select: { id: true, name: true, image: true } } },
                },
                _count: { select: { messages: { where: { read: false, senderId: { not: userId } } } } },
            },
        });
        // Listings the user has messaged
        const sentConversations = await prisma_1.prisma.listing.findMany({
            where: { messages: { some: { senderId: userId } } },
            select: {
                id: true,
                title: true,
                images: true,
                user: { select: { id: true, name: true, image: true } },
                messages: {
                    where: { senderId: userId },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });
        res.json({ owned: ownedConversations, sent: sentConversations });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=messages.controller.js.map