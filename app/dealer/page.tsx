import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import DealerForm from "@/components/DealerForm";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { DEALER_BENEFITS, abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "หารถเข้าเต็นท์ รถมือสองจากเจ้าของโดยตรง | ร่วมเป็นเต็นท์พาร์ทเนอร์",
  description: "เต็นท์รถมือสองหาสต็อกรถง่ายขึ้นกับ RodWai รับข้อมูลรถจากเจ้าของที่ตั้งใจขายในกรุงเทพฯ พร้อมรายละเอียดและรูป เสนอราคาเฉพาะคันที่สนใจ สมัครฟรีทาง LINE",
  alternates: { canonical: "/dealer" },
};

export default function DealerPage() {
  return (
    <>
      <section className="dealer-hero">
        <div className="container">
          <Breadcrumbs items={[{ name: "สำหรับเต็นท์รถ", path: "/dealer" }]} />
          <div className="hero-grid" style={{ marginTop: 16 }}>
            <div>
              <span className="badge">สำหรับเต็นท์รถมือสอง</span>
              <h1>หารถเข้าเต็นท์ง่ายขึ้น รับรถจากเจ้าของโดยตรง</h1>
              <p className="lead">
                RodWai รวบรวมเจ้าของรถในกรุงเทพฯ ที่อยากขายรถ แล้วส่งข้อมูลรถให้เต็นท์พาร์ทเนอร์เสนอราคา
                คุณได้สต็อกรถใหม่โดยไม่ต้องวิ่งหาเอง
              </p>
              <ul className="checks">
                <li>สมัครฟรี</li>
                <li>ได้ข้อมูลรถ ยี่ห้อ รุ่น ปี เลขไมล์ และรูปก่อนเสนอราคา</li>
                <li>เลือกเสนอราคาเฉพาะคันที่ตรงกับเต็นท์ของคุณ</li>
                <li>คุยกันผ่าน LINE สะดวก รวดเร็ว</li>
              </ul>
              <img src="/mascot.svg" alt="เสือไว มาสคอตของ RodWai" className="hero-mascot" width={220} height={262} />
            </div>
            <DealerForm />
          </div>
        </div>
      </section>

      <div className="container">
        <section className="section">
          <h2>ทำไมเต็นท์รถควรร่วมกับ RodWai</h2>
          <div className="grid">
            {DEALER_BENEFITS.map((b) => (
              <div className="card" key={b.title}><h3>{b.title}</h3><p className="muted">{b.body}</p></div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>ทำงานร่วมกันอย่างไร</h2>
          <ol className="steps">
            <li><h3>สมัครพาร์ทเนอร์</h3><p className="muted">กรอกข้อมูลเต็นท์และประเภทรถที่ต้องการ ทีมงานติดต่อกลับเพื่อยืนยัน</p></li>
            <li><h3>รับข้อมูลรถ</h3><p className="muted">เมื่อมีเจ้าของรถส่งรถเข้ามาตรงกับที่คุณต้องการ เราส่งรายละเอียดและรูปให้ทาง LINE</p></li>
            <li><h3>เสนอราคา</h3><p className="muted">เสนอราคารับซื้อแข่งกับเต็นท์อื่น ผู้ขายเลือกข้อเสนอที่ดีที่สุด</p></li>
            <li><h3>รับรถเข้าเต็นท์</h3><p className="muted">ตกลงกับผู้ขาย ตรวจรถ ชำระเงิน และทำเอกสารโอน</p></li>
          </ol>
        </section>

        <section className="section">
          <h2>เทียบวิธีหารถเข้าเต็นท์</h2>
          <div className="table-wrap">
            <table className="compare">
              <thead><tr><th>วิธี</th><th>ข้อดี</th><th>ข้อจำกัด</th></tr></thead>
              <tbody>
                <tr><td>ไล่หาตามประกาศ / กลุ่ม Facebook</td><td>มีรถจำนวนมาก</td><td>เสียเวลาคัดกรอง หลายคันขายไปแล้วหรือคนขายไม่ได้ตั้งใจขายจริง</td></tr>
                <tr><td>ประมูลรถลานใหญ่</td><td>ได้ทีละหลายคัน</td><td>แข่งราคากับผู้ซื้อจำนวนมาก มีค่าธรรมเนียม และต้องเดินทางไปลาน</td></tr>
                <tr><td>รับเทิร์นจากโชว์รูม</td><td>รถสภาพดี มีประวัติ</td><td>ต้องมีคอนเนกชัน จำนวนไม่แน่นอน</td></tr>
                <tr><td><strong>RodWai</strong></td><td>รถจากเจ้าของโดยตรงที่ตั้งใจขาย มีข้อมูลและรูปก่อนเสนอราคา</td><td>เป็นการแข่งเสนอราคากับเต็นท์อื่น ต้องเสนอราคาที่แข่งขันได้</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <Faq title="คำถามจากเต็นท์รถ" items={[
          { q: "สมัครเป็นพาร์ทเนอร์มีค่าใช้จ่ายไหม?", a: "สมัครฟรี เงื่อนไขการเป็นพาร์ทเนอร์และค่าบริการ (ถ้ามี) ทีมงานจะแจ้งให้ชัดเจนก่อนเริ่มรับข้อมูลรถ" },
          { q: "รถที่ส่งมาอยู่พื้นที่ไหน?", a: "ตอนนี้เน้นรถในกรุงเทพมหานคร ครอบคลุมทั้ง 50 เขต" },
          { q: "เลือกรับเฉพาะรถบางประเภทได้ไหม?", a: "ได้ แจ้งยี่ห้อ ประเภท ช่วงปี หรือช่วงราคาที่ต้องการ แล้วเราจะส่งเฉพาะรถที่ตรงเงื่อนไข" },
          { q: "รับรถติดไฟแนนซ์ได้ไหม?", a: "ผู้ขายจะแจ้งสถานะไฟแนนซ์มากับข้อมูลรถ คุณเลือกได้ว่าจะเสนอราคาคันที่ติดไฟแนนซ์หรือไม่" },
        ]} />

        <section className="section">
          <div className="dealer-band">
            <div>
              <h2 style={{ color: "#fff" }}>พร้อมเพิ่มสต็อกรถให้เต็นท์ของคุณ?</h2>
              <p>สมัครฟรีวันนี้ แล้วเริ่มรับข้อมูลรถจากเจ้าของในกรุงเทพฯ</p>
            </div>
            <a href="#samak" className="btn btn-accent">สมัครเป็นพาร์ทเนอร์</a>
          </div>
          <p className="muted" style={{ marginTop: 16 }}>
            อ่านเพิ่ม: <Link href="/blog/how-dealers-find-used-car-stock">5 วิธีหารถเข้าเต็นท์รถมือสอง</Link>
          </p>
        </section>
      </div>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: "เต็นท์พาร์ทเนอร์ RodWai",
        serviceType: "จัดหารถมือสองจากเจ้าของโดยตรงสำหรับเต็นท์รถ",
        provider: { "@id": abs("/#business") },
        areaServed: { "@type": "City", name: "กรุงเทพมหานคร" },
        audience: { "@type": "BusinessAudience", name: "เต็นท์รถมือสอง" },
        url: abs("/dealer"),
      }} />
    </>
  );
}
