import Link from "next/link";
import { SITE } from "@/lib/site";
import LineLink from "./LineLink";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">{SITE.name}<span>รับซื้อรถ กทม.</span></Link>
        <nav className="nav" aria-label="เมนูหลัก">
          <Link href="/prameen-rakha-rod">ประเมินราคา</Link>
          <Link href="/khai-rod-tid-finance">รถติดไฟแนนซ์</Link>
          <Link href="/khet">พื้นที่บริการ</Link>
          <Link href="/blog">บทความ</Link>
        </nav>
        <LineLink className="btn btn-line btn-sm header-cta" source="header">แอด LINE</LineLink>
      </div>
    </header>
  );
}
