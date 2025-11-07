use anchor_lang::prelude::*;


// Replace via scripts/set-id.sh after deploy
// Example: declare_id!("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
declare_id!("11111111111111111111111111111111");


#[program]
mod vanta {
use super::*;


pub fn register_agent(ctx: Context<RegisterAgent>, name: String) -> Result<()> {
let agent = &mut ctx.accounts.agent;
agent.authority = *ctx.accounts.authority.key;
agent.name = name;
agent.bump = *ctx.bumps.get("agent").unwrap();
Ok(())
}


pub fn submit_receipt(ctx: Context<SubmitReceipt>, job_id: [u8;16], hash: [u8;32]) -> Result<()> {
let rec = &mut ctx.accounts.receipt;
rec.agent = ctx.accounts.agent.key();
rec.job_id = job_id;
rec.hash = hash;
rec.timestamp = Clock::get()?.unix_timestamp;
rec.bump = *ctx.bumps.get("receipt").unwrap();
Ok(())
}
}


#[account]
pub struct Agent {
pub authority: Pubkey,
pub name: String,
pub bump: u8,
}


#[account]
pub struct Receipt {
pub agent: Pubkey,
pub job_id: [u8;16],
pub hash: [u8;32],
pub timestamp: i64,
pub bump: u8,
}


#[derive(Accounts)]
pub struct RegisterAgent<'info> {
#[account(mut)]
pub authority: Signer<'info>,
#[account(
init,
payer = authority,
seeds=[b"agent", authority.key().as_ref()],
bump,
space=8+32+4+64+1
)]
pub agent: Account<'info, Agent>,
pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct SubmitReceipt<'info> {
pub authority: Signer<'info>,
#[account(
seeds=[b"agent", authority.key().as_ref()],
bump=agent.bump
)]
pub agent: Account<'info, Agent>,
#[account(
init,
payer = authority,
seeds=[b"receipt", agent.key().as_ref(), &job_id],
bump,
space=8+32+16+32+8+1
)]
pub receipt: Account<'info, Receipt>,
/// CHECK: job id seed passed via instruction data
pub system_program: Program<'info, System>,
/// Remaining accounts carry job_id seed bytes
}
