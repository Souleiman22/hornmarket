import { z } from "zod";
export declare const sendMessageSchema: z.ZodObject<{
    listingId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    listingId: string;
    content: string;
}, {
    listingId: string;
    content: string;
}>;
export declare const messageQuerySchema: z.ZodObject<{
    listingId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    listingId: string;
}, {
    listingId: string;
}>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
//# sourceMappingURL=message.schema.d.ts.map