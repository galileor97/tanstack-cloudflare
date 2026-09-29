// Single schema entry point for Drizzle (drizzle.config.ts) and Better Auth.
// Each feature defines its tables in `features/<name>/schema.ts`; re-export them here.
// Relative paths, because drizzle-kit doesn't resolve the `@/` alias.
export * from "../features/auth/schema";
