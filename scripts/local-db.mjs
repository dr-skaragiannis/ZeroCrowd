/**
 * Starts a local embedded PostgreSQL server for development.
 *
 * The cluster is stored in ./.pgdata (gitignored) and listens on
 * 127.0.0.1:5432 with user/password `postgres`/`postgres`, matching
 * drizzle.config.json and .env. Safe to re-run: it reuses an existing
 * cluster and skips database creation if the DB already exists.
 *
 * Usage: npm run db:start
 */
import fs from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const databaseDir = path.resolve(process.cwd(), ".pgdata");

const pg = new EmbeddedPostgres({
  databaseDir,
  user: "postgres",
  password: "postgres",
  port: 5432,
  persistent: true,
});

const clusterExists = fs.existsSync(path.join(databaseDir, "PG_VERSION"));

if (!clusterExists) {
  console.log(`[db] initialising cluster at ${databaseDir}`);
  await pg.initialise();
} else {
  console.log(`[db] reusing existing cluster at ${databaseDir}`);
}

console.log("[db] starting postgresql on 127.0.0.1:5432");
await pg.start();

try {
  await pg.createDatabase("app_db");
  console.log("[db] created database app_db");
} catch (error) {
  console.log("[db] database app_db already exists, skipping creation");
}

console.log("[db] ready — press Ctrl+C to stop");
