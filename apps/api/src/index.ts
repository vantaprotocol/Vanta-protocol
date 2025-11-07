import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { agents } from './routes.agents';
import { jobs } from './routes.jobs';
import { receipts } from './routes.receipts';
import { seedAgentIfEmpty } from './db';


const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));


app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/agents', agents);
app.use('/api/jobs', jobs);
app.use('/api/receipts', receipts);


seedAgentIfEmpty();


const port = Number(process.env.PORT || 8787);
app.listen(port, () => console.log(`API listening on :${port}`));
