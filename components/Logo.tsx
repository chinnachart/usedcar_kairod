import Link from "next/link";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className={`logo${dark ? " logo-dark" : ""}`} aria-label="RodWai รถไว หน้าแรก">
      <img src="/logo.svg" alt="" width={32} height={32} />
      <span className="logo-text">Rod<b>Wai</b></span>
      <span className="logo-th">รถไว</span>
    </Link>
  );
}
