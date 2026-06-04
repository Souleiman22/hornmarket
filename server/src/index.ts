import "./config/env"; // load dotenv first
import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

async function main() {
  // Verify DB connection
  await prisma.$connect();
  console.log("✓ Database connected");

  const server = app.listen(env.port, () => {
    console.log(`✓ HornMarket API running on http://localhost:${env.port}`);
    console.log(`  Environment : ${env.nodeEnv}`);
    console.log(`  Client URL  : ${env.clientUrl}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received — shutting down gracefully`);
    server.close(async () => {
      await prisma.$disconnect();
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
