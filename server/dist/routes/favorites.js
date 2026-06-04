"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorites_controller_1 = require("../controllers/favorites.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, favorites_controller_1.getFavorites);
router.post("/", auth_1.authenticate, favorites_controller_1.addFavorite);
router.get("/:listingId/check", auth_1.authenticate, favorites_controller_1.checkFavorite);
router.delete("/:listingId", auth_1.authenticate, favorites_controller_1.removeFavorite);
exports.default = router;
//# sourceMappingURL=favorites.js.map