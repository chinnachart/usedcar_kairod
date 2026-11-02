import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { RelatedPosts, CtaBox } from "@/components/Sections";

export const metadata: Metadata = {
  title: "บทความขายรถมือสอง เอกสาร ไฟแนนซ์ และเคล็ดลับได้ราคาดี",
  description: "รวมบทความสำหรับคนที่อยากขายรถมือสอง ทั้งเอกสารที่ต้องใช้ การขายรถติดไฟแนนซ์ และวิธีขายให้ได้ราคาดี",
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  return (
    <div className="container">
      <Breadcrumbs items={[{ name: "บทความ", path: "/blog" }]} />
      <section className="section">
        <h1>บทความสำหรับคนอยากขายรถ</h1>
        <RelatedPosts />
      </section>
      <CtaBox />
    </div>
  );
}
