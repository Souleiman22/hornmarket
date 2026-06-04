import { Router } from "express";
import { getPublicProfile, updateProfile, changePassword, getDashboard } from "../controllers/users.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateProfileSchema, changePasswordSchema } from "../schemas/user.schema";

const router = Router();

router.get("/dashboard", authenticate, getDashboard);
router.get("/:id", getPublicProfile);
router.patch("/profile", authenticate, validate(updateProfileSchema), updateProfile);
router.post("/change-password", authenticate, validate(changePasswordSchema), changePassword);

export default router;
