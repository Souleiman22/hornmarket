"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.me = me;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../lib/jwt");
const errorHandler_1 = require("../middleware/errorHandler");
async function register(req, res, next) {
    try {
        const { name, email, password, phone, location } = req.body;
        const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new errorHandler_1.AppError(409, "Email already in use");
        const hashed = await bcryptjs_1.default.hash(password, 12);
        const user = await prisma_1.prisma.user.create({
            data: { name, email, password: hashed, phone, location },
            select: { id: true, name: true, email: true, phone: true, location: true, createdAt: true },
        });
        const payload = { userId: user.id, email: user.email };
        res.status(201).json({
            user,
            accessToken: (0, jwt_1.signAccessToken)(payload),
            refreshToken: (0, jwt_1.signRefreshToken)(payload),
        });
    }
    catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user || !user.password)
            throw new errorHandler_1.AppError(401, "Invalid credentials");
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid)
            throw new errorHandler_1.AppError(401, "Invalid credentials");
        const payload = { userId: user.id, email: user.email };
        res.json({
            user: { id: user.id, name: user.name, email: user.email, image: user.image },
            accessToken: (0, jwt_1.signAccessToken)(payload),
            refreshToken: (0, jwt_1.signRefreshToken)(payload),
        });
    }
    catch (err) {
        next(err);
    }
}
async function refresh(req, res, next) {
    try {
        const { refreshToken } = req.body;
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user)
            throw new errorHandler_1.AppError(401, "User not found");
        const newPayload = { userId: user.id, email: user.email };
        res.json({
            accessToken: (0, jwt_1.signAccessToken)(newPayload),
            refreshToken: (0, jwt_1.signRefreshToken)(newPayload),
        });
    }
    catch (err) {
        next(err);
    }
}
async function me(req, res, next) {
    try {
        const user = await prisma_1.prisma.user.findUniqueOrThrow({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                location: true,
                image: true,
                createdAt: true,
                _count: { select: { listings: true } },
            },
        });
        res.json(user);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.controller.js.map