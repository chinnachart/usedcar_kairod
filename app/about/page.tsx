import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { Usps, Steps, CtaBox, DealerBand } from "@/components/Sections";
import { SITE, abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "ทำไมต้องรถไว? เพราะเรื่องรถ เราต้องไว",
  description: "รู้จักรถไว (RodWai) บริการขายรถมือสองในกรุงเทพฯ ที่ให้เต็นท์หลายเจ้าแข่งกันเสนอราคา ไวทุกขั้นตอน ตั้งแต่ทักไลน์ ประเมินราคา ปิดไฟแนนซ์ จนได้เงิน",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="container">
      <Breadcrumbs items={[{ name: "ทำไมต้องรถไว", path: "/about" }]} />
      <section className="section hero-grid">
        <div>
          <span className="badge">รู้จักรถไว</span>
          <h1>ทำไมต้องรถไว?</h1>
          <p className="slogan-big">เพราะเรื่องรถ <span>เราต้องไว</span></p>
          <div className="story">
            <p>คนที่อยากขายรถ <strong>ไม่มีใครอยากรอ</strong></p>
            <p>ไม่อยากขับรถวนหลายเต็นท์ ไม่อยากต่อรองทีละเจ้า ไม่อยากรอคนซื้อที่ไม่มาตามนัด</p>
            <p>รถไวจึงรวม<strong>เต็นท์รถมือสองหลายเจ้า</strong>มาแข่งกันเสนอราคาให้คุณในที่เดียว ส่งข้อมูลรถครั้งเดียว ได้ราคาที่ดีที่สุด โดยไม่เสียเวลา</p>
            <p>มาสคอตของเราคือ <strong>เสือไว</strong> เพราะเสือชีตาห์คือสัตว์บกที่ไวที่สุด และนั่นคือสิ่งที่เราตั้งใจทำให้คุณทุกวัน</p>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <img src="/logo.svg" alt="เสือไว มาสคอตของรถไว" width={300} height={300} style={{ maxWidth: "70%", height: "auto" }} />
          <p className="slogan-big" style={{ fontSize: "1.6rem" }}>{SITE.slogan}</p>
        </div>
      </section>

      <section className="section">
        <h2>ไว 5 ข้อ ที่ทำให้ต่างจากการขายรถแบบเดิม</h2>
        <Usps />
      </section>

      <section className="section">
        <h2>ขั้นตอนขายรถกับรถไว</h2>
        <Steps />
      </section>

      <section className="section">
        <h2>สำหรับเต็นท์รถ</h2>
        <p className="muted">รถไวไม่ได้ไวแค่กับผู้ขาย เต็นท์พาร์ทเนอร์ก็ได้รถเข้าเต็นท์ไวขึ้นด้วย เพราะได้ข้อมูลรถจากเจ้าของโดยตรง พร้อมรูปและรายละเอียด <Link href="/dealer">ดูรายละเอียดพาร์ทเนอร์</Link></p>
        <DealerBand />
      </section>

      <CtaBox title="พร้อมขายรถแบบไวๆ แล้วใช่ไหม?" text="ส่งข้อมูลรถทาง LINE ให้เสือไวจัดการ ฟรี ไม่มีข้อผูกมัด" />

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "ทำไมต้องรถไว",
        url: abs("/about"),
        about: { "@id": abs("/#business") },
      }} />
    </div>
  );
}
