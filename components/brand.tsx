import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-moss text-2xl font-black text-white">M</span>
      <span>
        <strong className="block text-2xl leading-none text-ink">MSME Chain</strong>
        <small className="eyebrow">Ledger · Credit · Supply</small>
      </span>
    </Link>
  );
}
