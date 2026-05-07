import Link from "next/link";
import { BadgeCheck, Boxes, BrainCircuit, ChevronRight, HandCoins, ReceiptText, ShieldCheck, Truck } from "lucide-react";
import { Brand } from "@/components/brand";

const features = [
  { icon: ReceiptText, title: "Ledger", body: "Record every sale, purchase, expense, and repayment as a verifiable business event." },
  { icon: ShieldCheck, title: "Credit scoring", body: "Use transparent on-chain behavior instead of collateral-heavy paperwork." },
  { icon: HandCoins, title: "Loans", body: "Auto-approve working-capital requests from the current score and monthly cash flow." },
  { icon: Truck, title: "Supply chain", body: "Track suppliers, purchase orders, and shipment milestones from creation to delivery." },
  { icon: BrainCircuit, title: "AI insights", body: "Generate deterministic local recommendations with no API key required." }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Brand />
        <div className="hidden items-center gap-3 sm:flex">
          <Link className="btn-ghost" href="/sign-in">Sign In</Link>
          <Link className="btn-primary" href="/sign-up">Sign Up</Link>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-160px)] max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow">Private blockchain for MSME finance</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-ink md:text-7xl">
            Credit, loans, and supply chain proof on one verified ledger.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
            MSME Chain is a full-stack-ready fintech app where businesses can sign up, record transactions, mint private SHA-256 blocks, calculate credit scores, request loans, and manage shipments.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary min-h-14 px-6 text-lg" href="/sign-up">Start free <ChevronRight size={20} /></Link>
            <Link className="btn-ghost min-h-14 px-6 text-lg" href="/sign-in">Sign In</Link>
            <Link className="btn-ghost min-h-14 px-6 text-lg" href="/dashboard">Dashboard</Link>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-line bg-wheat p-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-moss/30 bg-white px-4 py-2 font-bold text-forest">
              <BadgeCheck size={18} /> Chain verified
            </div>
          </div>
          <div className="grid gap-4 p-6">
            <div className="rounded-2xl bg-white p-5">
              <p className="eyebrow">Credit score</p>
              <div className="mt-2 flex items-end justify-between">
                <strong className="text-6xl font-black">815</strong>
                <span className="rounded-full bg-emerald-50 px-4 py-2 font-bold text-forest">Excellent</span>
              </div>
            </div>
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl border border-line bg-panel p-4">
                <span className="flex items-center gap-2 font-bold"><Boxes size={18} /> Block #{item + 28}</span>
                <code className="text-sm text-slate-600">31bbc423...1a4703</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-12 md:grid-cols-5">
        {features.map(({ icon: Icon, title, body }) => (
          <article className="card p-5" key={title}>
            <Icon className="text-moss" />
            <h2 className="mt-4 text-xl font-black">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
