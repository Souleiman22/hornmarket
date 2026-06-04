import { Router } from "express";
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from "../controllers/favorites.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getFavorites);
router.post("/", authenticate, addFavorite);
router.get("/:listingId/check", authenticate, checkFavorite);
router.delete("/:listingId", authenticate, removeFavorite);

export default router;
