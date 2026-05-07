import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Boxes,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Cpu,
  CreditCard,
  FileText,
  HandCoins,
  Home,
  KeyRound,
  Link as LinkIcon,
  LogOut,
  Menu,
  PackagePlus,
  Plus,
  ReceiptText,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
  UserPlus,
  X
} from "lucide-react";
import "./styles.css";

const rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const today = "2026-05-07";

const initialUser = {
  name: "xyz",
  email: "abcde@gmail.com",
  businessName: "xyz",
  businessType: "retail",
  signedIn: false
};

const seedTransactions = [
  ["2025-12-03", "sale", "Agarwal Textiles", 31500, "retail"],
  ["2025-12-10", "purchase", "North Cotton Co.", 12500, "raw_materials"],
  ["2025-12-18", "sale", "Mishra Stores", 28600, "general"],
  ["2025-12-27", "expense", "Power Utility", 8900, "operations"],
  ["2026-01-04", "sale", "Khan Wholesale", 36920, "retail"],
  ["2026-01-11", "purchase", "Delhi Packaging", 14300, "packaging"],
  ["2026-01-20", "sale", "Verma Garments", 45740, "consulting"],
  ["2026-01-28", "expense", "Workshop Rent", 11800, "rent"],
  ["2026-01-02", "sale", "Sharma Traders", 42000, "retail"],
  ["2026-01-09", "purchase", "Gupta Raw Materials", 18000, "raw_materials"],
  ["2026-01-18", "sale", "Patel Retail", 54000, "consulting"],
  ["2026-01-30", "expense", "Kumar Logistics", 15000, "transport"],
  ["2026-02-06", "sale", "Ahmed Exports", 61250, "raw_materials"],
  ["2026-02-14", "sale", "Reddy Suppliers", 48290, "retail"],
  ["2026-02-21", "purchase", "Gupta Raw Materials", 26400, "raw_materials"],
  ["2026-03-04", "sale", "Patel Retail", 52300, "consulting"],
  ["2026-03-12", "expense", "Delhi Warehouse", 17490, "rent"],
  ["2026-03-20", "sale", "Kumar Logistics", 57202, "consulting"],
  ["2026-03-26", "sale", "Reddy Suppliers", 71431, "retail"],
  ["2026-04-01", "sale", "Sharma Traders", 11250, "raw_materials"],
  ["2026-04-07", "expense", "Patel Retail", 23481, "raw_materials"],
  ["2026-04-13", "purchase", "Ahmed Exports", 10500, "raw_materials"],
  ["2026-04-19", "sale", "Patel Retail", 70678, "consulting"],
  ["2026-04-25", "sale", "Ahmed Exports", 89230, "raw_materials"],
  ["2026-05-07", "sale", "pqrs", 20000, "general"]
].map(([date, type, counterparty, amount, category], index) => ({
  id: crypto.randomUUID?.() || `tx-${index}`,
  date,
  type,
  counterparty,
  amount,
  category
}));

const seedSuppliers = [
  { id: "s1", name: "Gupta Raw Materials", city: "Delhi", rating: 4.8, spend: 35000 },
  { id: "s2", name: "Ahmed Exports", city: "Mumbai", rating: 4.6, spend: 99930 },
  { id: "s3", name: "Reddy Suppliers", city: "Hyderabad", rating: 4.7, spend: 71431 }
];

const seedOrders = [
  {
    id: "po-1",
    supplier: "Gupta Raw Materials",
    amount: 35000,
    items: "Cotton Yarn x100 · Dye x20",
    status: "in_transit",
    tracking: [
      ["Created", "Delhi", "2026-05-04T00:32:19", "PO generated"],
      ["Dispatched", "Delhi Warehouse", "2026-05-05T00:32:19", "Picked up by carrier"],
      ["In_transit", "Agra Hub", "2026-05-06T00:32:19", "Crossed checkpoint"]
    ]
  }
];

const seedLoans = [
  {
    id: "loan-1",
    principal: 200000,
    months: 12,
    interest: 10,
    score: 815,
    repaid: 10000,
    category: "general",
    status: "partially repaid",
    date: today
  }
];

