import { readFileSync } from "node:fs";
import { join } from "node:path";

// ภาพประกอบแนวคิด "เต็นท์แข่งกันเสนอราคา" — ฝัง SVG ในหน้าเพื่อใช้ฟอนต์เดียวกับเว็บ
const svg = readFileSync(join(process.cwd(), "design/hero-offers.svg"), "utf8")
  .replace("<svg ", '<svg role="img" aria-label="รถหนึ่งคัน เต็นท์หลายเจ้าแข่งกันเสนอราคา" ')
  .replace(/font-family="[^"]*"/, 'font-family="inherit"');

export default function HeroOffers() {
  return <div className="hero-offers" dangerouslySetInnerHTML={{ __html: svg }} />;
}
