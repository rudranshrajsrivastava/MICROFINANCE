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
        <div className="card interactive-card card-3d relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/0 via-white/50 to-white/0 opacity-60 animate-shine" />
          <div className="hero-map-banner border-b border-line">
            <svg className="hero-india-map" viewBox="0 0 430 520" role="img" aria-label="India outline with MSME Saathi logo">
              <path d="M170 9 154 17 148 33 159 45 152 60 131 62 121 75 128 96 115 106 91 112 84 129 64 139 72 157 54 174 68 190 56 207 38 208 31 229 47 240 33 252 45 265 70 262 80 276 70 289 82 304 75 320 84 336 85 358 96 375 101 401 117 421 126 452 145 485 164 504 181 499 196 464 206 427 225 402 253 388 275 359 300 343 315 320 339 309 336 284 354 265 347 245 361 219 346 199 322 194 306 176 283 172 269 154 249 159 233 140 210 136 203 112 186 104 191 84 181 67 198 55 194 38 211 29 197 14Z" />
              <path d="M168 9 188 2 210 17 229 14 246 31 237 48 215 44 198 55 181 67 159 45 148 33Z" />
              <path d="M316 176 345 156 371 126 401 131 409 154 393 171 413 184 396 205 365 211 346 199 322 194Z" />
              <path className="map-connector" d="M300 177 316 176" />
              <circle cx="82" cy="429" r="2.4" />
              <circle cx="91" cy="446" r="2.1" />
              <circle cx="346" cy="389" r="2.3" />
              <circle cx="351" cy="407" r="2.1" />
              <circle cx="357" cy="427" r="2" />
              <circle cx="363" cy="450" r="1.9" />
              <circle cx="368" cy="474" r="1.8" />
            </svg>
            <div className="hero-map-logo">
              <Image src="/msme-saathi-logo.png" alt="MSME Saathi logo" width={150} height={110} />
            </div>
          </div>
          <div className="grid gap-4 p-6">
            <div className="rounded-2xl bg-white p-5 shadow-soft">
              <p className="eyebrow">Credit score</p>
              <div className="mt-2 flex items-end justify-between">
                <strong className="text-6xl font-black">815</strong>
                <span className="rounded-full bg-violet-50 px-4 py-2 font-bold text-forest">Excellent</span>
              </div>
            </div>
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl border border-line bg-panel p-4 transition hover:translate-x-1 hover:border-moss">
                <span className="flex items-center gap-2 font-bold"><Boxes size={18} /> Block #{item + 28}</span>
                <code className="text-sm text-slate-600">31bbc423...1a4703</code>
              </div>
            ))}
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
