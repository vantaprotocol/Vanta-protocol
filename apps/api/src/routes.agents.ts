import { Router } from 'express';
import { insertAgent, listAgents, getAgent } from './db';
import { randomUUID } from 'crypto';


export const agents = Router();


agents.get('/', (req, res) => {
const rows = listAgents.all();
res.json(rows.map(r => ({ ...r, tools: r.tools ? JSON.parse(r.tools) : [] })));
});


agents.post('/', (req, res) => {
const { name, description, model, tools } = req.body || {};
if (!name) return res.status(400).json({ error: 'name is required' });
const id = randomUUID();
insertAgent.run({
id,
name,
description: description || '',
model: model || 'gpt-4o-mini',
tools: JSON.stringify(tools || []),
createdAt: new Date().toISOString()
});
res.status(201).json({ id });
});


agents.get('/:id', (req, res) => {
const row = getAgent.get(req.params.id);
if (!row) return res.status(404).json({ error: 'not found' });
res.json({ ...row, tools: row.tools ? JSON.parse(row.tools) : [] });
});
