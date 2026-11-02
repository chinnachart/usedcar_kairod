import Link from "next/link";
import ValuationForm from "@/components/ValuationForm";
import Faq from "@/components/Faq";
import { Usps, Steps, CtaBox, BrandChips, RelatedPosts } from "@/components/Sections";
import { ZONES, DISTRICTS } from "@/lib/districts";
import { GENERAL_FAQ } from "@/lib/faq";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>รับซื้อรถมือสอง กรุงเทพฯ ให้ราคาสูง ประเมินฟรีทาง LINE</h1>
            <p className="lead">รับซื้อรถทุกยี่ห้อ ทั้งรถเก๋ง กระบะ SUV และ EV ครอบคลุม 50 เขตทั่วกรุงเทพฯ รถติดไฟแนนซ์ก็ขายได้</p>
            <ul className="checks">
              <li>ประเมินราคาฟรี ไม่มีข้อผูกมัด</li>
              <li>นัดดูรถถึงบ้าน คอนโด หรือที่ทำงาน</li>
              <li>ช่วยปิดยอดไฟแนนซ์ ส่วนต่างโอนให้คุณ</li>
              <li>จ่ายเงินไว เอกสารโอนถูกต้อง</li>
            </ul>
          </div>
          <ValuationForm source="home-hero" />
        </div>
      </section>

      <section className="section"><div className="container">
        <h2>ทำไมต้องขายรถกับรถไว</h2>
        <Usps />
      </div></section>

      <section className="section soft"><div className="container">
        <h2>ขายรถง่ายๆ 4 ขั้นตอน</h2>
        <Steps />
      </div></section>

      <section className="section"><div className="container">
        <h2>รับซื้อรถทุกยี่ห้อ</h2>
        <BrandChips />
        <p className="muted" style={{ marginTop: 12 }}>
          รถติดไฟแนนซ์ก็ขายได้ <Link href="/khai-rod-tid-finance">อ่านขั้นตอนขายรถติดไฟแนนซ์</Link>
        </p>
      </div></section>

      <section className="section soft"><div className="container">
        <h2>พื้นที่รับซื้อรถทั่วกรุงเทพฯ</h2>
        {ZONES.map((z) => (
          <div key={z.key} style={{ marginBottom: 16 }}>
            <h3>{z.name}</h3>
            <ul className="chips">
              {DISTRICTS.filter((d) => d.zone === z.key).map((d) => (
                <li key={d.slug}><Link href={`/khet/${d.slug}`}>{d.th}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div></section>

      <div className="container"><Faq items={GENERAL_FAQ} /></div>

      <section className="section"><div className="container">
        <h2>บทความสำหรับคนอยากขายรถ</h2>
        <RelatedPosts />
      </div></section>

      <div className="container"><CtaBox /></div>
    </>
  );
}
