import OpenAI from 'openai';


const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';


export async function runAgentTask(prompt: string) {
const res = await client.chat.completions.create({
model,
messages: [
{ role: 'system', content: 'You are a production-grade automation agent. Be concise and actionable.' },
{ role: 'user', content: prompt }
]
});
const text = res.choices?.[0]?.message?.content || '';
return { text };
}
