import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ValuationForm from "@/components/ValuationForm";
import Faq from "@/components/Faq";
import { CtaBox } from "@/components/Sections";
import { GENERAL_FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "ประเมินราคารถมือสองฟรี รู้ราคาภายในไม่กี่นาที",
  description: "ประเมินราคารถมือสองฟรี กรอกยี่ห้อ รุ่น ปี เลขไมล์ แล้วรับราคารับซื้อเบื้องต้นทาง LINE ทั่วกรุงเทพฯ ไม่มีข้อผูกมัด",
  alternates: { canonical: "/prameen-rakha-rod" },
};

export default function Valuation() {
  return (
    <div className="container">
      <Breadcrumbs items={[{ name: "ประเมินราคารถ", path: "/prameen-rakha-rod" }]} />
      <section className="section hero-grid">
        <div>
          <h1>ประเมินราคารถมือสองฟรี</h1>
          <p className="lead">กรอกข้อมูลรถไม่ถึง 1 นาที ระบบจะเปิด LINE พร้อมข้อความให้คุณกดส่ง แล้วทีมงานจะแจ้งราคารับซื้อเบื้องต้นกลับไป</p>
          <h2>ส่งข้อมูลอะไรแล้วจะได้ราคาแม่นที่สุด</h2>
          <ul>
            <li>รูปรถรอบคัน 4 มุม และรูปภายในห้องโดยสาร</li>
            <li>รูปหน้าปัดที่เห็นเลขไมล์</li>
            <li>รุ่นย่อย เช่น G, E, Top, Hybrid</li>
            <li>ประวัติอุบัติเหตุหรือการซ่อมใหญ่ (ถ้ามี)</li>
          </ul>
          <p>อยากได้ราคาดีขึ้น? อ่าน <Link href="/blog/tips-sell-car-best-price">7 วิธีเตรียมรถก่อนขาย</Link></p>
        </div>
        <ValuationForm source="valuation-page" />
      </section>
      <Faq items={GENERAL_FAQ} />
      <CtaBox />
    </div>
  );
}
