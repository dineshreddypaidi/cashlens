/**
 * Mirrors the Django tables (main/models.py) including Django's default
 * `app_model` table naming, so a future device-to-server sync has a straight
 * path. `amount` is INTEGER because Django uses IntegerField — no decimals on
 * either side.
 */
export const SCHEMA_VERSION = 1;

export const DDL = [
  `CREATE TABLE IF NOT EXISTS main_maindata (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     current_value INTEGER NOT NULL DEFAULT 0,
     investments INTEGER NOT NULL DEFAULT 0,
     total_debt INTEGER NOT NULL DEFAULT 0,
     total_income INTEGER NOT NULL DEFAULT 0,
     contributed_one_perc INTEGER NOT NULL DEFAULT 0
   );`,
  `CREATE TABLE IF NOT EXISTS main_transactions (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     date TEXT NOT NULL,
     category TEXT NOT NULL,
     description TEXT NOT NULL,
     note TEXT,
     amount INTEGER NOT NULL,
     transaction_type TEXT NOT NULL CHECK (transaction_type IN ('expense','income'))
   );`,
  `CREATE INDEX IF NOT EXISTS idx_txn_date ON main_transactions(date);`,
  `CREATE TABLE IF NOT EXISTS app_meta (
     key TEXT PRIMARY KEY,
     value TEXT
   );`,
];

export const MAIN_DATA_COLUMNS = [
  "current_value",
  "investments",
  "total_debt",
  "total_income",
  "contributed_one_perc",
];
