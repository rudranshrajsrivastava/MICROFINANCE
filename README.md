# MSME Chain

A responsive microfinance dashboard for MSMEs with a local SHA-256 blockchain ledger, transaction tracking, on-chain credit scoring, micro-loans, supplier purchase orders, shipment updates, AI-style insights, plus working sign-up and sign-in flows.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. New users land on the marketing page first, then can sign up or sign in to access the dashboard.

## What is included

- Landing page with product positioning and live ledger preview
- Sign-up and sign-in using browser `localStorage`
- Overview dashboard with credit score, sales, purchases, cash flow, active loans, and shipments
- Transactions that mint into a linked SHA-256 block chain
- Blockchain ledger view with previous-hash linkage and payload display
- Credit score factors derived from on-chain activity
- Loan request and repayment actions recorded as transactions
- Supplier, purchase order, and shipment update workflows
- AI insights panel that generates an actionable plan from the current app state
