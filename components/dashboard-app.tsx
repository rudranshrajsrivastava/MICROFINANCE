"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  HandCoins,
  Home,
  Link as LinkIcon,
  LogOut,
  Menu,
  PackagePlus,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Truck,
  XCircle
} from "lucide-react";
import { Brand } from "./brand";
import { partnerBanks } from "@/lib/banks";
import { createBlock, shortHash, verifyChain } from "@/lib/blockchain";
import { calculateCreditScore, loanLimit } from "@/lib/credit-score";
import { generateInsights, type InsightCard } from "@/lib/mock-ai";
import { initialState, loadPersistedState, savePersistedState } from "@/lib/storage";
import type { AppState, Loan, PurchaseOrder, ShipmentStatus, Supplier, Transaction, TransactionType } from "@/lib/types";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const nav = [
  { href: "/user", label: "Overview", icon: Home },
  { href: "/dashboard/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/dashboard/ledger", label: "Blockchain Ledger", icon: Boxes },
  { href: "/dashboard/credit-score", label: "Credit Score", icon: ArrowUpRight },
  { href: "/dashboard/loans", label: "Loans", icon: HandCoins },
  { href: "/dashboard/supply-chain", label: "Supply Chain", icon: Truck },
  { href: "/dashboard/ai-insights", label: "AI Insights", icon: Sparkles }
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function seedBlocks(state: AppState): Promise<AppState> {
  if (state.blocks.length > 0) return state;
  let blocks = state.blocks;
  const events: Array<[string, Record<string, unknown>]> = [
    ["genesis", { userId: state.user?.id ?? "demo", businessName: state.user?.businessName ?? "xyz" }],
    ...state.transactions.map((tx) => ["transaction_created", tx] as [string, Record<string, unknown>]),
    ...state.loans.map((loan) => ["loan_requested", loan] as [string, Record<string, unknown>]),
    ...state.purchaseOrders.flatMap((po) => [
      ["purchase_order_created", po] as [string, Record<string, unknown>],
      ...po.events.map((event) => ["shipment_updated", { purchaseOrderId: po.id, ...event }] as [string, Record<string, unknown>])
    ])
  ];
  for (const [eventType, payload] of events) blocks = [...blocks, await createBlock(blocks, eventType, payload)];
  return { ...state, blocks };
}

export function DashboardApp({ page }: { page: "overview" | "transactions" | "ledger" | "credit" | "loans" | "supply" | "ai" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AppState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [chainValid, setChainValid] = useState(true);

  useEffect(() => {
    loadPersistedState().then(seedBlocks).then((next) => {
      setState(next);
      savePersistedState(next);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) savePersistedState(state);
    verifyChain(state.blocks).then(setChainValid);
  }, [state, loaded]);

  const credit = useMemo(() => calculateCreditScore(state.transactions, state.loans), [state.transactions, state.loans]);
  const sales = state.transactions.filter((tx) => tx.type === "sale").reduce((sum, tx) => sum + tx.amount, 0);
  const purchases = state.transactions.filter((tx) => tx.type !== "sale").reduce((sum, tx) => sum + tx.amount, 0);
  const activeLoans = state.loans.filter((loan) => ["approved", "active", "partially_repaid"].includes(loan.status));
  const inTransit = state.purchaseOrders.filter((po) => po.status !== "delivered").length;

  function update(mutator: (current: AppState) => Promise<AppState> | AppState) {
    Promise.resolve(mutator(state)).then(setState);
  }

  function logout() {
    update((current) => ({ ...current, user: current.user ? { ...current.user, signedIn: false } : null }));
    router.push("/");
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[340px_1fr]">
      <button className="fixed left-4 top-4 z-40 rounded-xl border border-line bg-panel p-3 lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open menu"><Menu /></button>
      {navOpen && <button className="fixed inset-0 z-40 bg-ink/40 lg:hidden" onClick={() => setNavOpen(false)} aria-label="Close menu" />}
      <aside className={`fixed inset-y-0 left-0 z-50 grid w-[min(340px,88vw)] grid-rows-[auto_1fr_auto] border-r border-line bg-paper transition lg:sticky lg:top-0 lg:translate-x-0 ${navOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-7"><Brand /></div>
        <nav className="border-t border-line p-4">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/user" ? pathname === href || pathname === "/dashboard" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} onClick={() => setNavOpen(false)} className={`mb-2 flex min-h-12 items-center gap-3 rounded-xl px-4 text-lg font-semibold ${active ? "bg-wheat text-ink" : "text-slate-600 hover:bg-wheat/60"}`}>
                <Icon size={21} /> {label}
              </Link>
            );
          })}
        </nav>
        <section className="m-5 rounded-2xl border border-line bg-panel p-5">
          <p className="eyebrow">Signed in</p>
          <strong className="mt-3 block text-lg">{state.user?.businessName ?? "Guest"}</strong>
          <span className="block text-slate-600">{state.user?.email ?? "No session"}</span>
          <button className="mt-5 inline-flex items-center gap-2 font-bold text-forest" onClick={logout}><LogOut size={18} /> Logout</button>
        </section>
      </aside>

      <main className="min-w-0 px-5 py-20 lg:px-10 lg:py-10 xl:px-12">
        {page === "overview" && <Overview credit={credit} sales={sales} purchases={purchases} activeLoans={activeLoans.length} inTransit={inTransit} blocks={state.blocks.length} />}
        {page === "transactions" && <TransactionsPage state={state} update={update} />}
        {page === "ledger" && <LedgerPage state={state} valid={chainValid} />}
        {page === "credit" && <CreditPage credit={credit} />}
        {page === "loans" && <LoansPage state={state} credit={credit} update={update} />}
        {page === "supply" && <SupplyPage state={state} update={update} />}
        {page === "ai" && <AIPage state={state} />}
      </main>
    </div>
  );
}

function Header({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-black leading-none md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-4xl text-xl leading-8 text-slate-600">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}

function Overview({ credit, sales, purchases, activeLoans, inTransit, blocks }: { credit: ReturnType<typeof calculateCreditScore>; sales: number; purchases: number; activeLoans: number; inTransit: number; blocks: number }) {
  return (
    <>
      <Header eyebrow="Overview" title="Your business, on-chain." subtitle="Live data persists through MySQL when DATABASE_URL is configured, with browser localStorage fallback for offline demos." action={<span className="inline-flex rounded-full border border-line bg-wheat px-4 py-2 font-bold"><Boxes size={18} className="mr-2 text-moss" /> {blocks} blocks minted</span>} />
      <section className="grid gap-5 xl:grid-cols-4">
        <article className="card p-6 xl:col-span-2">
          <p className="eyebrow">Credit score</p>
          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_220px]">
            <div><strong className="block text-6xl font-black">{credit.creditScore}</strong><p className="mt-3 text-xl text-slate-600">Tier · <span className="font-bold text-forest">{credit.tier}</span></p></div>
            <div className="grid aspect-square place-items-center rounded-full" style={{ background: `radial-gradient(circle, #ffffff 58%, transparent 60%), conic-gradient(#8b5cf6 ${((credit.creditScore - 300) / 600) * 270}deg, #dbeafe 0 270deg, transparent 0)` }}><CircleDollarSign className="text-moss" size={42} /></div>
          </div>
        </article>
        <Metric icon={ReceiptText} label="Sales" value={money.format(sales)} note={`${credit.transactionCount} total transactions`} />
        <Metric icon={ArrowDownLeft} label="Purchases" value={money.format(purchases)} />
        <Metric icon={ArrowUpRight} label="Net cash flow" value={money.format(credit.netCashFlow)} note={credit.netCashFlow > 0 ? "Positive · Healthy" : "Needs attention"} />
        <Metric icon={HandCoins} label="Active loans" value={String(activeLoans)} />
        <Metric icon={Truck} label="Shipments in transit" value={String(inTransit)} />
      </section>
    </>
  );
}

function Metric({ icon: Icon, label, value, note }: { icon: React.ElementType; label: string; value: string; note?: string }) {
  return <article className="card p-6"><Icon className="text-moss" /><p className="eyebrow mt-5">{label}</p><strong className="mt-3 block text-4xl font-black">{value}</strong>{note && <p className="mt-2 text-slate-600">{note}</p>}</article>;
}

function TransactionsPage({ state, update }: { state: AppState; update: (mutator: (current: AppState) => Promise<AppState> | AppState) => void }) {
  const [form, setForm] = useState({ type: "sale" as TransactionType, counterparty: "", amount: "", category: "", date: today() });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const tx: Transaction = { id: crypto.randomUUID(), type: form.type, counterparty: form.counterparty, amount: Number(form.amount), category: form.category, date: form.date };
    update(async (current) => ({ ...current, transactions: [tx, ...current.transactions], blocks: [...current.blocks, await createBlock(current.blocks, "transaction_created", tx)] }));
    setForm({ type: "sale", counterparty: "", amount: "", category: "", date: today() });
  }
  return (
    <>
      <Header eyebrow="Ledger entries" title="Transactions" subtitle="Add sales, purchases, and expenses. Every transaction creates a blockchain block." />
      <form onSubmit={submit} className="card mb-6 grid gap-4 p-5 md:grid-cols-5">
        <label className="field"><span>Type</span><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}><option>sale</option><option>purchase</option><option>expense</option></select></label>
        <label className="field"><span>Counterparty</span><input value={form.counterparty} onChange={(e) => setForm({ ...form, counterparty: e.target.value })} required /></label>
        <label className="field"><span>Amount</span><input type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></label>
        <label className="field"><span>Category</span><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></label>
        <label className="field"><span>Date</span><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
        <button className="btn-primary md:col-span-5" type="submit"><Plus size={18} /> Add transaction</button>
      </form>
      <DataTable rows={state.transactions.map((tx) => [tx.date, tx.type, tx.counterparty, money.format(tx.amount), tx.category, `#${state.blocks.find((b) => b.payload.id === tx.id)?.index ?? "minted"}`])} headers={["Date", "Type", "Counterparty", "Amount", "Category", "Block"]} />
    </>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: Array<Array<string | number>> }) {
  return <section className="card overflow-x-auto"><table className="w-full min-w-[850px] border-collapse"><thead><tr>{headers.map((h) => <th className="border-b border-line bg-wheat p-4 text-left text-xs uppercase tracking-[0.28em] text-slate-600" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td className="border-b border-line p-4 text-lg" key={`${i}-${j}`}>{cell}</td>)}</tr>)}</tbody></table></section>;
}

function LedgerPage({ state, valid }: { state: AppState; valid: boolean }) {
  return (
    <>
      <Header eyebrow="Immutable record" title="Blockchain Ledger" subtitle="Each block contains index, timestamp, event type, payload, previous hash, and current hash." action={<span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-bold ${valid ? "border-violet-200 bg-violet-50 text-forest" : "border-red-200 bg-red-50 text-rust"}`}>{valid ? <CheckCircle2 size={18} /> : <XCircle size={18} />} {valid ? "Chain verified" : "Chain invalid"}</span>} />
      <section className="grid gap-5">
        {state.blocks.map((block) => <article className="card p-5" key={block.id}><div className="flex flex-wrap justify-between gap-3"><div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-wheat px-4 py-2 font-bold">#{block.index}</span><span>{new Date(block.timestamp).toLocaleString()}</span><span className="rounded-full border border-line px-4 py-2 font-bold">{block.eventType}</span></div><code className="flex items-center gap-2 text-slate-600"><LinkIcon size={16} /> prev: {shortHash(block.previousHash)}</code></div><div className="mt-5 grid gap-4 xl:grid-cols-2"><div><p className="eyebrow">Current hash</p><code className="mt-2 block break-all">{block.currentHash}</code></div><div><p className="eyebrow">Payload</p><pre className="mt-2 overflow-auto rounded-xl bg-wheat p-4 text-sm">{JSON.stringify(block.payload, null, 2)}</pre></div></div></article>)}
      </section>
    </>
  );
}

function CreditPage({ credit }: { credit: ReturnType<typeof calculateCreditScore> }) {
  const factors = [
    ["Transaction volume", credit.factors.transactionVolumeScore, 180],
    ["Transaction count", credit.factors.transactionCountScore, 120],
    ["Active months", credit.factors.activeMonthsScore, 100],
    ["Cash flow", credit.factors.cashFlowScore, 150],
    ["Repayment history", credit.factors.repaymentScore, 150],
    ["Default penalty", credit.factors.defaultPenalty, 160]
  ];
  return (
    <>
      <Header eyebrow="Earned, not inherited" title="Credit score" subtitle="Base 300, max 900. The score follows the exact methodology requested and updates from local ledger activity." />
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <article className="card grid place-items-center p-8 text-center"><p className="eyebrow">Your score</p><strong className="mt-4 text-8xl font-black">{credit.creditScore}</strong><span className="mt-2 text-2xl font-bold text-forest">{credit.tier}</span><p className="mt-5 text-slate-600">Tiers: 300-549 Poor, 550-649 Fair, 650-749 Good, 750-849 Excellent, 850-900 Elite.</p></article>
        <article className="card p-6"><p className="eyebrow">Score factors</p>{factors.map(([label, value, max]) => <div className="mt-5" key={label as string}><div className="flex justify-between gap-4"><span className="font-semibold">{label}</span><strong>{Math.round(value as number)}</strong></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-wheat"><span className={(label === "Default penalty" ? "bg-rust" : "bg-moss") + " block h-full rounded-full"} style={{ width: `${Math.min(((value as number) / (max as number)) * 100, 100)}%` }} /></div></div>)}</article>
      </section>
    </>
  );
}

function LoansPage({ state, credit, update }: { state: AppState; credit: ReturnType<typeof calculateCreditScore>; update: (mutator: (current: AppState) => Promise<AppState> | AppState) => void }) {
  const [amount, setAmount] = useState("");
  const [repay, setRepay] = useState("");
  const [bankId, setBankId] = useState(partnerBanks[0].id);
  const monthly = credit.netCashFlow / Math.max(credit.activeMonths, 1);
  const limit = loanLimit(credit.creditScore, monthly);
  const selectedBank = partnerBanks.find((bank) => bank.id === bankId) ?? partnerBanks[0];
  async function requestLoan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requested = Number(amount);
    const loan: Loan = { id: crypto.randomUUID(), bankId: selectedBank.id, bankName: selectedBank.name, amount: requested, approvedAmount: Math.min(requested, limit.limit, selectedBank.maxTicket), interestRate: selectedBank.interestRate, termMonths: 12, repaid: 0, status: "pending", requestedAt: new Date().toISOString() };
    update(async (current) => ({ ...current, loans: [loan, ...current.loans], blocks: [...current.blocks, await createBlock(current.blocks, "loan_requested", loan)] }));
    setAmount("");
  }
  async function repayLoan(id: string) {
    const paid = Number(repay);
    if (!paid) return;
    update(async (current) => {
      const loans = current.loans.map((loan) => loan.id === id ? { ...loan, repaid: loan.repaid + paid, status: loan.repaid + paid >= loan.approvedAmount ? "repaid" as const : "partially_repaid" as const } : loan);
      return { ...current, loans, blocks: [...current.blocks, await createBlock(current.blocks, "loan_repayment", { loanId: id, amount: paid })] };
    });
    setRepay("");
  }
  return (
    <>
      <Header eyebrow="Micro-loans" title="Borrow on your chain" subtitle="Choose a partner bank, compare eligibility, and request working capital. Repayments update your page and the bank dashboard." />
      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        {partnerBanks.map((bank) => {
          const eligible = credit.creditScore >= bank.minScore;
          return (
            <button className={`bank-choice-card ${bankId === bank.id ? "bank-choice-card-active" : ""}`} key={bank.id} onClick={() => setBankId(bank.id)} type="button">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <strong>{bank.name}</strong>
                  <span>{bank.city} · {bank.processingTime}</span>
                </div>
                <ShieldCheck className={eligible ? "text-moss" : "text-rust"} />
              </div>
              <p>{bank.focus}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <small>Min score <b>{bank.minScore}</b></small>
                <small>Rate <b>{bank.interestRate}%</b></small>
                <small>Max <b>{money.format(bank.maxTicket)}</b></small>
              </div>
            </button>
          );
        })}
      </section>
      <form onSubmit={requestLoan} className="card mb-6 grid gap-4 p-5 md:grid-cols-[1fr_auto]"><label className="field"><span>Requested amount from {selectedBank.name}</span><input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required /></label><button className="btn-primary self-end" type="submit"><Plus size={18} /> Request loan</button><p className="text-slate-600 md:col-span-2">Policy limit: {limit.approved ? money.format(Math.min(limit.limit, selectedBank.maxTicket)) : "Rejected below 550 score"} · Your score {credit.creditScore} · {selectedBank.name} minimum {selectedBank.minScore}</p></form>
      <section className="grid gap-5">{state.loans.map((loan) => {
        const canRepay = ["approved", "active", "partially_repaid"].includes(loan.status) && loan.approvedAmount > 0;
        return <article className="card p-5" key={loan.id}><div className="flex flex-wrap justify-between gap-4"><div><span className="rounded-full bg-wheat px-4 py-2 font-bold">{loan.status}</span><h2 className="mt-4 text-3xl font-black">{money.format(loan.amount)} · {loan.termMonths} months</h2><p className="text-slate-600">{loan.bankName ?? "Partner Bank"} · Bank decision: {loan.status} · Approved {money.format(loan.approvedAmount)} · {loan.interestRate}% interest · Repaid {money.format(loan.repaid)}</p></div>{canRepay && <div className="flex gap-2"><input className="rounded-xl border border-line px-4" placeholder="Repayment" value={repay} onChange={(e) => setRepay(e.target.value)} /><button className="btn-primary" onClick={() => repayLoan(loan.id)}>Repay</button></div>}</div></article>;
      })}</section>
    </>
  );
}

function SupplyPage({ state, update }: { state: AppState; update: (mutator: (current: AppState) => Promise<AppState> | AppState) => void }) {
  const [supplier, setSupplier] = useState({ name: "", city: "", category: "" });
  const [po, setPo] = useState({ supplierId: state.suppliers[0]?.id ?? "", amount: "", items: "" });
  async function addSupplier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Supplier = { id: crypto.randomUUID(), ...supplier };
    update(async (current) => ({ ...current, suppliers: [next, ...current.suppliers], blocks: [...current.blocks, await createBlock(current.blocks, "supplier_created", next)] }));
    setSupplier({ name: "", city: "", category: "" });
  }
  async function addPo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const sup = state.suppliers.find((item) => item.id === po.supplierId) ?? state.suppliers[0];
    const order: PurchaseOrder = { id: crypto.randomUUID(), supplierId: sup.id, supplierName: sup.name, amount: Number(po.amount), items: po.items, status: "created", createdAt: new Date().toISOString(), events: [{ id: crypto.randomUUID(), status: "created", location: sup.city, note: "PO generated", timestamp: new Date().toISOString() }] };
    update(async (current) => ({ ...current, purchaseOrders: [order, ...current.purchaseOrders], blocks: [...current.blocks, await createBlock(current.blocks, "purchase_order_created", order)] }));
    setPo({ supplierId: state.suppliers[0]?.id ?? "", amount: "", items: "" });
  }
  async function advance(order: PurchaseOrder) {
    const statuses: ShipmentStatus[] = ["created", "dispatched", "in_transit", "delivered"];
    const status = statuses[Math.min(statuses.indexOf(order.status) + 1, statuses.length - 1)];
    const event = { id: crypto.randomUUID(), status, location: status === "delivered" ? "Shop shelf" : "Transit hub", note: "Shipment status recorded", timestamp: new Date().toISOString() };
    update(async (current) => {
      const purchaseOrders = current.purchaseOrders.map((item) => item.id === order.id ? { ...item, status, events: [...item.events, event] } : item);
      return { ...current, purchaseOrders, blocks: [...current.blocks, await createBlock(current.blocks, "shipment_updated", { purchaseOrderId: order.id, ...event })] };
    });
  }
  return (
    <>
      <Header eyebrow="Supply chain" title="From supplier to shelf." subtitle="Add suppliers, create purchase orders, and mint every shipment update." />
      <section className="grid gap-5 xl:grid-cols-2">
        <form onSubmit={addSupplier} className="card grid gap-4 p-5"><h2 className="text-2xl font-black">Add supplier</h2><label className="field"><span>Name</span><input value={supplier.name} onChange={(e) => setSupplier({ ...supplier, name: e.target.value })} required /></label><label className="field"><span>City</span><input value={supplier.city} onChange={(e) => setSupplier({ ...supplier, city: e.target.value })} required /></label><label className="field"><span>Category</span><input value={supplier.category} onChange={(e) => setSupplier({ ...supplier, category: e.target.value })} required /></label><button className="btn-primary"><Plus size={18} /> Supplier</button></form>
        <form onSubmit={addPo} className="card grid gap-4 p-5"><h2 className="text-2xl font-black">Create purchase order</h2><label className="field"><span>Supplier</span><select value={po.supplierId} onChange={(e) => setPo({ ...po, supplierId: e.target.value })}>{state.suppliers.map((sup) => <option value={sup.id} key={sup.id}>{sup.name}</option>)}</select></label><label className="field"><span>Amount</span><input type="number" value={po.amount} onChange={(e) => setPo({ ...po, amount: e.target.value })} required /></label><label className="field"><span>Items</span><input value={po.items} onChange={(e) => setPo({ ...po, items: e.target.value })} required /></label><button className="btn-primary"><PackagePlus size={18} /> Purchase order</button></form>
      </section>
      <section className="mt-6 grid gap-5">{state.purchaseOrders.map((order) => <article className="card p-5" key={order.id}><div className="flex flex-wrap justify-between gap-4"><div><h2 className="text-2xl font-black">{order.supplierName} <span className="rounded-full bg-wheat px-3 py-1 text-sm">{order.status}</span></h2><p className="text-slate-600">{money.format(order.amount)} · {order.items}</p></div><button className="btn-ghost" onClick={() => advance(order)}><Truck size={18} /> Update shipment</button></div><ol className="mt-5 grid gap-3">{order.events.map((event) => <li className="rounded-xl bg-wheat p-3" key={event.id}><strong>{event.status}</strong> @ {event.location}<p className="text-sm text-slate-600">{new Date(event.timestamp).toLocaleString()} · {event.note}</p></li>)}</ol></article>)}</section>
    </>
  );
}

function AIPage({ state }: { state: AppState }) {
  const [prompt, setPrompt] = useState("Give me a credit improvement plan and supply chain insights based on my business data.");
  const [cards, setCards] = useState<InsightCard[]>([]);
  return (
    <>
      <Header eyebrow="AI advisor" title="Ask the ledger." subtitle="Generate deterministic local insights without an API key." />
      <section className="card p-5"><label className="field"><span>Your prompt</span><textarea rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} /></label><button className="btn-primary mt-4" onClick={() => setCards(generateInsights(state, prompt))}><BrainCircuit size={18} /> Generate insights</button></section>
      <section className="mt-6 grid gap-5 md:grid-cols-2">{cards.map((card) => <article className="card p-5" key={card.title}><Sparkles className="text-moss" /><h2 className="mt-3 text-2xl font-black">{card.title}</h2><p className="mt-2 leading-7 text-slate-600">{card.body}</p></article>)}</section>
    </>
  );
}
