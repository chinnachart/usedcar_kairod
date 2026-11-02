# KaiRod — เว็บรับซื้อรถมือสอง กทม. (Next.js, SEO-first)

## รันบนเครื่อง
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # ตรวจว่า build ผ่านก่อน deploy
```

## ตั้งค่า (Environment variables บน Vercel)
| ตัวแปร | ตัวอย่าง | หมายเหตุ |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.kairod.com` | **ต้องตั้ง** ใช้ทำ canonical/sitemap |
| `NEXT_PUBLIC_LINE_ID` | `@kairod` | LINE OA Basic ID (ขึ้นต้นด้วย @) |
| `NEXT_PUBLIC_PHONE` | `0812345678` | ไม่บังคับ ถ้าใส่จะมีปุ่มโทร |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXX` | GA4 — event `generate_lead` = ลีด |
| `NEXT_PUBLIC_GSC_VERIFICATION` | `abc123` | โค้ดยืนยัน Google Search Console |

## โครงสร้างหน้าที่ทำ SEO
- `/` หน้าหลัก: รับซื้อรถมือสอง กรุงเทพฯ
- `/prameen-rakha-rod` หน้าประเมินราคารถ (ตัวเก็บลีดหลัก)
- `/khai-rod-tid-finance` หน้าขายรถติดไฟแนนซ์
- `/khet/[เขต]` หน้ารับซื้อรถทั้ง 50 เขต (`lib/districts.ts`)
- `/brand/[ยี่ห้อ]` หน้ารับซื้อตามยี่ห้อ (`lib/brands.ts`)
- `/blog/[slug]` บทความ (`lib/posts.ts`)
- `sitemap.xml`, `robots.txt`, schema (AutomotiveBusiness, Breadcrumb, FAQ, Article)

ฟอร์มประเมินราคาไม่ต้องมี backend เมื่อกดส่ง ระบบจะเปิดแชท LINE OA พร้อมข้อความรายละเอียดรถที่กรอกไว้

## Checklist หลังขึ้นเว็บ
1. แก้ `USPS` ใน `lib/site.ts` ให้ตรงกับบริการที่ทำได้จริง
2. ผูกโดเมนกับ Vercel และตั้ง `NEXT_PUBLIC_SITE_URL`
3. เพิ่มเว็บใน Google Search Console แล้ว submit `sitemap.xml`
4. สร้าง Google Business Profile (รูปแบบ Service-area business ให้บริการทั่วกรุงเทพฯ) และใส่ลิงก์เว็บ
5. ใน GA4 ตั้ง `generate_lead` เป็น Key event
6. ทุกครั้งที่ปิดดีล ขอรีวิวบน Google และถ่ายรูปรถ (ได้รับอนุญาตจากลูกค้าแล้ว) ไปใส่ในหน้าเขต/ยี่ห้อที่ตรงกัน
7. เพิ่มบทความใหม่สัปดาห์ละ 1–2 เรื่อง จากคำถามที่ลูกค้าถามจริงใน LINE
