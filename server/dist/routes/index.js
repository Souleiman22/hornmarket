"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const listings_1 = __importDefault(require("./listings"));
const categories_1 = __importDefault(require("./categories"));
const messages_1 = __importDefault(require("./messages"));
const users_1 = __importDefault(require("./users"));
const favorites_1 = __importDefault(require("./favorites"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/listings", listings_1.default);
router.use("/categories", categories_1.default);
router.use("/messages", messages_1.default);
router.use("/users", users_1.default);
router.use("/favorites", favorites_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map