import { Connection, PublicKey } from '@solana/web3.js';


export const SOLANA_RPC = process.env.SOLANA_RPC || 'https://api.devnet.solana.com';
export const connection = new Connection(SOLANA_RPC, 'confirmed');


// For the default flow we rely on the client wallet (Phantom) to send tx with SPL Memo.
// Server just exposes helper constants if needed.
export const SPL_MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
