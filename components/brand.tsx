import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="brand-mark-3d grid h-12 w-12 place-items-center rounded-xl bg-moss text-2xl font-black text-white">m</span>
      <span>
        <strong className="brand-wordmark block text-3xl leading-none text-ink">msmeSaathi</strong>
        <small className="eyebrow">Ledger · Credit · Supply</small>
      </span>
    </Link>
  );
}
