import { Router } from 'express';
import { insertJob, getJob, updateJob } from './db';
import { randomUUID } from 'crypto';


export const jobs = Router();


jobs.post('/', (req, res) => {
const { agentId, input } = req.body || {};
if (!agentId) return res.status(400).json({ error: 'agentId is required' });
if (!input) return res.status(400).json({ error: 'input is required' });


const id = randomUUID();
const now = new Date().toISOString();
insertJob.run({
id,
agentId,
input: JSON.stringify(input),
status: 'queued',
createdAt: now,
updatedAt: now
});
res.status(201).json({ id, status: 'queued' });
});


jobs.get('/:id', (req, res) => {
const row = getJob.get(req.params.id);
if (!row) return res.status(404).json({ error: 'not found' });
res.json({
...row,
input: JSON.parse(row.input),
output: row.output ? JSON.parse(row.output) : undefined
});
});


// Optional: allow manual cancel/fail (not used by worker)
jobs.post('/:id/fail', (req, res) => {
const row = getJob.get(req.params.id);
if (!row) return res.status(404).json({ error: 'not found' });
updateJob.run({ id: row.id, status: 'failed', output: null, error: 'manually failed', updatedAt: new Date().toISOString() });
res.json({ ok: true });
});
