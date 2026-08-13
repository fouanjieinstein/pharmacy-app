import { defineConfig, env } from "prisma/config";

// Prisma 7 reads datasource configuration from here rather than from
// schema.prisma's env() block, and it does not load .env automatically —
// so we load it explicitly before resolving DATABASE_URL.
// (Next.js still loads .env itself at runtime; this is only for the CLI.)
try {
  process.loadEnvFile(".env");
} catch {
  // .env is optional — in CI/production the variable is set in the environment.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
