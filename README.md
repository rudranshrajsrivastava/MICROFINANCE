# MSME Saathi

A Next.js MSME microfinance platform with wallet-free private blockchain simulation, credit scoring, user and bank portals, loan workflows, supply-chain tracking, deterministic local AI insights, and MySQL persistence through Prisma.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- lucide-react icons
- Prisma ORM with MySQL provider
- Browser `localStorage` fallback when `DATABASE_URL` or MySQL is unavailable
- SHA-256 linked-block ledger simulation

## Setup

```bash
npm install
cp .env.example .env.local
```

Create a MySQL database:

```sql
CREATE DATABASE msme_saathi;
```

Set your local MySQL connection in `.env.local`:

```bash
DATABASE_URL='mysql://root:password@localhost:3306/msme_saathi'
```

Run Prisma and start the app:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Then open the local URL printed by Next.js, usually `http://localhost:3000`.

## Local Fallback

If `DATABASE_URL` is missing or MySQL is not reachable, the frontend continues working with mock data and browser `localStorage`. When MySQL is configured, the app loads and saves users, transactions, blocks, loans, suppliers, purchase orders, and shipment events through `/api/state` using Prisma.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
npm run db:studio
npm run db:seed
```

## Core Features

- Landing page with User and Bank entry points
- User sign-up and sign-in with persisted session state
- Bank sign-in and bank lending dashboard
- User dashboard overview with credit score, sales, purchases, net cash flow, loans, shipments, and block count
- Transactions page for sales, purchases, and expenses
- Blockchain ledger page with index, timestamp, event type, payload, previous hash, current hash, and integrity verification
- Credit score page using the requested 300-900 formula and tier system
- Loans page with bank selection, auto-approval, repayments, and on-chain events
- Bank dashboard with amount lent, returned, outstanding, eligibility, and loan decision history
- Supply chain page for suppliers, purchase orders, and shipment events
- AI insights page with deterministic local cards for credit, supply-chain risk, working capital, and loan readiness

## Data Models

Prisma models live in `prisma/schema.prisma` and cover:

- `UserProfile`
- `Transaction`
- `Block`
- `Loan`
- `Supplier`
- `PurchaseOrder`
- `ShipmentEvent`
- `PartnerBank`
