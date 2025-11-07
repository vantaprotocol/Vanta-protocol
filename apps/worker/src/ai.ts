import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';


export async function run(prompt: string) {
const res = await client.chat.completions.create({
model,
messages: [
{ role: 'system', content: 'You are a production-grade automation agent. Return concise JSON when possible.' },
{ role: 'user', content: prompt }
]
});
return res.choices?.[0]?.message?.content || '';
}
