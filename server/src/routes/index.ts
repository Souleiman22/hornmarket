import { Router } from "express";
import authRoutes from "./auth";
import listingRoutes from "./listings";
import categoryRoutes from "./categories";
import messageRoutes from "./messages";
import userRoutes from "./users";
import favoriteRoutes from "./favorites";

const router = Router();

router.use("/auth", authRoutes);
router.use("/listings", listingRoutes);
router.use("/categories", categoryRoutes);
router.use("/messages", messageRoutes);
router.use("/users", userRoutes);
router.use("/favorites", favoriteRoutes);

export default router;