const nav = [
  ["overview", "Overview", Home],
  ["transactions", "Transactions", ReceiptText],
  ["ledger", "Blockchain Ledger", Boxes],
  ["credit", "Credit Score", BarChart3],
  ["loans", "Loans", HandCoins],
  ["supply", "Supply Chain", Truck],
  ["ai", "AI Insights", Sparkles]
];

function shortHash(hash) {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

function formatDate(date) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US");
}

async function sha256(input) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function buildChain(user, transactions, loans, orders) {
  const events = [
    { event: "genesis", user_id: user.id || "a40babfd-c95e-4dfe-9ac4-39628a764ae9" },
    { event: "kyc_registered", business_name: user.businessName, business_type: user.businessType },
    ...transactions.map((tx) => ({ event: "transaction", ...tx })),
    ...loans.map((loan) => ({ event: "loan_recorded", ...loan })),
    ...orders.flatMap((order) => [
      { event: "purchase_order", supplier: order.supplier, amount: order.amount, status: order.status },
      ...order.tracking.map(([step, location, at, note]) => ({
        event: "shipment_update",
        purchase_order: order.id,
        step,
        location,
        at,
        note
      }))
    ])
  ];

  const blocks = [];
  for (const [index, payload] of events.entries()) {
    const previousHash = index === 0 ? "0".repeat(64) : blocks[index - 1].hash;
    const timestamp = index < 2 ? "2026-05-07T00:32:19" : new Date(`${payload.date || today}T00:32:19`).toISOString();
    const hash = await sha256(JSON.stringify({ index, timestamp, previousHash, payload }));
    blocks.push({ index, timestamp, previousHash, payload, hash });
  }
  return blocks;
}

function calculateScore(transactions, loans) {
  const sales = transactions.filter((t) => t.type === "sale").reduce((sum, t) => sum + t.amount, 0);
  const purchases = transactions.filter((t) => t.type !== "sale").reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = sales - purchases;
  const volume = sales + purchases;
  const onTime = loans.reduce((sum, loan) => sum + (loan.repaid > 0 ? 1 : 0), 0);
  const score = Math.min(900, Math.max(300, Math.round(610 + volume / 6200 + netCashFlow / 8500 + onTime * 20)));
  const tier = score >= 780 ? "Excellent" : score >= 700 ? "Strong" : score >= 620 ? "Growing" : "Watchlist";
  return { score, tier, sales, purchases, netCashFlow, volume, eligible: Math.round(score * 522) };
}

