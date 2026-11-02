// ตั้งค่าหลักของเว็บ — แก้ที่ไฟล์นี้ที่เดียว
export const SITE = {
  name: "รถไว",
  fullName: "รถไว RodWai รับซื้อรถมือสอง กรุงเทพฯ",
  // ตั้งค่า NEXT_PUBLIC_SITE_URL เป็นโดเมนจริงตอน deploy (เช่น https://rodwai.com)
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://rodwai.com").replace(/\/$/, ""),
  // LINE Official Account ID (ปกติขึ้นต้นด้วย @ เช่น @kairod) — ตรวจให้ตรงกับใน LINE OA Manager
  lineId: process.env.NEXT_PUBLIC_LINE_ID || "kairod@dotcom",
  // เบอร์โทร (ไม่บังคับ) เช่น "0812345678" — ถ้าเว้นว่าง ปุ่มโทรจะถูกซ่อน
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  areaServed: "กรุงเทพมหานคร",
};

export const lineAddFriendUrl = () =>
  `https://line.me/R/ti/p/${encodeURIComponent(SITE.lineId)}`;

export const lineMessageUrl = (text: string) =>
  `https://line.me/R/oaMessage/${encodeURIComponent(SITE.lineId)}/?${encodeURIComponent(text)}`;

export const abs = (path: string) => `${SITE.url}${path}`;

// จุดเด่นของบริการ — แก้ให้ตรงกับที่ทำได้จริงเท่านั้น (Google และลูกค้าจะเชื่อถือเว็บที่พูดจริง)
export const USPS = [
  { title: "ประเมินราคาฟรีผ่าน LINE", body: "ส่งรุ่น ปี เลขไมล์ และรูปรถ แล้วรอรับราคาเบื้องต้น ไม่มีค่าใช้จ่าย" },
  { title: "นัดดูรถถึงที่ทั่ว กทม.", body: "ทีมงานเดินทางไปดูรถที่บ้าน คอนโด หรือที่ทำงาน ตามเวลาที่คุณสะดวก" },
  { title: "รถติดไฟแนนซ์ก็ขายได้", body: "เราช่วยประสานปิดยอดกับไฟแนนซ์ ส่วนต่างที่เหลือโอนให้คุณ" },
  { title: "จ่ายเงินไว เอกสารครบ", body: "ตกลงราคาแล้วชำระเงินพร้อมทำเอกสารโอนให้ถูกต้องตามกรมการขนส่งทางบก" },
];
