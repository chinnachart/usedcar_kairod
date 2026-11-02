import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CtaBox } from "@/components/Sections";
import { ZONES, DISTRICTS } from "@/lib/districts";

export const metadata: Metadata = {
  title: "พื้นที่รับซื้อรถมือสอง ครบ 50 เขตกรุงเทพฯ",
  description: "รับซื้อรถมือสองครบทุกเขตในกรุงเทพฯ ทั้งชั้นใน ฝั่งเหนือ สุขุมวิท–บางนา ฝั่งตะวันออก และฝั่งธนบุรี นัดดูรถถึงที่ ประเมินฟรีทาง LINE",
  alternates: { canonical: "/khet" },
};

export default function KhetIndex() {
  return (
    <div className="container">
      <Breadcrumbs items={[{ name: "พื้นที่บริการ", path: "/khet" }]} />
      <section className="section">
        <h1>พื้นที่รับซื้อรถมือสอง ครบ 50 เขตกรุงเทพฯ</h1>
        <p className="lead">เลือกเขตของคุณเพื่อดูรายละเอียดบริการ หรือส่งข้อมูลรถทาง LINE เพื่อรับราคาได้ทันที</p>
        {ZONES.map((z) => (
          <div key={z.key} id={z.key} style={{ marginTop: 28 }}>
            <h2>{z.name}</h2>
            <p className="muted">{z.intro}</p>
            <ul className="chips">
              {DISTRICTS.filter((d) => d.zone === z.key).map((d) => (
                <li key={d.slug}><Link href={`/khet/${d.slug}`}>รับซื้อรถ {d.th}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <CtaBox />
    </div>
  );
}
