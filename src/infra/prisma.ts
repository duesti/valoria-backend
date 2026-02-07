import { BunPostgresAdapter } from "@abcx3/prisma-bun-adapter";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { config } from "@/src/core/config/config";

const adapter = new BunPostgresAdapter({
	connectionString: config.db.dbUrl as string,
	maxConnections: 20,
});

const prisma = new PrismaClient({
	adapter: adapter,
	log: ["error", "warn", "query", "info"],
});

export { prisma };
