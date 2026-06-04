import { Router } from "express";
import { sendMessage, getConversation, getMyConversations } from "../controllers/messages.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sendMessageSchema } from "../schemas/message.schema";

const router = Router();

router.get("/", authenticate, getMyConversations);
router.get("/:listingId", authenticate, getConversation);
router.post("/", authenticate, validate(sendMessageSchema), sendMessage);

export default router;
