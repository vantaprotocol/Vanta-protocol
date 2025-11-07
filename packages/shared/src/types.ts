export type Agent = {
id: string;
name: string;
description?: string;
model?: string;
tools?: string[]; // names of tools the agent can call
createdAt: string;
};


export type Job = {
id: string;
agentId: string;
input: any;
status: "queued" | "running" | "succeeded" | "failed";
output?: any;
error?: string;
createdAt: string;
updatedAt: string;
};


export type Receipt = {
id: string; // UUID
jobId: string;
hash: string; // sha256 of job output JSON
solanaSignature?: string; // tx signature when written via SPL Memo
createdAt: string;
};
