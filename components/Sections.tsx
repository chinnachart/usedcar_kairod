import Link from "next/link";
import { USPS } from "@/lib/site";
import { BRANDS } from "@/lib/brands";
import { POSTS } from "@/lib/posts";
import LineLink from "./LineLink";

export function Usps() {
  return (
    <div className="grid">
      {USPS.map((u) => (
        <div className="card" key={u.title}><h3>{u.title}</h3><p className="muted">{u.body}</p></div>
      ))}
    </div>
  );
}

export function Steps() {
  return (
    <ol className="steps">
      <li><h3>ส่งข้อมูลรถ</h3><p className="muted">กรอกฟอร์มหรือแอด LINE แล้วส่งยี่ห้อ รุ่น ปี เลขไมล์ พร้อมรูปรถ</p></li>
      <li><h3>รับราคาเบื้องต้น</h3><p className="muted">ทีมงานแจ้งช่วงราคาที่รับซื้อกลับทาง LINE</p></li>
      <li><h3>นัดตรวจสภาพ</h3><p className="muted">ทีมงานไปดูรถถึงที่ในกรุงเทพฯ แล้วยืนยันราคาสุดท้าย</p></li>
      <li><h3>รับเงิน โอนรถ</h3><p className="muted">ตกลงราคาแล้วรับเงิน ส่วนเอกสารโอนเราดำเนินการให้</p></li>
    </ol>
  );
}

export function CtaBox({ title = "อยากรู้ว่ารถของคุณขายได้เท่าไร?", text = "ส่งรายละเอียดรถทาง LINE รับราคาประเมินฟรี ไม่มีข้อผูกมัด" }: { title?: string; text?: string }) {
  return (
    <div className="cta-box">
      <h2>{title}</h2>
      <p>{text}</p>
      <LineLink source="cta-box">แอด LINE ขอราคาเลย</LineLink>
    </div>
  );
}

export function BrandChips() {
  return (
    <ul className="chips">
      {BRANDS.map((b) => <li key={b.slug}><Link href={`/brand/${b.slug}`}>รับซื้อ {b.name}</Link></li>)}
    </ul>
  );
}

export function RelatedPosts({ exclude }: { exclude?: string }) {
  return (
    <div className="grid">
      {POSTS.filter((p) => p.slug !== exclude).slice(0, 3).map((p) => (
        <Link key={p.slug} href={`/blog/${p.slug}`} className="card" style={{ textDecoration: "none", color: "inherit" }}>
          <h3>{p.title}</h3><p className="muted">{p.description}</p>
        </Link>
      ))}
    </div>
  );
}
