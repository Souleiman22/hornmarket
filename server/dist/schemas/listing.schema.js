"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingQuerySchema = exports.updateListingSchema = exports.createListingSchema = void 0;
const zod_1 = require("zod");
exports.createListingSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().min(10).max(5000),
    price: zod_1.z.number().nonnegative(),
    location: zod_1.z.string().min(2).max(200),
    country: zod_1.z.string().length(2).default("SN"),
    categoryId: zod_1.z.string().min(1),
    images: zod_1.z.array(zod_1.z.string().url()).max(10).default([]),
});
exports.updateListingSchema = exports.createListingSchema.partial().extend({
    status: zod_1.z.enum(["ACTIVE", "SOLD", "PAUSED"]).optional(),
});
exports.listingQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(50).default(12),
    search: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    minPrice: zod_1.z.coerce.number().nonnegative().optional(),
    maxPrice: zod_1.z.coerce.number().nonnegative().optional(),
    sort: zod_1.z.enum(["newest", "oldest", "price_asc", "price_desc"]).default("newest"),
    status: zod_1.z.enum(["ACTIVE", "SOLD", "PAUSED"]).default("ACTIVE"),
});
//# sourceMappingURL=listing.schema.js.map