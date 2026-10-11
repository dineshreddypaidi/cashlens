import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";

import { DDL, SCHEMA_VERSION, MAIN_DATA_COLUMNS } from "./schema";
import { applyTxnToMainData } from "./txnRules";

const DB_NAME = "cashlens";

const sqlite = new SQLiteConnection(CapacitorSQLite);

let dbPromise = null;

async function openDb() {
  const existing = (await sqlite.isConnection(DB_NAME, false)).result;
  const db = existing
    ? await sqlite.retrieveConnection(DB_NAME, false)
    : await sqlite.createConnection(DB_NAME, false, "no-encryption", SCHEMA_VERSION, false);

  if (!(await db.isDBOpen()).result) {
    await db.open();
  }

  for (const stmt of DDL) {
    await db.execute(stmt);
  }

  return db;
}

function db() {
  if (!dbPromise) {
    dbPromise = openDb().catch((err) => {
      // Let the next call retry rather than caching a failed open forever.
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

async function readMainRow(conn) {
  // Mirrors Django's get_or_create(id=1, defaults={...0}) so a fresh install
  // behaves like a fresh server rather than erroring on a missing row.
  await conn.run(`INSERT OR IGNORE INTO main_maindata (id) VALUES (1);`);
  const res = await conn.query(`SELECT * FROM main_maindata WHERE id = 1;`);
  return res.values?.[0] ?? null;
}

export async function getMainData() {
  const conn = await db();
  const maindata = await readMainRow(conn);
  return { maindata };
}

export async function getTxnsRange(start, end) {
  const conn = await db();
  // BETWEEN on ISO YYYY-MM-DD text is inclusive and sorts correctly, matching
  // Django's date__range; ordering matches order_by("-date", "-id").
  const res = await conn.query(
    `SELECT id, date, category, description, note, amount, transaction_type
       FROM main_transactions
      WHERE date BETWEEN ? AND ?
      ORDER BY date DESC, id DESC;`,
    [start, end]
  );
  return { transactions: res.values ?? [] };
}

export async function addTxn(record) {
  const conn = await db();

  // Insert the transaction and apply the accounting rules atomically. The
  // Django view does not wrap these in a transaction; this path does.
  await conn.beginTransaction();
  try {
    await conn.run(
      `INSERT INTO main_transactions (date, category, description, note, amount, transaction_type)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        record.date,
        record.category,
        record.description ?? "",
        record.note ?? null,
        Number(record.amount) || 0,
        record.transaction_type,
      ],
      false
    );

    const main = await readMainRow(conn);
    const next = applyTxnToMainData(main, record);

    await conn.run(
      `UPDATE main_maindata
          SET ${MAIN_DATA_COLUMNS.map((c) => `${c} = ?`).join(", ")}
        WHERE id = 1;`,
      MAIN_DATA_COLUMNS.map((c) => next[c]),
      false
    );

    await conn.commitTransaction();
  } catch (err) {
    await conn.rollbackTransaction();
    throw err;
  }

  return { message: "record added succesful" };
}

export async function getRate() {
  // Offline build: no network call. format.js keeps its fallback rate.
  throw new Error("exchange rate unavailable offline");
}
