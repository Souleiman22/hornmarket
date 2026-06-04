"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listings_controller_1 = require("../controllers/listings.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const listing_schema_1 = require("../schemas/listing.schema");
const router = (0, express_1.Router)();
router.get("/", auth_1.optionalAuth, (0, validate_1.validateQuery)(listing_schema_1.listingQuerySchema), listings_controller_1.getListings);
router.get("/mine", auth_1.authenticate, listings_controller_1.getMyListings);
router.get("/:id", auth_1.optionalAuth, listings_controller_1.getListing);
router.post("/", auth_1.authenticate, (0, validate_1.validate)(listing_schema_1.createListingSchema), listings_controller_1.createListing);
router.patch("/:id", auth_1.authenticate, (0, validate_1.validate)(listing_schema_1.updateListingSchema), listings_controller_1.updateListing);
router.delete("/:id", auth_1.authenticate, listings_controller_1.deleteListing);
exports.default = router;
//# sourceMappingURL=listings.js.map