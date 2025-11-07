# VANTA Protocol


Production-grade AI agents + on-chain receipts. Off-chain API/Worker (Node/TS, SQLite). On-chain using SPL Memo by default; optional Anchor program for richer state.


## Run locally
```bash
cp .env.example .env
npm i
npm run build
npm run dev:api
npm run dev:worker
# open apps/web/index.html in a static server / Live Server
