import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ValuationForm from "@/components/ValuationForm";
import Faq from "@/components/Faq";
import { CtaBox } from "@/components/Sections";

export const metadata: Metadata = {
  title: "ขายรถติดไฟแนนซ์ กรุงเทพฯ ผ่อนไม่หมดก็ขายได้ ช่วยปิดยอดให้",
  description: "รับซื้อรถติดไฟแนนซ์ทั่วกรุงเทพฯ ยังผ่อนไม่หมดก็ขายได้ เราช่วยประสานปิดยอดกับไฟแนนซ์และโอนส่วนต่างให้คุณ ประเมินราคาฟรีทาง LINE",
  alternates: { canonical: "/khai-rod-tid-finance" },
};

export default function FinancePage() {
  return (
    <div className="container">
      <Breadcrumbs items={[{ name: "ขายรถติดไฟแนนซ์", path: "/khai-rod-tid-finance" }]} />
      <section className="section hero-grid">
        <div>
          <h1>ขายรถติดไฟแนนซ์ ผ่อนไม่หมดก็ขายได้</h1>
          <p className="lead">ไม่ต้องหาเงินก้อนมาปิดยอดเอง เราช่วยประสานปิดยอดกับไฟแนนซ์ ถ้าราคารถสูงกว่ายอดคงเหลือ ส่วนต่างจะโอนให้คุณ</p>
          <h2>ขั้นตอน</h2>
          <ol>
            <li>ขอยอดปิดบัญชีจากไฟแนนซ์ (ดูได้ในแอปหรือโทรถามคอลเซ็นเตอร์)</li>
            <li>ส่งข้อมูลรถและยอดปิดมาทาง LINE เพื่อประเมินราคา</li>
            <li>ตรวจสภาพรถจริงและยืนยันราคา</li>
            <li>เรานำเงินไปปิดยอดกับไฟแนนซ์ แล้วโอนส่วนต่างให้คุณ</li>
            <li>ไฟแนนซ์ออกชุดโอน แล้วดำเนินการโอนกรรมสิทธิ์ให้ถูกต้อง</li>
          </ol>
          <p>อยากเข้าใจทุกทางเลือกก่อนตัดสินใจ? อ่าน <Link href="/blog/sell-car-with-finance">รถติดไฟแนนซ์ขายได้ไหม? 3 วิธีขายรถที่ยังผ่อนไม่หมด</Link></p>
        </div>
        <ValuationForm source="finance-page" title="ประเมินราคารถติดไฟแนนซ์ฟรี" />
      </section>
      <Faq items={[
        { q: "ถ้ายอดหนี้สูงกว่าราคารถ ทำอย่างไร?", a: "ถ้าราคารถต่ำกว่ายอดปิด เจ้าของรถต้องเตรียมเงินส่วนต่างมาปิดยอดให้ครบ เราจะแจ้งตัวเลขให้ชัดเจนก่อนตัดสินใจ" },
        { q: "ใช้เวลานานไหม?", a: "ขึ้นอยู่กับขั้นตอนของแต่ละไฟแนนซ์ เราจะแจ้งระยะเวลาโดยประมาณหลังเห็นข้อมูลสัญญา" },
        { q: "ทำไมไม่ควรให้คนอื่นผ่อนต่อเอง?", a: "ถ้าไม่ได้เปลี่ยนสัญญากับไฟแนนซ์ ชื่อคุณยังอยู่ในสัญญา ถ้าผู้ผ่อนต่อผิดนัด คุณจะต้องรับผิดชอบหนี้และเสียประวัติเครดิต" },
      ]} />
      <CtaBox title="รถติดไฟแนนซ์ อยากขายให้จบเร็ว" />
    </div>
  );
}
