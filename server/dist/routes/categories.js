"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_controller_1 = require("../controllers/categories.controller");
const router = (0, express_1.Router)();
router.get("/", categories_controller_1.getCategories);
router.get("/:idOrSlug", categories_controller_1.getCategory);
exports.default = router;
//# sourceMappingURL=categories.js.map