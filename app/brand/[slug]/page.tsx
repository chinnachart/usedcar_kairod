import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ValuationForm from "@/components/ValuationForm";
import Faq from "@/components/Faq";
import { Steps, CtaBox, BrandChips } from "@/components/Sections";
import { BRANDS, brandBySlug } from "@/lib/brands";

export const dynamicParams = false;
export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = brandBySlug((await params).slug);
  if (!b) return {};
  return {
    title: `รับซื้อรถ ${b.name} มือสอง กรุงเทพฯ ให้ราคาสูง`,
    description: `รับซื้อ ${b.name} (${b.th}) มือสองทุกรุ่น เช่น ${b.models.slice(0, 4).join(", ")} ทั่วกรุงเทพฯ ประเมินราคาฟรีทาง LINE รถติดไฟแนนซ์ก็ขายได้`,
    alternates: { canonical: `/brand/${b.slug}` },
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const b = brandBySlug((await params).slug);
  if (!b) notFound();

  return (
    <div className="container">
      <Breadcrumbs items={[{ name: `รับซื้อ ${b.name}`, path: `/brand/${b.slug}` }]} />
      <section className="section hero-grid">
        <div>
          <h1>รับซื้อรถ {b.name} มือสอง ทุกรุ่น ทั่วกรุงเทพฯ</h1>
          <p className="lead">อยากขาย {b.name} ({b.th})? ส่งรุ่น ปี เลขไมล์ และรูปรถมาทาง LINE รับราคาประเมินฟรี</p>
          <p>{b.note}</p>
          <h2>รุ่นที่รับซื้อ</h2>
          <ul className="chips">{b.models.map((m) => <li key={m}><a href="#prameen">{b.name} {m}</a></li>)}</ul>
          <p className="muted" style={{ marginTop: 10 }}>ถ้าไม่เห็นรุ่นของคุณในรายการ ส่งข้อมูลมาได้ เรารับซื้อ {b.name} ทุกรุ่น</p>
        </div>
        <ValuationForm defaultBrand={b.name} source={`brand-${b.slug}`} title={`ประเมินราคา ${b.name} ฟรี`} />
      </section>

      <section className="section">
        <h2>ปัจจัยที่มีผลต่อราคารับซื้อ {b.name}</h2>
        <ul>
          <li><strong>ปีรถและเลขไมล์</strong>: รถปีใหม่ที่เลขไมล์ต่ำจะได้ราคาดีกว่า</li>
          <li><strong>ประวัติการดูแล</strong>: มีสมุดเข้าศูนย์ {b.name} หรือใบเสร็จการซ่อมบำรุงครบ</li>
          <li><strong>สภาพตัวถังและประวัติอุบัติเหตุ</strong>: รถที่ไม่เคยชนหนักหรือน้ำท่วมได้ราคาดีกว่ามาก</li>
          <li><strong>ตัวเลือกและอุปกรณ์</strong>: รุ่นย่อยท็อป สีที่ตลาดนิยม และกุญแจสำรองครบ</li>
        </ul>
        <p>ดูเพิ่มเติม: <Link href="/blog/tips-sell-car-best-price">7 วิธีขายรถมือสองให้ได้ราคาดี</Link></p>
      </section>

      <section className="section"><h2>ขั้นตอนขาย {b.name}</h2><Steps /></section>

      <Faq title={`คำถามเกี่ยวกับการขาย ${b.name} มือสอง`} items={[
        { q: `รับซื้อ ${b.name} รุ่นเก่าไหม?`, a: `รับ เราประเมินราคา ${b.name} ได้หลายช่วงปี ส่งรุ่น ปี และรูปรถมาได้เลย` },
        { q: `${b.name} ติดไฟแนนซ์ขายได้ไหม?`, a: "ขายได้ เราช่วยประสานปิดยอดกับไฟแนนซ์ แล้วโอนส่วนต่างที่เหลือให้คุณ" },
        { q: "ต้องเอารถไปที่เต็นท์ไหม?", a: "ไม่ต้อง ทีมงานนัดไปดูรถถึงที่ทั่วกรุงเทพฯ" },
      ]} />

      <section className="section"><h2>ยี่ห้ออื่นที่รับซื้อ</h2><BrandChips /></section>
      <CtaBox title={`อยากรู้ว่า ${b.name} ของคุณขายได้เท่าไร?`} />
    </div>
  );
}
