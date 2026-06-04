"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const user_schema_1 = require("../schemas/user.schema");
const router = (0, express_1.Router)();
router.get("/dashboard", auth_1.authenticate, users_controller_1.getDashboard);
router.get("/:id", users_controller_1.getPublicProfile);
router.patch("/profile", auth_1.authenticate, (0, validate_1.validate)(user_schema_1.updateProfileSchema), users_controller_1.updateProfile);
router.post("/change-password", auth_1.authenticate, (0, validate_1.validate)(user_schema_1.changePasswordSchema), users_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=users.js.map