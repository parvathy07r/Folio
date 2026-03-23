import { Pool } from "pg";

declare global {
  var __pgPool: Pool | undefined;
}

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const ssl = connectionString.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined;

  return new Pool({ connectionString, ssl });
}

export const pool: Pool = globalThis.__pgPool ?? getPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgPool = pool;
}
