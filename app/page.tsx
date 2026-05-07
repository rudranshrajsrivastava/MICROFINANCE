import Link from "next/link";
import { BadgeCheck, Boxes, BrainCircuit, ChevronRight, CircleDollarSign, HandCoins, MapPin, ReceiptText, ShieldCheck, Sparkles, TrendingUp, Truck, Zap } from "lucide-react";
import { Brand } from "@/components/brand";

const features = [
  { icon: ReceiptText, title: "Ledger", tone: "bg-mint", body: "Record every sale, purchase, expense, and repayment as a verifiable business event." },
  { icon: ShieldCheck, title: "Credit scoring", tone: "bg-skyglass", body: "Use transparent on-chain behavior instead of collateral-heavy paperwork." },
  { icon: HandCoins, title: "Loans", tone: "bg-roseglass", body: "Auto-approve working-capital requests from the current score and monthly cash flow." },
  { icon: Truck, title: "Supply chain", tone: "bg-amber/25", body: "Track suppliers, purchase orders, and shipment milestones from creation to delivery." },
  { icon: BrainCircuit, title: "AI insights", tone: "bg-white", body: "Generate deterministic local recommendations with no API key required." }
];

const msmeRegions = [
  { region: "North", city: "Delhi NCR", growth: "+18%", x: "42%", y: "24%", size: "h-5 w-5" },
  { region: "West", city: "Ahmedabad", growth: "+22%", x: "28%", y: "46%", size: "h-6 w-6" },
  { region: "West Coast", city: "Mumbai-Pune", growth: "+26%", x: "34%", y: "58%", size: "h-7 w-7" },
  { region: "South", city: "Bengaluru", growth: "+31%", x: "48%", y: "74%", size: "h-7 w-7" },
  { region: "South", city: "Chennai", growth: "+19%", x: "58%", y: "78%", size: "h-5 w-5" },
  { region: "East", city: "Kolkata", growth: "+16%", x: "72%", y: "49%", size: "h-5 w-5" },
  { region: "Central", city: "Indore-Bhopal", growth: "+21%", x: "48%", y: "48%", size: "h-6 w-6" },
  { region: "Deccan", city: "Hyderabad", growth: "+24%", x: "52%", y: "62%", size: "h-6 w-6" },
  { region: "Northwest", city: "Jaipur", growth: "+17%", x: "35%", y: "35%", size: "h-5 w-5" },
  { region: "Northeast", city: "Guwahati", growth: "+14%", x: "84%", y: "37%", size: "h-4 w-4" }
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
            msmeSaathi is a full-stack-ready fintech app where businesses can sign up, record transactions, mint private SHA-256 blocks, calculate credit scores, request loans, and manage shipments.
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
          <div className="border-b border-line bg-gradient-to-r from-mint via-wheat to-saffron/40 p-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-moss/30 bg-white px-4 py-2 font-bold text-forest">
              <BadgeCheck size={18} /> Chain verified
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

        <div className="card map-card-3d overflow-hidden p-7">
          <div className="mb-5 flex items-center gap-3">
            <MapPin className="text-moss" />
            <div>
              <p className="eyebrow">India MSME growth</p>
              <h2 className="text-3xl font-black">Regional demand map</h2>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <div className="india-map-stage">
              <svg className="india-map-outline" viewBox="0 0 320 380" role="img" aria-label="Stylized map of India">
                <path d="M126 18 98 42l4 35-28 16 14 33-32 28 18 38-26 36 35 25-5 47 42 10 24 50 32-39 39 33 18-52 43-22-20-40 27-34-31-25 18-48-48-12-14-40-41-6-21-33Z" />
              </svg>
              {msmeRegions.map((region, index) => (
                <div
                  className="map-dot-wrap"
                  key={region.city}
                  style={{ left: region.x, top: region.y, animationDelay: `${index * 160}ms` }}
                >
                  <span className={`map-dot ${region.size}`} />
                  <span className="map-dot-label">{region.growth}</span>
                </div>
              ))}
            </div>
            <div className="grid content-center gap-3">
              {msmeRegions.slice(0, 6).map((region) => (
                <div className="flex items-center justify-between rounded-2xl border border-line bg-white/75 p-3 shadow-soft" key={region.city}>
                  <div>
                    <strong className="block">{region.city}</strong>
                    <span className="text-sm text-slate-600">{region.region} cluster</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 font-black text-forest">
                    <TrendingUp size={15} /> {region.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
