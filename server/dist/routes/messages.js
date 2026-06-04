"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messages_controller_1 = require("../controllers/messages.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const message_schema_1 = require("../schemas/message.schema");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, messages_controller_1.getMyConversations);
router.get("/:listingId", auth_1.authenticate, messages_controller_1.getConversation);
router.post("/", auth_1.authenticate, (0, validate_1.validate)(message_schema_1.sendMessageSchema), messages_controller_1.sendMessage);
exports.default = router;
//# sourceMappingURL=messages.js.map