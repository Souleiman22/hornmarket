import { z } from "zod";
export declare const createListingSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    location: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
    categoryId: z.ZodString;
    images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    location: string;
    title: string;
    description: string;
    price: number;
    country: string;
    categoryId: string;
    images: string[];
}, {
    location: string;
    title: string;
    description: string;
    price: number;
    categoryId: string;
    country?: string | undefined;
    images?: string[] | undefined;
}>;
export declare const updateListingSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    categoryId: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
} & {
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "SOLD", "PAUSED"]>>;
}, "strip", z.ZodTypeAny, {
    location?: string | undefined;
    status?: "ACTIVE" | "SOLD" | "PAUSED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    country?: string | undefined;
    categoryId?: string | undefined;
    images?: string[] | undefined;
}, {
    location?: string | undefined;
    status?: "ACTIVE" | "SOLD" | "PAUSED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    country?: string | undefined;
    categoryId?: string | undefined;
    images?: string[] | undefined;
}>;
export declare const listingQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    sort: z.ZodDefault<z.ZodEnum<["newest", "oldest", "price_asc", "price_desc"]>>;
    status: z.ZodDefault<z.ZodEnum<["ACTIVE", "SOLD", "PAUSED"]>>;
}, "strip", z.ZodTypeAny, {
    sort: "newest" | "oldest" | "price_asc" | "price_desc";
    status: "ACTIVE" | "SOLD" | "PAUSED";
    page: number;
    limit: number;
    search?: string | undefined;
    location?: string | undefined;
    country?: string | undefined;
    categoryId?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
}, {
    search?: string | undefined;
    sort?: "newest" | "oldest" | "price_asc" | "price_desc" | undefined;
    location?: string | undefined;
    status?: "ACTIVE" | "SOLD" | "PAUSED" | undefined;
    country?: string | undefined;
    categoryId?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
}>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListingQuery = z.infer<typeof listingQuerySchema>;
//# sourceMappingURL=listing.schema.d.ts.map