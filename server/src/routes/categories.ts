import { Router } from "express";
import { getCategories, getCategory } from "../controllers/categories.controller";

const router = Router();

router.get("/", getCategories);
router.get("/:idOrSlug", getCategory);

export default router;
