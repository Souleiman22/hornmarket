import { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { SendMessageInput } from "../schemas/message.schema";

export async function sendMessage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { listingId, content } = req.body as SendMessageInput;

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new AppError(404, "Listing not found");
    if (listing.userId === req.user!.userId) throw new AppError(400, "Cannot message your own listing");

    const message = await prisma.message.create({
      data: { content, listingId, senderId: req.user!.userId },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        listing: { select: { id: true, title: true } },
      },
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

export async function getConversation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { listingId } = req.params;
    const listing = await prisma.listing.findUniqueOrThrow({ where: { id: listingId } });

    const isOwner = listing.userId === req.user!.userId;
    const where = isOwner
      ? { listingId }
      : { listingId, senderId: req.user!.userId };

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, name: true, image: true } } },
    });

    if (!isOwner) {
      await prisma.message.updateMany({
        where: { listingId, senderId: { not: req.user!.userId }, read: false },
        data: { read: true },
      });
    }

    res.json(messages);
  } catch (err) {
    next(err);
  }
}

export async function getMyConversations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    // All listings the user owns with incoming messages
    const ownedConversations = await prisma.listing.findMany({
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
    const sentConversations = await prisma.listing.findMany({
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
  } catch (err) {
    next(err);
  }
}
