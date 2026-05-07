import Link from "next/link";
import Image from "next/image";
import { Boxes, BrainCircuit, ChevronRight, CircleDollarSign, HandCoins, HelpCircle, ReceiptText, ShieldCheck, Sparkles, Truck, Zap } from "lucide-react";
import { Brand } from "@/components/brand";

const features = [
  { icon: ReceiptText, title: "Ledger", tone: "bg-mint", body: "Record every sale, purchase, expense, and repayment as a verifiable business event." },
  { icon: ShieldCheck, title: "Credit scoring", tone: "bg-skyglass", body: "Use transparent on-chain behavior instead of collateral-heavy paperwork." },
  { icon: HandCoins, title: "Loans", tone: "bg-roseglass", body: "Auto-approve working-capital requests from the current score and monthly cash flow." },
  { icon: Truck, title: "Supply chain", tone: "bg-amber/25", body: "Track suppliers, purchase orders, and shipment milestones from creation to delivery." },
  { icon: BrainCircuit, title: "AI insights", tone: "bg-white", body: "Generate deterministic local recommendations with no API key required." }
];

const faqs = [
  {
    question: "What can I do on MSME Saathi?",
    answer: "You can create a business profile, record transactions, view a private blockchain ledger, calculate credit score, request loans, track purchase orders, and generate local AI-style insights."
  },
  {
    question: "Does every action create a block?",
    answer: "Important business events such as transactions, loan requests, repayments, suppliers, purchase orders, and shipment updates are added as SHA-256 linked blocks."
  },
  {
    question: "How does loan approval work?",
    answer: "Loan readiness is based on the credit score and monthly net cash flow. Higher score bands unlock higher working-capital limits."
  },
  {
    question: "What is the AI Insights page?",
    answer: "It generates deterministic local recommendations for credit improvement, supply chain risks, working capital, and loan readiness without needing an API key."
  }
];

const cityGrowth = [
  { city: "Bengaluru", segment: "Digital services", growth: 31, value: "INR 8.2L" },
  { city: "Mumbai-Pune", segment: "Manufacturing", growth: 26, value: "INR 7.6L" },
  { city: "Hyderabad", segment: "Retail supply", growth: 24, value: "INR 6.9L" },
  { city: "Ahmedabad", segment: "Textiles", growth: 22, value: "INR 6.4L" },
  { city: "Delhi NCR", segment: "Trade finance", growth: 18, value: "INR 5.8L" }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Brand />
        <div className="hidden items-center gap-3 sm:flex">
          <Link className="btn-ghost" href="/sign-in">Sign In</Link>
          <Link className="btn-primary" href="/sign-up">Sign Up</Link>
        </div>
      </nav>

      <section className="relative mx-auto grid min-h-[calc(100vh-160px)] max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="absolute -right-28 top-10 h-72 w-72 rounded-full bg-mint/70 blur-3xl" />
        <div className="absolute -left-32 bottom-16 h-72 w-72 rounded-full bg-saffron/30 blur-3xl" />
        <div>
          <p className="eyebrow inline-flex rounded-full border border-moss/20 bg-white/70 px-4 py-2">Private blockchain for MSME finance</p>
          <h1 className="motion-headline mt-4 max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-ink md:text-7xl">
            <span>Credit, loans, and</span>
            <span className="moving-3d-text">supply chain proof</span>
            <span>on one verified ledger.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
            MSME Saathi is a full-stack-ready fintech app where businesses can sign up, record transactions, mint private SHA-256 blocks, calculate credit scores, request loans, and manage shipments.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary min-h-14 px-6 text-lg" href="/sign-up">Start free <ChevronRight size={20} /></Link>
            <Link className="btn-ghost min-h-14 px-6 text-lg" href="/sign-in">Sign In</Link>
            <Link className="btn-ghost min-h-14 px-6 text-lg" href="/dashboard">Dashboard</Link>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {["30 blocks", "INR 4.4L cash flow", "815 score"].map((item) => (
              <div className="glass-band rounded-2xl p-3 text-center text-sm font-black text-forest" key={item}>{item}</div>
            ))}
          </div>
        </div>

        <div className="hero-3d-stage">
          <div className="floating-cube cube-one"><Boxes size={28} /></div>
          <div className="floating-cube cube-two"><HandCoins size={28} /></div>
          <div className="floating-cube cube-three"><Sparkles size={26} /></div>
        <div className="card interactive-card card-3d hero-growth-card relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/0 via-white/50 to-white/0 opacity-60 animate-shine" />
          <div className="hero-growth-panel">
            <div className="hero-growth-logo">
              <Image src="/msme-saathi-logo.png" alt="MSME Saathi logo" width={150} height={110} />
            </div>
            <div className="hero-growth-header">
              <p className="eyebrow">City growth pulse</p>
              <h2>MSME growth across active clusters</h2>
            </div>
            <div className="city-growth-list">
              {cityGrowth.map((item) => (
                <div className="city-growth-row" key={item.city}>
                  <div>
                    <strong>{item.city}</strong>
                    <span>{item.segment}</span>
                  </div>
                  <div className="city-growth-meter" aria-label={`${item.city} growth ${item.growth}%`}>
                    <span style={{ width: `${item.growth * 2.4}%` }} />
                  </div>
                  <b>+{item.growth}%</b>
                </div>
              ))}
            </div>
            <div className="hero-growth-summary">
              <span><strong>5</strong> city clusters</span>
              <span><strong>24%</strong> avg growth</span>
              <span><strong>INR 34.9L</strong> tracked flow</span>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="moving-ribbon mx-auto mb-12 max-w-7xl px-6" aria-label="Platform capabilities">
        <div className="ribbon-track rounded-3xl border border-line bg-white/70 py-4 shadow-soft backdrop-blur-xl">
          <div className="ribbon-content">
            {["Ledger proof", "Credit scoring", "Auto loan readiness", "Supply tracking", "AI insights", "SHA-256 blocks"].map((item) => (
              <span key={item}>{item}</span>
            ))}
            {["Ledger proof", "Credit scoring", "Auto loan readiness", "Supply tracking", "AI insights", "SHA-256 blocks"].map((item) => (
              <span key={`${item}-copy`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-12 md:grid-cols-5">
        {features.map(({ icon: Icon, title, tone, body }) => (
          <article className="card interactive-card card-3d p-5" key={title}>
            <div className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
              <Icon className="text-forest" />
            </div>
            <h2 className="mt-4 text-xl font-black">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="card interactive-card card-3d bg-gradient-to-br from-forest to-moss p-7 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">How it moves</p>
          <h2 className="mt-3 text-4xl font-black">Interactive business flow</h2>
          <div className="mt-8 grid gap-4">
            {[
              { icon: ReceiptText, label: "Add a transaction" },
              { icon: Boxes, label: "Mint a SHA-256 block" },
              { icon: CircleDollarSign, label: "Update credit score" },
              { icon: Zap, label: "Unlock loan readiness" }
            ].map(({ icon: Icon, label }, index) => (
              <div className="flex items-center gap-4 rounded-2xl bg-white/12 p-4 transition hover:bg-white/20" key={label}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-forest"><Icon size={20} /></span>
                <strong>{index + 1}. {label}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card faq-card-3d p-7">
          <div className="mb-5 flex items-center gap-3">
            <HelpCircle className="text-moss" />
            <div>
              <p className="eyebrow">FAQ</p>
              <h2 className="text-3xl font-black">Know the site</h2>
            </div>
          </div>
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <details className="faq-item group" key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <ChevronRight className="shrink-0 transition group-open:rotate-90" size={20} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