function useStoredApp() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("msme-user") || "null") || initialUser);
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem("msme-transactions") || "null") || seedTransactions);
  const [loans, setLoans] = useState(() => JSON.parse(localStorage.getItem("msme-loans") || "null") || seedLoans);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("msme-orders") || "null") || seedOrders);
  const [suppliers, setSuppliers] = useState(() => JSON.parse(localStorage.getItem("msme-suppliers") || "null") || seedSuppliers);

  useEffect(() => localStorage.setItem("msme-user", JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem("msme-transactions", JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem("msme-loans", JSON.stringify(loans)), [loans]);
  useEffect(() => localStorage.setItem("msme-orders", JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem("msme-suppliers", JSON.stringify(suppliers)), [suppliers]);

  return { user, setUser, transactions, setTransactions, loans, setLoans, orders, setOrders, suppliers, setSuppliers };
}

function App() {
  const store = useStoredApp();
  const [view, setView] = useState(store.user.signedIn ? "overview" : "landing");
  const [mobileNav, setMobileNav] = useState(false);
  const [modal, setModal] = useState(null);
  const [chain, setChain] = useState([]);
  const metrics = useMemo(() => calculateScore(store.transactions, store.loans), [store.transactions, store.loans]);

  useEffect(() => {
    buildChain(store.user, store.transactions, store.loans, store.orders).then(setChain);
  }, [store.user, store.transactions, store.loans, store.orders]);

  const actions = {
    signIn(data) {
      store.setUser({ ...store.user, ...data, signedIn: true });
      setView("overview");
    },
    signUp(data) {
      store.setUser({ ...store.user, ...data, id: crypto.randomUUID?.() || `user-${Date.now()}`, signedIn: true });
      setView("overview");
    },
    logout() {
      store.setUser({ ...store.user, signedIn: false });
      setView("landing");
    },
    addTransaction(tx) {
      store.setTransactions([{ id: crypto.randomUUID?.() || `tx-${Date.now()}`, date: today, ...tx }, ...store.transactions]);
      setModal(null);
      setView("transactions");
    },
    addLoan(loan) {
      store.setLoans([{ id: crypto.randomUUID?.() || `loan-${Date.now()}`, date: today, repaid: 0, status: "active", score: metrics.score, ...loan }, ...store.loans]);
      setModal(null);
      setView("loans");
    },
    repay(amount) {
      store.setLoans(store.loans.map((loan, index) => index === 0 ? { ...loan, repaid: loan.repaid + amount, status: loan.repaid + amount >= loan.principal ? "repaid" : "partially repaid" } : loan));
      store.setTransactions([{ id: crypto.randomUUID?.(), date: today, type: "expense", counterparty: "Loan repayment", amount, category: "loan_repayment" }, ...store.transactions]);
      setModal(null);
    },
    addSupplier(supplier) {
      store.setSuppliers([{ id: crypto.randomUUID?.(), spend: 0, rating: 4.5, ...supplier }, ...store.suppliers]);
      setModal(null);
    },
    addOrder(order) {
      store.setOrders([{ id: crypto.randomUUID?.(), status: "created", tracking: [["Created", order.city || "Warehouse", new Date().toISOString(), "PO generated"]], ...order }, ...store.orders]);
      setModal(null);
    },
    advanceShipment(id) {
      const steps = ["Packed", "Dispatched", "In_transit", "Delivered"];
      store.setOrders(store.orders.map((order) => {
        if (order.id !== id) return order;
        const nextStep = steps[Math.min(order.tracking.length - 1, steps.length - 1)];
        return {
          ...order,
          status: nextStep.toLowerCase(),
          tracking: [...order.tracking, [nextStep, nextStep === "Delivered" ? "Shop shelf" : "Agra Hub", new Date().toISOString(), nextStep === "Delivered" ? "Goods received" : "Recorded on chain"]]
        };
      }));
    }
  };

  if (!store.user.signedIn || view === "landing" || view === "signin" || view === "signup") {
    return <PublicSite view={view} setView={setView} actions={actions} metrics={metrics} chain={chain} />;
  }

  return (
    <div className="shell">
      <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu /></button>
      <Sidebar user={store.user} view={view} setView={(next) => { setView(next); setMobileNav(false); }} logout={actions.logout} open={mobileNav} close={() => setMobileNav(false)} />
      <main className="content">
        {view === "overview" && <Overview metrics={metrics} chain={chain} setView={setView} />}
        {view === "transactions" && <Transactions transactions={store.transactions} chain={chain} openModal={() => setModal("transaction")} />}
        {view === "ledger" && <Ledger chain={chain} />}
        {view === "credit" && <Credit metrics={metrics} transactions={store.transactions} />}
        {view === "loans" && <Loans loans={store.loans} metrics={metrics} openRequest={() => setModal("loan")} openRepay={() => setModal("repay")} />}
        {view === "supply" && <Supply orders={store.orders} suppliers={store.suppliers} openSupplier={() => setModal("supplier")} openOrder={() => setModal("order")} advanceShipment={actions.advanceShipment} />}
        {view === "ai" && <AIAdvisor metrics={metrics} transactions={store.transactions} orders={store.orders} loans={store.loans} chain={chain} />}
      </main>
      {modal && <ActionModal type={modal} close={() => setModal(null)} actions={actions} metrics={metrics} suppliers={store.suppliers} />}
    </div>
  );
}

function Brand() {
  return (
    <div className="brand">
      <div className="mark">M</div>
      <div><strong>MSME Chain</strong><span>Ledger · Credit · Supply</span></div>
    </div>
  );
}

function PublicSite({ view, setView, actions, metrics, chain }) {
  if (view === "signin") return <Auth mode="signin" setView={setView} submit={actions.signIn} />;
  if (view === "signup") return <Auth mode="signup" setView={setView} submit={actions.signUp} />;
  return (
    <main className="landing">
      <nav className="landing-nav"><Brand /><div><button onClick={() => setView("signin")} className="ghost">Sign in</button><button onClick={() => setView("signup")} className="primary">Start free</button></div></nav>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Private blockchain for MSME finance</p>
          <h1>Credit, loans, and supply chain records on one verified ledger.</h1>
          <p>MSME Chain gives small businesses a working dashboard where every transaction, loan repayment, and shipment update mints a tamper-evident SHA-256 block.</p>
          <div className="hero-actions"><button className="primary big" onClick={() => setView("signup")}><UserPlus /> Create account</button><button className="ghost big" onClick={() => setView("signin")}><KeyRound /> Sign in</button></div>
        </div>
        <div className="terminal-card">
          <div className="terminal-top"><BadgeCheck /> Chain verified · {chain.length || 30} blocks</div>
          <div className="hero-score"><span>Credit score</span><strong>{metrics.score}</strong><small>{metrics.tier} · eligible up to {rupee.format(metrics.eligible)}</small></div>
          <div className="mini-ledger">{chain.slice(0, 4).map((block) => <div key={block.index}><span>#{block.index}</span><code>{shortHash(block.hash || "000000000000")}</code></div>)}</div>
        </div>
      </section>
      <section className="feature-band">
        <Feature icon={ReceiptText} title="Ledger entries" body="Sales, purchases, expenses, and repayments are sealed into blocks." />
        <Feature icon={CircleDollarSign} title="Auto credit" body="Score and limits update as your on-chain behavior improves." />
        <Feature icon={Truck} title="Supply trace" body="Supplier, purchase order, and shipment milestones stay connected." />
      </section>
    </main>
  );
}

function Feature({ icon: Icon, title, body }) {
  return <article className="feature"><Icon /><h3>{title}</h3><p>{body}</p></article>;
}

function Auth({ mode, setView, submit }) {
  const [form, setForm] = useState({ name: "xyz", email: "abcde@gmail.com", password: "password123", businessName: "xyz", businessType: "retail" });
  const signup = mode === "signup";
  return (
    <main className="auth">
      <button onClick={() => setView("landing")} className="brand-button"><Brand /></button>
      <form className="auth-card" onSubmit={(event) => { event.preventDefault(); submit(form); }}>
        <p className="eyebrow">{signup ? "Create account" : "Welcome back"}</p>
        <h1>{signup ? "Start your MSME ledger." : "Sign in to MSME Chain."}</h1>
        {signup && <Field label="Your name" value={form.name} onChange={(name) => setForm({ ...form, name })} />}
        <Field label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
        <Field label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
        {signup && <><Field label="Business name" value={form.businessName} onChange={(businessName) => setForm({ ...form, businessName })} /><Field label="Business type" value={form.businessType} onChange={(businessType) => setForm({ ...form, businessType })} /></>}
        <button className="primary wide" type="submit">{signup ? "Create account" : "Sign in"}</button>
        <button type="button" className="link-button" onClick={() => setView(signup ? "signin" : "signup")}>{signup ? "Already have an account? Sign in" : "Need an account? Sign up"}</button>
      </form>
    </main>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return <label className="field"><span>{label}</span><input required type={type} value={value} placeholder={placeholder || label} onChange={(e) => onChange(e.target.value)} /></label>;
}

function Sidebar({ user, view, setView, logout, open, close }) {
  return (
    <>
      {open && <button className="scrim" onClick={close} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <Brand />
        <nav>{nav.map(([id, label, Icon]) => <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}><Icon /> {label}</button>)}</nav>
        <section className="signed-in"><p>Signed in</p><strong>{user.name}</strong><span>{user.email}</span><button onClick={logout}><LogOut /> Logout</button></section>
      </aside>
    </>
  );
}

function PageHeader({ eyebrow, title, subtitle, action }) {
  return <header className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{subtitle}</p></div>{action}</header>;
}

function Overview({ metrics, chain, setView }) {
  return (
    <>
      <PageHeader eyebrow="Overview" title="Your business, on-chain." subtitle="" action={<button className="pill"><Boxes /> {chain.length} blocks minted</button>} />
      <section className="overview-grid">
        <button className="score-card" onClick={() => setView("credit")}>
          <div><p className="eyebrow">Credit score</p><strong>{metrics.score}</strong><span>Tier · {metrics.tier}</span></div>
          <div className="gauge" style={{ "--score": `${((metrics.score - 300) / 600) * 270}deg` }}><CreditCard /></div>
          <div className="range"><span>Min<br />300</span><span>You<br />{metrics.score}</span><span>Max<br />900</span></div>
        </button>
        <Stat icon={ReceiptText} label="Sales" value={rupee.format(metrics.sales)} note="25 total transactions" />
        <Stat icon={ArrowDownLeft} label="Purchases" value={rupee.format(metrics.purchases)} />
        <Stat icon={ArrowUpRight} label="Net cash flow" value={rupee.format(metrics.netCashFlow)} note="Positive · Healthy" />
        <Stat icon={HandCoins} label="Active loans" value="1" note="₹1,90,000 outstanding" />
        <Stat icon={Truck} label="Shipments in transit" value="1" note="3 suppliers · 1 POs" />
      </section>
      <section className="panel"><p className="eyebrow">Last 6 months</p><h2>Cash flow breakdown</h2><div className="bars"><span style={{height:"42%"}} /><span style={{height:"50%"}} /><span style={{height:"74%"}} /><span style={{height:"63%"}} /><span style={{height:"88%"}} /><span style={{height:"71%"}} /></div></section>
    </>
  );
}

function Stat({ icon: Icon, label, value, note }) {
  return <article className="stat"><Icon /><p className="eyebrow">{label}</p><strong>{value}</strong>{note && <span>{note}</span>}</article>;
}

function Transactions({ transactions, chain, openModal }) {
  const sortedTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader eyebrow="Ledger entries" title="Transactions" subtitle="Every entry is sealed into a cryptographic block on your private chain." action={<button onClick={openModal} className="primary big"><Plus /> New transaction</button>} />
      <section className="table-card"><table><thead><tr><th>Date</th><th>Type</th><th>Counterparty</th><th>Amount</th><th>Category</th><th>Block</th></tr></thead><tbody>{sortedTransactions.map((tx, index) => {
        const block = chain.find((b) => b.payload.id === tx.id) || chain[chain.length - index - 1] || {};
        return <tr key={tx.id}><td>{formatDate(tx.date)}</td><td><span className={`tag ${tx.type}`}>{tx.type}</span></td><td><strong>{tx.counterparty}</strong></td><td>{rupee.format(tx.amount)}</td><td>{tx.category}</td><td>#{block.index ?? index} · {block.hash ? shortHash(block.hash) : "minting"}</td></tr>;
      })}</tbody></table></section>
    </>
  );
}

function Ledger({ chain }) {
  return (
    <>
      <PageHeader eyebrow="Immutable record" title="Blockchain Ledger" subtitle="Each block is sealed with SHA-256 and links to the previous block's hash. Tampering breaks the chain." action={null} />
      <button className="pill success"><ShieldCheck /> Chain verified · {chain.length} blocks</button>
      <section className="ledger-list">{chain.map((block) => <article className="block" key={block.index}><div className="block-meta"><span>#{block.index}</span><time>{new Date(block.timestamp).toLocaleString("en-US")}</time><b>{block.payload.event}</b><code><LinkIcon size={16} /> prev: {shortHash(block.previousHash)}</code></div><div className="block-body"><div><p className="eyebrow">Block hash</p><code>{block.hash}</code></div><div><p className="eyebrow">Payload</p><pre>{JSON.stringify(block.payload, null, 2)}</pre></div></div></article>)}</section>
    </>
  );
}

function Credit({ metrics, transactions }) {
  const factors = [
    ["Total volume on chain", metrics.volume, 76, "green"],
    ["Transaction count", transactions.length, 21, "red"],
    ["Active months", 6, 50, "amber"],
    ["Sales", metrics.sales, 69, "green"],
    ["Net cash flow", metrics.netCashFlow, 100, "red"]
  ];
  return (
    <>
      <PageHeader eyebrow="Earned, not inherited" title="Credit score" subtitle="Derived purely from your on-chain behaviour: transaction volume, consistency, profitability, and repayment track record." />
      <section className="credit-layout"><article className="score-tile"><p className="eyebrow">Your score</p><strong>{metrics.score}</strong><span>{metrics.tier}</span><p>Eligible up to {rupee.format(metrics.eligible)} on current chain.</p></article><article className="panel factors"><p className="eyebrow">Score factors</p>{factors.map(([name, value, width, color]) => <div className="factor" key={name}><div><span>{name}</span><strong>{typeof value === "number" && value > 1000 ? rupee.format(value) : value}</strong></div><div className="track"><span className={color} style={{ width: `${width}%` }} /></div></div>)}<div className="split"><div><p className="eyebrow">On-time repayments</p><strong>0</strong></div><div><p className="eyebrow">Defaults</p><strong>0</strong></div></div></article></section>
      <section className="panel climb"><BadgeCheck /><h2>How you climb</h2><p>Add regular sales, keep purchase records complete, repay loans on chain, and update shipment milestones when goods move.</p></section>
    </>
  );
}

function Loans({ loans, metrics, openRequest, openRepay }) {
  return (
    <>
      <PageHeader eyebrow="Micro-loans" title="Borrow on your chain" subtitle="Auto-approval based on your credit score. Every action is sealed on-chain." action={<button onClick={openRequest} className="primary big"><Plus /> Request loan</button>} />
      <section className="loan-list">{loans.map((loan) => <article className="loan" key={loan.id}><div className="loan-head"><div><span className="tag pending"><Cpu size={16} /> {loan.status}</span><time>{formatDate(loan.date)}</time><h2>{rupee.format(loan.principal)} · {loan.months} months</h2><p>{loan.category}</p></div><div className="loan-stats"><span>Score<strong>{metrics.score}</strong></span><span>Interest<strong>{loan.interest}%</strong></span><span>Repaid<strong>{rupee.format(loan.repaid)}</strong></span></div></div><div className="repay-row"><input aria-label="Repayment amount" placeholder="Repayment amount" readOnly /><button className="primary" onClick={openRepay}>Repay on chain</button></div></article>)}</section>
    </>
  );
}

function Supply({ orders, suppliers, openSupplier, openOrder, advanceShipment }) {
  const [tab, setTab] = useState("orders");
  return (
    <>
      <PageHeader eyebrow="Supply chain" title="From supplier to shelf." subtitle="Manage vendors, cut purchase orders, and record every shipment event to your chain." />
      <div className="actions"><button className="ghost big bordered" onClick={openSupplier}><Plus /> Supplier</button><button className="primary big" onClick={openOrder}><Plus /> Purchase order</button></div>
      <div className="tabs"><button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Purchase orders</button><button className={tab === "suppliers" ? "active" : ""} onClick={() => setTab("suppliers")}>Suppliers</button></div>
      {tab === "orders" ? <section className="order-list">{orders.map((order) => <article className="order" key={order.id}><div className="order-head"><div><h2><PackagePlus /> {order.supplier} <span className="tag pending">{order.status}</span></h2><strong>{rupee.format(order.amount)} · {order.items?.split("·").length || 1} items</strong><p>{order.items}</p></div><button className="ghost big bordered" onClick={() => advanceShipment(order.id)}><Truck /> Update shipment</button></div><hr /><p className="eyebrow">Tracking</p><ol>{order.tracking.map(([step, location, at, note], index) => <li key={`${step}-${index}`}><strong>{step}</strong> <span>@ {location}</span><small>{new Date(at).toLocaleString("en-US")} · {note}</small></li>)}</ol></article>)}</section> : <section className="supplier-grid">{suppliers.map((supplier) => <article className="stat" key={supplier.id}><Building2 /><p className="eyebrow">{supplier.city}</p><strong>{supplier.name}</strong><span>{rupee.format(supplier.spend)} spend · {supplier.rating} rating</span></article>)}</section>}
    </>
  );
}

function AIAdvisor({ metrics, transactions, orders, loans, chain }) {
  const [question, setQuestion] = useState("Give me a credit improvement plan and supply chain insights based on my business data.");
  const [answer, setAnswer] = useState("");
  function generate() {
    const saleShare = Math.round((metrics.sales / Math.max(metrics.volume, 1)) * 100);
    setAnswer(`Your chain is verified with ${chain.length} blocks. Current score is ${metrics.score} (${metrics.tier}), with ${saleShare}% of volume from sales and ${orders.length} active purchase order. Keep weekly sales entries consistent, repay at least ${rupee.format(Math.max(5000, loans[0]?.principal * 0.05 || 5000))} on chain this month, and close in-transit shipments as soon as goods arrive. Next best action: record two more supplier invoices and one partial loan repayment to strengthen cash-flow proof.`);
  }
  return (
    <>
      <PageHeader eyebrow="AI Advisor" title="Ask the ledger." subtitle="Reads your chain, transactions and supply chain state, then returns an actionable plan." />
      <section className="advisor"><label><span className="eyebrow">Your question</span><textarea value={question} onChange={(e) => setQuestion(e.target.value)} /></label><button className="primary big" onClick={generate}><Sparkles /> Generate insights</button>{answer && <article className="answer"><Sparkles /><p>{answer}</p><button className="ghost" onClick={() => navigator.clipboard?.writeText(answer)}>Copy plan</button></article>}</section>
    </>
  );
}

function ActionModal({ type, close, actions, metrics, suppliers }) {
  const [form, setForm] = useState({});
  const submit = (event) => {
    event.preventDefault();
    if (type === "transaction") actions.addTransaction({ type: form.type || "sale", counterparty: form.counterparty || "New Customer", amount: Number(form.amount || 10000), category: form.category || "general" });
    if (type === "loan") actions.addLoan({ principal: Number(form.principal || 50000), months: Number(form.months || 6), interest: metrics.score >= 780 ? 10 : 14, category: form.category || "working_capital" });
    if (type === "repay") actions.repay(Number(form.amount || 5000));
    if (type === "supplier") actions.addSupplier({ name: form.name || "New Supplier", city: form.city || "Delhi" });
    if (type === "order") actions.addOrder({ supplier: form.supplier || suppliers[0]?.name || "New Supplier", city: form.city || "Delhi", amount: Number(form.amount || 35000), items: form.items || "Cotton Yarn x100 · Dye x20" });
  };
  const title = { transaction: "New transaction", loan: "Request loan", repay: "Repay on chain", supplier: "Add supplier", order: "Purchase order" }[type];
  return (
    <div className="modal-wrap"><form className="modal" onSubmit={submit}><button type="button" className="close" onClick={close}><X /></button><p className="eyebrow">Mint a block</p><h2>{title}</h2>{type === "transaction" && <><Field label="Type" value={form.type || ""} placeholder="sale, purchase, expense" onChange={(type) => setForm({ ...form, type })} /><Field label="Counterparty" value={form.counterparty || ""} onChange={(counterparty) => setForm({ ...form, counterparty })} /><Field label="Amount" type="number" value={form.amount || ""} onChange={(amount) => setForm({ ...form, amount })} /><Field label="Category" value={form.category || ""} onChange={(category) => setForm({ ...form, category })} /></>}{type === "loan" && <><Field label="Principal" type="number" value={form.principal || ""} onChange={(principal) => setForm({ ...form, principal })} /><Field label="Months" type="number" value={form.months || ""} onChange={(months) => setForm({ ...form, months })} /><Field label="Category" value={form.category || ""} onChange={(category) => setForm({ ...form, category })} /></>}{type === "repay" && <Field label="Repayment amount" type="number" value={form.amount || ""} onChange={(amount) => setForm({ ...form, amount })} />}{type === "supplier" && <><Field label="Supplier name" value={form.name || ""} onChange={(name) => setForm({ ...form, name })} /><Field label="City" value={form.city || ""} onChange={(city) => setForm({ ...form, city })} /></>}{type === "order" && <><Field label="Supplier" value={form.supplier || ""} onChange={(supplier) => setForm({ ...form, supplier })} /><Field label="Amount" type="number" value={form.amount || ""} onChange={(amount) => setForm({ ...form, amount })} /><Field label="Items" value={form.items || ""} onChange={(items) => setForm({ ...form, items })} /></>}<button className="primary wide" type="submit"><Send /> Submit</button></form></div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
