import Link from "next/link";
import { USPS } from "@/lib/site";
import { BRANDS } from "@/lib/brands";
import { POSTS } from "@/lib/posts";
import LineLink from "./LineLink";

export function Usps() {
  return (
    <div className="wai-grid">
      {USPS.map((u, i) => (
        <div className="wai-card" key={u.title}>
          <span className="wai-num">{i + 1}</span>
          <h3>{u.title}</h3>
          <p className="muted">{u.body}</p>
        </div>
      ))}
    </div>
  );
}

export function Steps() {
  return (
    <ol className="steps">
      <li><h3>ส่งข้อมูลรถ</h3><p className="muted">กรอกฟอร์มหรือแอด LINE ผู้ช่วยขายรถส่วนตัวจะรับเรื่อง ขอรูปรถและเช็กเอกสารให้</p></li>
      <li><h3>เต็นท์แข่งกันเสนอราคา</h3><p className="muted">ผู้ช่วยขายส่งข้อมูลรถให้เต็นท์พาร์ทเนอร์เสนอราคา โดยไม่เปิดเผยชื่อและเบอร์ของคุณ</p></li>
      <li><h3>ตรวจสภาพถึงที่</h3><p className="muted">ผู้ช่วยขายสรุปข้อเสนอที่ดีที่สุด แล้วนัดเต็นท์มาตรวจรถถึงที่ ไปด้วยกันกับคุณ</p></li>
      <li><h3>โอนรถ รับเงิน</h3><p className="muted">วันโอน ผู้ช่วยขายไปด้วย เต็นท์โอนเงินเข้าบัญชีคุณโดยตรง ปลอดภัย เอกสารถูกต้อง</p></li>
    </ol>
  );
}

export function CtaBox({ title = "อยากรู้ว่ารถของคุณขายได้เท่าไร?", text = "ส่งรายละเอียดรถทาง LINE รับราคาประเมินฟรี ไม่มีข้อผูกมัด" }: { title?: string; text?: string }) {
  return (
    <div className="cta-box">
      <img src="/logo.svg" alt="" width={110} height={110} className="cta-mascot" />
      <h2>{title}</h2>
      <p>{text}</p>
      <LineLink source="cta-box">แอด LINE ขอราคาเลย</LineLink>
    </div>
  );
}

export function DealerBand() {
  return (
    <div className="dealer-band">
      <div>
        <h2 style={{ color: "#fff" }}>เป็นเต็นท์รถ? หารถเข้าเต็นท์กับ RodWai</h2>
        <p>รับข้อมูลรถจากเจ้าของในกรุงเทพฯ ที่ตั้งใจขาย พร้อมรูปและรายละเอียด เสนอราคาเฉพาะคันที่สนใจ สมัครฟรี</p>
      </div>
      <Link href="/dealer" className="btn btn-accent">สมัครเป็นเต็นท์พาร์ทเนอร์</Link>
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
