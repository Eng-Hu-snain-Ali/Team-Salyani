/**
 * Database Migration Runner
 * Usage: node database/migrate.js
 *
 * Runs all SQL migration files in order:
 *   001_create_enums.sql
 *   002_create_tables.sql
 *   003_create_indexes.sql
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { query } = require("../src/config/database");

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

async function runMigrations() {
  console.log("?? Starting database migrations...\n");

  // Get all .sql files sorted
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("??  No migration files found.");
    process.exit(0);
  }

  for (const file of files) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = fs.readFileSync(filePath, "utf8");

    console.log(`?? Running: ${file}`);

    try {
      // Remove single-line comments then split by semicolon
      const cleanedSql = sql
        .split('\n')
        .filter((line) => !line.trim().startsWith('--'))
        .join('\n');

      const statements = cleanedSql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const stmt of statements) {
        await query(stmt);
      }
      console.log(`   ? Done\n`);
    } catch (err) {
      // If type/table already exists, warn but continue
      if (
        err.message.includes("already exists") ||
        err.code === "42710" ||
        err.code === "42P07"
      ) {
        console.log(`   ??  Already exists, skipped\n`);
      } else {
        console.error(`   ? FAILED: ${err.message}\n`);
        console.error("Migration stopped. Fix the error and re-run.");
        process.exit(1);
      }
    }
  }

  console.log("? All migrations completed successfully!");
  process.exit(0);
}

runMigrations();
