import Link from "next/link";
import Logo from "./Logo";
import LineLink from "./LineLink";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className="nav" aria-label="เมนูหลัก">
          <Link href="/prameen-rakha-rod">ขายรถ</Link>
          <Link href="/khai-rod-tid-finance">รถติดไฟแนนซ์</Link>
          <Link href="/khet">พื้นที่บริการ</Link>
          <Link href="/blog">บทความ</Link>
          <Link href="/about">ทำไมต้องรถไว</Link>
          <Link href="/dealer" className="nav-dealer">สำหรับเต็นท์รถ</Link>
        </nav>
        <Link href="/dealer" className="mobile-dealer">เต็นท์รถ</Link>
        <LineLink className="btn btn-line btn-sm header-cta" source="header">ขายรถ</LineLink>
      </div>
    </header>
  );
}
