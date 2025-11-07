import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';


const dbPath = process.env.SQLITE_PATH || './data/vanta.db';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });


export const db = new Database(dbPath);


db.pragma('journal_mode = wal');


db.exec(`
CREATE TABLE IF NOT EXISTS agents (
id TEXT PRIMARY KEY,
name TEXT NOT NULL,
description TEXT,
model TEXT,
tools TEXT,
createdAt TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS jobs (
id TEXT PRIMARY KEY,
agentId TEXT NOT NULL,
input TEXT NOT NULL,
status TEXT NOT NULL,
output TEXT,
error TEXT,
createdAt TEXT NOT NULL,
updatedAt TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS receipts (
id TEXT PRIMARY KEY,
jobId TEXT NOT NULL,
hash TEXT NOT NULL,
solanaSignature TEXT,
createdAt TEXT NOT NULL
);
`);


export const insertAgent = db.prepare(`INSERT INTO agents (id,name,description,model,tools,createdAt) VALUES (@id,@name,@description,@model,@tools,@createdAt)`);
export const listAgents = db.prepare(`SELECT * FROM agents ORDER BY datetime(createdAt) DESC`);
export const getAgent = db.prepare(`SELECT * FROM agents WHERE id=?`);


export const insertJob = db.prepare(`INSERT INTO jobs (id,agentId,input,status,createdAt,updatedAt) VALUES (@id,@agentId,@input,@status,@createdAt,@updatedAt)`);
export const updateJob = db.prepare(`UPDATE jobs SET status=@status, output=@output, error=@error, updatedAt=@updatedAt WHERE id=@id`);
export const getJob = db.prepare(`SELECT * FROM jobs WHERE id=?`);


export const insertReceipt = db.prepare(`INSERT INTO receipts (id,jobId,hash,solanaSignature,createdAt) VALUES (@id,@jobId,@hash,@solanaSignature,@createdAt)`);
export const getReceiptByJob = db.prepare(`SELECT * FROM receipts WHERE jobId=?`);


export function seedAgentIfEmpty() {
const count = db.prepare('SELECT COUNT(*) as c FROM agents').get() as any;
if (count.c === 0) {
insertAgent.run({
id: randomUUID(),
name: 'VANTA Outreach Agent',
description: 'Handles outbound outreach / summarization tasks',
model: 'gpt-4o-mini',
tools: JSON.stringify(['web_search', 'summarize']),
createdAt: new Date().toISOString()
});
}
}
