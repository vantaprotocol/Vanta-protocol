import { Router } from 'express';
import crypto from 'crypto';
import { getJob, insertReceipt, getReceiptByJob } from './db';
import { randomUUID } from 'crypto';


export const receipts = Router();


// Create receipt from finished job (hash only). Client will write to chain.
receipts.post('/create', (req, res) => {
const { jobId } = req.body || {};
if (!jobId) return res.status(400).json({ error: 'jobId is required' });
const row = getJob.get(jobId);
if (!row) return res.status(404).json({ error: 'job not found' });
if (row.status !== 'succeeded') return res.status(400).json({ error: 'job not succeeded' });


const outputJson = row.output || '{}';
const hash = crypto.createHash('sha256').update(outputJson).digest('hex');


const existing = getReceiptByJob.get(jobId);
if (existing) return res.json(existing);


const id = randomUUID();
const createdAt = new Date().toISOString();
insertReceipt.run({ id, jobId, hash, solanaSignature: null, createdAt });
res.status(201).json({ id, jobId, hash, createdAt });
});


// Store chain signature after client writes SPL Memo
receipts.post('/attach-signature', (req, res) => {
const { jobId, signature } = req.body || {};
if (!jobId || !signature) return res.status(400).json({ error: 'jobId and signature are required' });
const row = getJob.get(jobId);
if (!row) return res.status(404).json({ error: 'job not found' });
const receipt = getReceiptByJob.get(jobId);
if (!receipt) return res.status(404).json({ error: 'receipt not found' });


// direct update
const stmt = `UPDATE receipts SET solanaSignature = ? WHERE id = ?`;
const db = require('better-sqlite3')(process.env.SQLITE_PATH || './data/vanta.db');
db.prepare(stmt).run(signature, receipt.id);
res.json({ ok: true });
});
