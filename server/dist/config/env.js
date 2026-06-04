"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
function required(key) {
    const val = process.env[key];
    if (!val)
        throw new Error(`Missing env variable: ${key}`);
    return val;
}
exports.env = {
    port: parseInt(process.env.PORT ?? "4000", 10),
    nodeEnv: process.env.NODE_ENV ?? "development",
    clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
    jwt: {
        secret: required("JWT_SECRET"),
        refreshSecret: required("JWT_REFRESH_SECRET"),
        expiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
    },
    isDev: process.env.NODE_ENV !== "production",
};
//# sourceMappingURL=env.js.map