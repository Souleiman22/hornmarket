import { Router } from "express";
import {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
} from "../controllers/listings.controller";
import { authenticate, optionalAuth } from "../middleware/auth";
import { validate, validateQuery } from "../middleware/validate";
import { createListingSchema, updateListingSchema, listingQuerySchema } from "../schemas/listing.schema";

const router = Router();

router.get("/", optionalAuth, validateQuery(listingQuerySchema), getListings);
router.get("/mine", authenticate, getMyListings);
router.get("/:id", optionalAuth, getListing);
router.post("/", authenticate, validate(createListingSchema), createListing);
router.patch("/:id", authenticate, validate(updateListingSchema), updateListing);
router.delete("/:id", authenticate, deleteListing);

export default router;
