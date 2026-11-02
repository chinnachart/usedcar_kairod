import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className={`logo${dark ? " logo-dark" : ""}`} aria-label="RodWai รถไว หน้าแรก">
      <img src="/logo.svg" alt="" width={40} height={40} />
      <span className="logo-words">
        <span><span className="logo-text">Rod<b>Wai</b></span> <span className="logo-th">รถไว</span></span>
        <span className="logo-slogan">{SITE.slogan}</span>
      </span>
    </Link>
  );
}
