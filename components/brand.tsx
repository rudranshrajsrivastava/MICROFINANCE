import Link from "next/link";
import Image from "next/image";

export function Brand() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="brand-logo-3d">
        <Image src="/msme-saathi-logo.png" alt="MSME Saathi logo" width={72} height={56} priority />
      </span>
      <span>
        <strong className="brand-wordmark block text-3xl leading-none text-ink">MSME Saathi</strong>
        <small className="eyebrow">Ledger · Credit · Supply</small>
      </span>
    </Link>
  );
}
