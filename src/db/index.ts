import { drizzle } from "drizzle-orm/postgres-js";
import type { Logger } from "drizzle-orm/logger";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

/** Slow query threshold in ms (configurable via env, default 500ms) */
const SLOW_QUERY_THRESHOLD_MS = parseInt(process.env.DB_SLOW_QUERY_MS || "500", 10);

/**
 * Drizzle logger for development query visibility.
 * Set DB_LOG_ALL=true to log every query to stdout.
 * For slow query detection, wrap DB calls with withQueryTiming().
 */
class QueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    if (process.env.DB_LOG_ALL === "true") {
      console.log("[DB] Query:", query.slice(0, 200), params.length ? `(${params.length} params)` : "");
    }
  }
}

// Only initialize if DATABASE_URL is provided (server-side only)
const sql = connectionString
  ? postgres(connectionString, {
      max: parseInt(process.env.DB_POOL_MAX || "10", 10),
      idle_timeout: 20,
      connect_timeout: 10,
      connection: { statement_timeout: 30 },
      onnotice: () => {}, // suppress NOTICE messages
    })
  : null;

// Log connection-level errors gracefully (prevent unhandled crashes)
if (sql) {
  sql.unsafe("SELECT 1").catch((err: unknown) => {
    console.error("[DB] Initial connection check failed:", err instanceof Error ? err.message : err);
  });
}

const queryLogger = new QueryLogger();

export const db = sql ? drizzle(sql, { schema, logger: queryLogger }) : null;

/**
 * Execute a database operation with slow query monitoring.
 * Logs a warning when the operation exceeds SLOW_QUERY_THRESHOLD_MS.
 *
 * Usage:
 *   const rows = await withQueryTiming("GET /api/ranking", () =>
 *     db.select().from(sessions).limit(10)
 *   );
 */
export async function withQueryTiming<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const durationMs = Math.round(performance.now() - start);
    if (durationMs > SLOW_QUERY_THRESHOLD_MS) {
      console.warn(
        `[DB SLOW] ${label} took ${durationMs}ms (threshold: ${SLOW_QUERY_THRESHOLD_MS}ms)`
      );
    }
    return result;
  } catch (error) {
    const durationMs = Math.round(performance.now() - start);
    console.error(
      `[DB ERROR] ${label} failed after ${durationMs}ms:`,
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

/** Check if database is available */
export function isDbAvailable(): boolean {
  return db !== null;
}
