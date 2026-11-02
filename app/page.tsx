import Link from "next/link";
import ValuationForm from "@/components/ValuationForm";
import HeroOffers from "@/components/HeroOffers";
import Faq from "@/components/Faq";
import { Usps, Steps, CtaBox, BrandChips, RelatedPosts, DealerBand } from "@/components/Sections";
import { ZONES, DISTRICTS } from "@/lib/districts";
import { GENERAL_FAQ } from "@/lib/faq";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="badge">ขายรถมือสอง กรุงเทพฯ</span>
            <h1>ขายรถไว ได้ราคาดี ให้เต็นท์แข่งกันเสนอราคา</h1>
            <p className="lead">ส่งข้อมูลรถครั้งเดียว เต็นท์พาร์ทเนอร์ของ RodWai เสนอราคารับซื้อแข่งกัน คุณเลือกข้อเสนอที่ดีที่สุด รับซื้อรถทุกยี่ห้อทั่ว 50 เขตในกรุงเทพฯ</p>
            <ul className="checks">
              <li>ฟรีสำหรับผู้ขาย ไม่มีข้อผูกมัด</li>
              <li>ไม่ต้องขับรถไปเต็นท์ทีละที่ ตรวจสภาพถึงที่</li>
              <li>รถติดไฟแนนซ์ก็ขายได้</li>
              <li>เอกสารโอนถูกต้องตามกรมการขนส่งทางบก</li>
            </ul>
            <HeroOffers />
          </div>
          <ValuationForm source="home-hero" />
        </div>
      </section>

      <section className="section"><div className="container">
        <h2>ทำไมต้องรถไว? <span className="accent">เพราะเรื่องรถ เราต้องไว</span></h2>
        <p className="muted">คนที่อยากขายรถไม่มีใครอยากรอ รถไวเลยทำให้ทุกขั้นตอนไว ตั้งแต่ทักไลน์จนได้เงิน <a href="/about">รู้จักรถไว →</a></p>
        <Usps />
      </div></section>

      <section className="section soft" id="steps"><div className="container">
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

      <div className="container section"><DealerBand /></div>

      <section className="section"><div className="container">
        <h2>บทความสำหรับคนอยากขายรถ</h2>
        <RelatedPosts />
      </div></section>

      <div className="container"><CtaBox /></div>
    </>
  );
}
