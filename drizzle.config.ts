import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config();

// Locate the local D1 SQLite file created by `pnpm dev` (used by studio/push/pull).
// `db:generate` does not need it, so it's optional.
function findLocalD1DatabasePath(): string | undefined {
	const wranglerDir = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject";
	if (!existsSync(wranglerDir)) return undefined;

	const sqliteFile = readdirSync(wranglerDir).find((file) =>
		file.endsWith(".sqlite"),
	);
	return sqliteFile ? join(wranglerDir, sqliteFile) : undefined;
}

const localDbPath = findLocalD1DatabasePath();

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	...(localDbPath && { dbCredentials: { url: localDbPath } }),
});
