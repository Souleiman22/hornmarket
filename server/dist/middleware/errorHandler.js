"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.notFound = notFound;
exports.errorHandler = errorHandler;
const env_1 = require("../config/env");
class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
function notFound(req, res) {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
}
function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }
    // Prisma unique constraint violation
    if (err.code === "P2002") {
        const field = err.meta?.target?.[0] ?? "field";
        res.status(409).json({ error: `${field} already exists` });
        return;
    }
    // Prisma record not found
    if (err.code === "P2025") {
        res.status(404).json({ error: "Resource not found" });
        return;
    }
    console.error(err);
    res.status(500).json({
        error: "Internal server error",
        ...(env_1.env.isDev && { details: err.message }),
    });
}
//# sourceMappingURL=errorHandler.js.map