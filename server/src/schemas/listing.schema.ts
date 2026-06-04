import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  price: z.number().nonnegative(),
  location: z.string().min(2).max(200),
  country: z.string().length(2).default("SN"),
  categoryId: z.string().min(1),
  images: z.array(z.string().url()).max(10).default([]),
});

export const updateListingSchema = createListingSchema.partial().extend({
  status: z.enum(["ACTIVE", "SOLD", "PAUSED"]).optional(),
});

export const listingQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sort: z.enum(["newest", "oldest", "price_asc", "price_desc"]).default("newest"),
  status: z.enum(["ACTIVE", "SOLD", "PAUSED"]).default("ACTIVE"),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListingQuery = z.infer<typeof listingQuerySchema>;
