import { z } from "zod";

export const sendMessageSchema = z.object({
  listingId: z.string().min(1),
  content: z.string().min(1).max(2000),
});

export const messageQuerySchema = z.object({
  listingId: z.string().min(1),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
