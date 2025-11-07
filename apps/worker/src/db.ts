import Database from 'better-sqlite3';
const dbPath = process.env.SQLITE_PATH || './data/vanta.db';
export const db = new Database(dbPath);
