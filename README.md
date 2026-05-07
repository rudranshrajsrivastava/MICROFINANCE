# MSME Chain

A complete Next.js MSME microfinance platform with wallet-free private blockchain simulation, on-chain credit scoring, loan workflows, supply-chain tracking, deterministic local AI insights, and localStorage persistence when backend environment variables are not configured.

## Tech Stack

- Next.js 14+ App Router
- TypeScript
- Tailwind CSS
- lucide-react icons
- Supabase/PostgreSQL-ready schema in `supabase/schema.sql`
- Browser `localStorage` fallback data
- SHA-256 linked-block ledger simulation

## Setup

```bash
npm install
npm run dev
```

Then open the local URL printed by Next.js, usually `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` when wiring a backend:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
```

The app works without those variables by using local mock data and localStorage session persistence.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Core Features

- Landing page with Sign Up, Sign In, and Dashboard CTAs
- Working sign-up and sign-in pages with persisted session state
- Dashboard overview with credit score, sales, purchases, net cash flow, loans, shipments, and block count
- Transactions page for sales, purchases, and expenses
- Blockchain ledger page with index, timestamp, event type, payload, previous hash, current hash, and integrity verification
- Credit score page using the requested 300-900 formula and tier system
- Loans page with auto-approval from score bands and monthly net cash flow
- Supply chain page for suppliers, purchase orders, and shipment events
- AI insights page with deterministic local cards for credit, supply-chain risk, working capital, and loan readiness

## Data Models

The app defines typed models for users, transactions, blocks, loans, suppliers, purchase orders, and shipment events in `lib/types.ts`. The PostgreSQL-ready schema mirrors those models in `supabase/schema.sql`.
