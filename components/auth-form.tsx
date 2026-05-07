"use client";

import { useRouter } from "next/navigation";
import { Landmark, ShieldCheck, Store } from "lucide-react";
import { FormEvent, useState } from "react";
import { Brand } from "./brand";
import { createBlock } from "@/lib/blockchain";
import { emptyUser, loadState, saveState } from "@/lib/storage";

export function AuthForm({ mode, initialRole = "msme" }: { mode: "sign-in" | "sign-up"; initialRole?: "msme" | "bank" }) {
  const router = useRouter();
  const [role, setRole] = useState<"msme" | "bank">(initialRole);
  const [form, setForm] = useState({
    businessName: "xyz",
    email: "abcde@gmail.com",
    password: "password123",
    businessType: "retail",
    bankName: "Saathi Bank",
    branchCity: "Mumbai",
    lenderCode: "BANK-001"
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (role === "bank") {
      const bank = {
        id: crypto.randomUUID(),
        bankName: form.bankName || "Partner Bank",
        email: form.email,
        branchCity: form.branchCity || "Mumbai",
        lenderCode: form.lenderCode || "BANK-001",
        signedIn: true
      };
      localStorage.setItem("msme-saathi-bank-session", JSON.stringify(bank));
      router.push("/bank");
      return;
    }

    const state = loadState();
    const user = {
      ...(state.user ?? emptyUser),
      id: state.user?.id ?? crypto.randomUUID(),
      businessName: form.businessName || state.user?.businessName || "MSME Business",
      email: form.email,
      password: form.password,
      businessType: form.businessType || "retail",
      signedIn: true
    };
    const block = await createBlock(state.blocks, mode === "sign-up" ? "user_signed_up" : "user_signed_in", {
      userId: user.id,
      businessName: user.businessName,
      businessType: user.businessType
    });
    saveState({ ...state, user, blocks: [...state.blocks, block] });
    router.push("/user");
  }

  const signup = mode === "sign-up";
  const bank = role === "bank";

  return (
    <main className="grid min-h-screen place-items-center px-5 py-16">
      <div className="absolute left-5 top-5"><Brand /></div>
      <form onSubmit={submit} className="auth-card-3d card w-full max-w-5xl overflow-hidden p-0">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <section className="auth-side-panel p-7">
            <p className="eyebrow">Choose portal</p>
            <h1 className="mt-3 text-4xl font-black">{bank ? "Bank loan desk." : signup ? "Start your MSME ledger." : "Sign in to MSME Saathi."}</h1>
            <p className="mt-4 leading-7 text-slate-600">
              {bank
                ? "Review loan requests minted on-chain, inspect credit score, configure eligibility, and provide funding decisions."
                : "Build a verified ledger for transactions, credit score, loan readiness, and supply chain activity."}
            </p>
            <div className="mt-6 grid gap-3">
              <button type="button" className={`role-card ${!bank ? "role-card-active" : ""}`} onClick={() => setRole("msme")}>
                <Store />
                <span><strong>Sign in as user</strong><small>MSME dashboard, ledger, loans, supply chain</small></span>
              </button>
              <button type="button" className={`role-card ${bank ? "role-card-active" : ""}`} onClick={() => setRole("bank")}>
                <Landmark />
                <span><strong>Sign in as bank</strong><small>Loan review desk, eligibility, chain proof</small></span>
              </button>
            </div>
            <div className="bank-proof-strip mt-7">
              <ShieldCheck size={20} />
              <span>Loan requests are shown with score, cash flow, status, and block-backed activity.</span>
            </div>
          </section>
          <section className="p-7">
        <p className="eyebrow">{bank ? "Bank access" : signup ? "Create account" : "Welcome back"}</p>
        <h2 className="mt-3 text-3xl font-black">{bank ? "Sign in as bank." : signup ? "Create user account." : "Sign in as user."}</h2>
        <div className="mt-7 grid gap-4">
          {bank ? (
            <>
              <label className="field"><span>Bank name</span><input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} required /></label>
              <label className="field"><span>Branch city</span><input value={form.branchCity} onChange={(e) => setForm({ ...form, branchCity: e.target.value })} required /></label>
              <label className="field"><span>Lender code</span><input value={form.lenderCode} onChange={(e) => setForm({ ...form, lenderCode: e.target.value })} required /></label>
            </>
          ) : signup && (
            <>
              <label className="field"><span>Business name</span><input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required /></label>
              <label className="field"><span>Business type</span><input value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} required /></label>
            </>
          )}
          <label className="field"><span>Email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label className="field"><span>Password</span><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        </div>
        <button className="btn-primary mt-6 w-full" type="submit">{bank ? "Open bank page" : signup ? "Create user account" : "Open user dashboard"}</button>
        <LinkHint mode={mode} bank={bank} />
          </section>
        </div>
      </form>
    </main>
  );
}

function LinkHint({ mode, bank }: { mode: "sign-in" | "sign-up"; bank: boolean }) {
  const copy = bank
    ? "Banks can use the same portal from sign in or sign up."
    : mode === "sign-in"
      ? "New MSME? Create your ledger account from the sign up page."
      : "Already have an account? Sign in to continue.";
  return <p className="mt-4 text-center text-sm text-slate-500">{copy}</p>;
}
