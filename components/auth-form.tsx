"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Brand } from "./brand";
import { createBlock } from "@/lib/blockchain";
import { emptyUser, loadState, saveState } from "@/lib/storage";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "xyz",
    email: "abcde@gmail.com",
    password: "password123",
    businessType: "retail"
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    router.push("/dashboard");
  }

  const signup = mode === "sign-up";

  return (
    <main className="grid min-h-screen place-items-center px-5 py-16">
      <div className="absolute left-5 top-5"><Brand /></div>
      <form onSubmit={submit} className="card w-full max-w-lg p-7">
        <p className="eyebrow">{signup ? "Create account" : "Welcome back"}</p>
        <h1 className="mt-3 text-4xl font-black">{signup ? "Start your MSME ledger." : "Sign in to MSME Chain."}</h1>
        <div className="mt-7 grid gap-4">
          {signup && (
            <>
              <label className="field"><span>Business name</span><input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required /></label>
              <label className="field"><span>Business type</span><input value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} required /></label>
            </>
          )}
          <label className="field"><span>Email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label className="field"><span>Password</span><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        </div>
        <button className="btn-primary mt-6 w-full" type="submit">{signup ? "Create account" : "Sign in"}</button>
      </form>
    </main>
  );
}
