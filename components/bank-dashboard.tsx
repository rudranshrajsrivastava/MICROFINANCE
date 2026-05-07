"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BadgeCheck, Boxes, CheckCircle2, HandCoins, Landmark, Link as LinkIcon, LogOut, ShieldAlert, XCircle } from "lucide-react";
import { Brand } from "./brand";
import { createBlock, shortHash, verifyChain } from "@/lib/blockchain";
import { calculateCreditScore, loanLimit } from "@/lib/credit-score";
import { initialState, loadState, saveState } from "@/lib/storage";
import type { AppState, Loan, LoanStatus } from "@/lib/types";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

type BankSession = {
  bankName: string;
  email: string;
  branchCity: string;
  lenderCode: string;
};

export function BankDashboard() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(initialState);
  const [bank] = useState<BankSession | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("msme-saathi-bank-session");
    return raw ? JSON.parse(raw) as BankSession : null;
  });
  const [valid, setValid] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function hydrate() {
      const current = loadState();
      if (current.blocks.length === 0) {
        let blocks = current.blocks;
        blocks = [...blocks, await createBlock(blocks, "genesis", { userId: current.user?.id ?? "demo", businessName: current.user?.businessName ?? "MSME" })];
        for (const loan of current.loans) blocks = [...blocks, await createBlock(blocks, "loan_requested", loan)];
        setState({ ...current, blocks });
      } else {
        setState(current);
      }
      setLoaded(true);
    }
    hydrate();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    verifyChain(state.blocks).then(setValid);
    saveState(state);
  }, [state, loaded]);

  const credit = useMemo(() => calculateCreditScore(state.transactions, state.loans), [state.transactions, state.loans]);
  const monthly = credit.netCashFlow / Math.max(credit.activeMonths, 1);
  const policy = loanLimit(credit.creditScore, monthly);
  const loanBlocks = state.blocks.filter((block) => block.eventType.includes("loan") || block.eventType.includes("bank"));

  function logout() {
    localStorage.removeItem("msme-saathi-bank-session");
    router.push("/");
  }

  async function decide(loan: Loan, status: LoanStatus) {
    const nextLoan = {
      ...loan,
      status,
      approvedAmount: status === "rejected" ? 0 : Math.min(loan.amount, policy.limit),
      interestRate: credit.creditScore >= 750 ? 10 : credit.creditScore >= 650 ? 14 : 18
    };
    const payload = {
      loanId: loan.id,
      bankName: bank?.bankName ?? "Partner Bank",
      lenderCode: bank?.lenderCode ?? "BANK",
      decision: status,
      approvedAmount: nextLoan.approvedAmount,
      creditScore: credit.creditScore,
      policyLimit: policy.limit
    };
    const block = await createBlock(state.blocks, "bank_loan_decision", payload);
    setState((current) => ({
      ...current,
      loans: current.loans.map((item) => item.id === loan.id ? nextLoan : item),
      blocks: [...current.blocks, block]
    }));
  }

  return (
    <main className="min-h-screen px-5 py-6 lg:px-10">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Brand />
        <div className="flex flex-wrap items-center gap-3">
          <Link className="btn-ghost" href="/user">User page</Link>
          <button className="btn-ghost" onClick={logout}><LogOut size={18} /> Logout</button>
        </div>
      </nav>

      <section className="bank-hero mx-auto mt-8 max-w-7xl p-7">
        <div>
          <p className="eyebrow">Bank lending console</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">Loan requests, verified on-chain.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Banks can review MSME requests, inspect credit score and cash flow, verify the ledger, then approve, reject, or activate funding from one desk.
          </p>
        </div>
        <div className="bank-id-card">
          <Landmark className="text-forest" size={34} />
          <strong>{bank?.bankName ?? "Partner Bank"}</strong>
          <span>{bank?.branchCity ?? "Mumbai"} branch</span>
          <small>{bank?.lenderCode ?? "BANK-001"}</small>
        </div>
      </section>

      <section className="mx-auto mt-6 grid max-w-7xl gap-5 lg:grid-cols-4">
        <BankMetric icon={ArrowUpRight} label="Credit score" value={String(credit.creditScore)} note={credit.tier} />
        <BankMetric icon={HandCoins} label="Policy limit" value={policy.approved ? money.format(policy.limit) : "Rejected"} note={`${policy.multiplier}x monthly cash flow`} />
        <BankMetric icon={Boxes} label="Loan blocks" value={String(loanBlocks.length)} note={valid ? "Verified chain" : "Invalid chain"} />
        <BankMetric icon={BadgeCheck} label="Net cash flow" value={money.format(credit.netCashFlow)} note={`${credit.activeMonths} active months`} />
      </section>

      <section className="mx-auto mt-6 grid max-w-7xl gap-4 md:grid-cols-3">
        <article className="bank-feature-card">
          <HandCoins />
          <strong>Request review</strong>
          <span>See every MSME loan request with requested amount, current status, and linked business profile.</span>
        </article>
        <article className="bank-feature-card">
          <ArrowUpRight />
          <strong>Eligibility check</strong>
          <span>Use live credit score, monthly cash flow, and policy multiplier to judge approval readiness.</span>
        </article>
        <article className="bank-feature-card">
          <Boxes />
          <strong>Chain proof</strong>
          <span>Inspect loan blocks, bank decisions, previous hashes, and tamper verification before funding.</span>
        </article>
      </section>

      <section className="mx-auto mt-6 grid max-w-7xl gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="card p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Requests by user</p>
              <h2 className="mt-2 text-3xl font-black">On-chain loan desk</h2>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${valid ? "bg-violet-50 text-forest" : "bg-red-50 text-rust"}`}>
              {valid ? <CheckCircle2 size={17} /> : <XCircle size={17} />} {valid ? "Chain verified" : "Invalid chain"}
            </span>
          </div>
          <div className="grid gap-4">
            {state.loans.map((loan) => (
              <article className="bank-loan-row" key={loan.id}>
                <div>
                  <span className="rounded-full bg-wheat px-3 py-1 text-sm font-black">{loan.status}</span>
                  <h3 className="mt-3 text-2xl font-black">{money.format(loan.amount)} requested</h3>
                  <p className="text-slate-600">
                    {state.user?.businessName ?? "MSME"} · score {credit.creditScore} · eligible up to {policy.approved ? money.format(policy.limit) : "not eligible"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-primary" onClick={() => decide(loan, "approved")}>Approve</button>
                  <button className="btn-ghost" onClick={() => decide(loan, "active")}>Provide loan</button>
                  <button className="btn-ghost" onClick={() => decide(loan, "rejected")}><ShieldAlert size={18} /> Reject</button>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="card p-6">
          <p className="eyebrow">Loan chain trail</p>
          <h2 className="mt-2 text-3xl font-black">Decision history</h2>
          <div className="mt-5 grid max-h-[520px] gap-3 overflow-auto pr-2">
            {loanBlocks.slice().reverse().map((block) => (
              <div className="rounded-2xl border border-line bg-white/70 p-4" key={block.id}>
                <div className="flex items-center justify-between gap-3">
                  <strong>#{block.index} · {block.eventType}</strong>
                  <code className="text-xs text-slate-500"><LinkIcon size={13} className="inline" /> {shortHash(block.currentHash)}</code>
                </div>
                <pre className="mt-3 overflow-auto rounded-xl bg-wheat p-3 text-xs">{JSON.stringify(block.payload, null, 2)}</pre>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

function BankMetric({ icon: Icon, label, value, note }: { icon: React.ElementType; label: string; value: string; note: string }) {
  return (
    <article className="card interactive-card p-5">
      <Icon className="text-moss" />
      <p className="eyebrow mt-4">{label}</p>
      <strong className="mt-2 block text-3xl font-black">{value}</strong>
      <span className="text-sm text-slate-600">{note}</span>
    </article>
  );
}
