"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageQuerySchema = exports.sendMessageSchema = void 0;
const zod_1 = require("zod");
exports.sendMessageSchema = zod_1.z.object({
    listingId: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1).max(2000),
});
exports.messageQuerySchema = zod_1.z.object({
    listingId: zod_1.z.string().min(1),
});
//# sourceMappingURL=message.schema.js.map