import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ValuationForm from "@/components/ValuationForm";
import Faq from "@/components/Faq";
import { Usps, Steps, CtaBox, BrandChips } from "@/components/Sections";
import { DISTRICTS, districtBySlug, zoneOf } from "@/lib/districts";

export const dynamicParams = false;
export function generateStaticParams() {
  return DISTRICTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = districtBySlug((await params).slug);
  if (!d) return {};
  return {
    title: `รับซื้อรถมือสอง เขต${d.th} ให้ราคาดี นัดดูรถถึงที่`,
    description: `รับซื้อรถมือสองในเขต${d.th} กรุงเทพฯ ทุกยี่ห้อ ประเมินราคาฟรีทาง LINE ทีมงานไปดูรถถึงบ้านหรือคอนโด รถติดไฟแนนซ์ก็ขายได้`,
    alternates: { canonical: `/khet/${d.slug}` },
  };
}

export default async function DistrictPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = districtBySlug((await params).slug);
  if (!d) notFound();
  const zone = zoneOf(d.zone);
  const siblings = DISTRICTS.filter((x) => x.zone === d.zone && x.slug !== d.slug);

  return (
    <div className="container">
      <Breadcrumbs items={[{ name: "พื้นที่บริการ", path: "/khet" }, { name: `เขต${d.th}`, path: `/khet/${d.slug}` }]} />
      <section className="section hero-grid">
        <div>
          <h1>รับซื้อรถมือสอง เขต{d.th}</h1>
          <p className="lead">
            อยู่เขต{d.th} ({d.en}) แล้วอยากขายรถ? ส่งข้อมูลรถมาทาง LINE รับราคาประเมินฟรี
            ถ้าพอใจ ทีมงานจะนัดไปดูรถถึงที่ในเขต{d.th} ไม่ต้องขับรถไปเต็นท์เอง
          </p>
          <p>{zone.intro}</p>
          <p>
            เรารับซื้อทั้งรถที่ปลอดภาระและ<Link href="/khai-rod-tid-finance">รถที่ยังติดไฟแนนซ์</Link>
            {" "}ถ้ายังไม่แน่ใจเรื่องเอกสาร อ่าน<Link href="/blog/documents-for-selling-car">เช็กลิสต์เอกสารขายรถ</Link>ก่อนได้
          </p>
        </div>
        <ValuationForm defaultDistrict={d.th} source={`khet-${d.slug}`} title={`ประเมินราคารถฟรี เขต${d.th}`} />
      </section>

      <section className="section">
        <h2>ทำไมคนเขต{d.th}เลือกรถไว? ไว 5 ข้อ</h2>
        <Usps />
      </section>

      <section className="section">
        <h2>ขั้นตอนขายรถ เขต{d.th}</h2>
        <Steps />
      </section>

      <section className="section">
        <h2>รับซื้อรถทุกยี่ห้อในเขต{d.th}</h2>
        <BrandChips />
      </section>

      <Faq title={`คำถามที่พบบ่อย: ขายรถในเขต${d.th}`} items={[
        { q: `รับซื้อรถถึงที่ในเขต${d.th}ไหม?`, a: `รับ ทีมงานนัดไปดูรถที่บ้าน คอนโด หรือที่ทำงานในเขต${d.th}และเขตใกล้เคียงใน${zone.name}ได้ตามเวลาที่คุณสะดวก` },
        { q: "ประเมินราคาเสียเงินไหม?", a: "ไม่เสียเงิน ส่งข้อมูลรถผ่านฟอร์มหรือ LINE แล้วรอรับราคาเบื้องต้น และไม่มีข้อผูกมัด" },
        { q: "รถยังผ่อนไม่หมดขายได้ไหม?", a: "ขายได้ เราช่วยประสานปิดยอดกับไฟแนนซ์ ถ้ามีส่วนต่างจะโอนให้คุณ" },
      ]} />

      <section className="section">
        <h2>เขตใกล้เคียงใน{zone.name}</h2>
        <ul className="chips">
          {siblings.map((s) => <li key={s.slug}><Link href={`/khet/${s.slug}`}>รับซื้อรถ {s.th}</Link></li>)}
        </ul>
      </section>

      <CtaBox title={`ขายรถในเขต${d.th} เริ่มจากขอราคาฟรี`} />
    </div>
  );
}
