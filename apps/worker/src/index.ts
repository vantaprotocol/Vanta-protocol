import 'dotenv/config';
import { db } from './db';
import { run } from './ai';
import { sleep } from './util';


const selectQueued = db.prepare(`SELECT * FROM jobs WHERE status='queued' ORDER BY datetime(createdAt) ASC LIMIT 1`);
const setRunning = db.prepare(`UPDATE jobs SET status='running', updatedAt=@updatedAt WHERE id=@id`);
const setResult = db.prepare(`UPDATE jobs SET status=@status, output=@output, error=@error, updatedAt=@updatedAt WHERE id=@id`);


async function loop() {
while (true) {
const job = selectQueued.get();
if (job) {
try {
setRunning.run({ id: job.id, updatedAt: new Date().toISOString() });
const input = JSON.parse(job.input);
const prompt = typeof input === 'string' ? input : JSON.stringify(input);
const out = await run(prompt);
setResult.run({ id: job.id, status: 'succeeded', output: JSON.stringify({ text: out }), error: null, updatedAt: new Date().toISOString() });
} catch (e: any) {
setResult.run({ id: job.id, status: 'failed', output: null, error: String(e?.message || e), updatedAt: new Date().toISOString() });
}
}
await sleep(1500);
}
}


loop();
