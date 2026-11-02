import Link from "next/link";
import { SITE } from "@/lib/site";
import Logo from "./Logo";
import { BRANDS } from "@/lib/brands";
import { ZONES, DISTRICTS } from "@/lib/districts";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo dark />
          <p>{SITE.tagline} บริการขายรถมือสองทุกยี่ห้อในกรุงเทพมหานคร ติดต่อทาง LINE: {SITE.lineId}</p>
          <p><Link href="/dealer">เต็นท์รถ: สมัครเป็นพาร์ทเนอร์ →</Link></p>
        </div>
        <div>
          <p className="footer-h">รับซื้อตามยี่ห้อ</p>
          <ul>{BRANDS.map((b) => <li key={b.slug}><Link href={`/brand/${b.slug}`}>รับซื้อ {b.name}</Link></li>)}</ul>
        </div>
        <div>
          <p className="footer-h">พื้นที่บริการ</p>
          <ul>
            {ZONES.map((z) => (
              <li key={z.key}><Link href={`/khet#${z.key}`}>{z.name}</Link> ({DISTRICTS.filter((d) => d.zone === z.key).length} เขต)</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-h">ข้อมูลน่ารู้</p>
          <ul>
            <li><Link href="/prameen-rakha-rod">ประเมินราคารถฟรี</Link></li>
            <li><Link href="/khai-rod-tid-finance">ขายรถติดไฟแนนซ์</Link></li>
            <li><Link href="/blog">บทความทั้งหมด</Link></li>
            <li><Link href="/dealer">สำหรับเต็นท์รถ</Link></li>
          </ul>
        </div>
      </div>
      <p className="container copyright">© {new Date().getFullYear()} {SITE.fullName}</p>
    </footer>
  );
}
