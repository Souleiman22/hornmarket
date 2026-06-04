"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/env"); // load dotenv first
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = require("./lib/prisma");
async function main() {
    // Verify DB connection
    await prisma_1.prisma.$connect();
    console.log("✓ Database connected");
    const server = app_1.default.listen(env_1.env.port, () => {
        console.log(`✓ HornMarket API running on http://localhost:${env_1.env.port}`);
        console.log(`  Environment : ${env_1.env.nodeEnv}`);
        console.log(`  Client URL  : ${env_1.env.clientUrl}`);
    });
    const shutdown = async (signal) => {
        console.log(`\n${signal} received — shutting down gracefully`);
        server.close(async () => {
            await prisma_1.prisma.$disconnect();
            console.log("✓ Database disconnected");
            process.exit(0);
        });
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
}
main().catch((err) => {
    console.error("Fatal startup error:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map