# รถไว (RodWai) — เว็บรับซื้อรถมือสอง กทม. (Next.js, SEO-first)

## รันบนเครื่อง
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # ตรวจว่า build ผ่านก่อน deploy
```

## ตั้งค่า (Environment variables บน Vercel)
| ตัวแปร | ตัวอย่าง | หมายเหตุ |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://rodwai.com` | **ต้องตั้ง** ใช้ทำ canonical/sitemap |
| `NEXT_PUBLIC_LINE_ID` | `@216fjaks` | LINE OA Basic ID (ขึ้นต้นด้วย @) |
| `NEXT_PUBLIC_PHONE` | `0812345678` | ไม่บังคับ ถ้าใส่จะมีปุ่มโทร |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXX` | GA4 — event `generate_lead` = ลีด |
| `NEXT_PUBLIC_GSC_VERIFICATION` | `abc123` | โค้ดยืนยัน Google Search Console |

## โครงสร้างหน้าที่ทำ SEO
- `/` หน้าหลัก: รับซื้อรถมือสอง กรุงเทพฯ
- `/prameen-rakha-rod` หน้าประเมินราคารถ (ตัวเก็บลีดผู้ขายหลัก)
- `/dealer` หน้าชวนเต็นท์รถมาเป็นพาร์ทเนอร์ (ฟอร์มสมัครส่งเข้า LINE)
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

## บันทึกดูแลคุณพ่อ (`/care`) — ใช้ Google Sheet เป็นฐานข้อมูล
หน้า `/care` เป็นแอปแยกต่างหาก ต้องล็อกอินก่อนใช้ ไม่ขึ้นใน Google (noindex และอยู่ใน robots disallow) และไม่มีลิงก์จากหน้าเว็บหลัก

### 1) Google Sheet
ชีตต้องมี 2 แท็บ (ชื่อแท็บต้องตรงตามนี้ แถวแรกคือหัวตาราง)

| แท็บ `users` | A `username` | B `password_hash` | C `name` | D `role` |
|---|---|---|---|---|

| แท็บ `log` | A `date` | B `hour` | C `value` | D `note` | E `updated_at` | F `updated_by` |
|---|---|---|---|---|---|---|

- `role`: `admin` = บันทึกได้ + จัดการผู้ใช้ · `caregiver` = บันทึกได้ · `family` = ดูอย่างเดียว
- แท็บ `log` ระบบเขียนเอง: 1 แถว = 1 ชั่วโมงของ 1 วัน, `value` = −100 (เกร็งมาก) … 0 (ปกติ) … +100 (ยุกยิกมาก), `note` = หมายเหตุของชั่วโมงนั้น (แถวเก่าที่เป็น TRUE จะแสดงเป็น "กินยา")

### 2) สร้าง Service Account ให้เว็บเข้าถึงชีต
1. Google Cloud Console → สร้างโปรเจกต์ → เปิดใช้ **Google Sheets API**
2. IAM & Admin → Service Accounts → สร้าง → แท็บ Keys → Add key → JSON (ได้ไฟล์ .json)
3. เปิด Google Sheet → Share → ใส่อีเมลของ service account (ลงท้าย `iam.gserviceaccount.com`) ให้สิทธิ์ **Editor**

### 3) ตั้งค่า Environment variables บน Vercel
| ตัวแปร | ค่า |
|---|---|
| `CARE_SHEET_ID` | ID ของชีต (ส่วนระหว่าง `/d/` กับ `/edit` ใน URL) |
| `GOOGLE_SA_EMAIL` | `client_email` จากไฟล์ JSON |
| `GOOGLE_SA_PRIVATE_KEY` | `private_key` จากไฟล์ JSON (วางทั้งก้อน รวม `-----BEGIN PRIVATE KEY-----`) |
| `CARE_SESSION_SECRET` | ข้อความสุ่มยาว 32 ตัวขึ้นไป เช่น จาก `openssl rand -base64 48` |

แล้ว Redeploy

### 4) สร้างผู้ดูแลระบบคนแรก และเพิ่มคนอื่น
1. เปิด `https://rodwai.com/care/setup` (ใช้ได้เฉพาะตอนแท็บ `users` ยังว่าง) ใส่ **รหัสตั้งค่า** = ค่า `CARE_SESSION_SECRET` แล้วตั้งชื่อผู้ใช้/รหัสผ่านของคุณ
2. หลังจากนั้นเพิ่มคน เปลี่ยนรหัสผ่าน เปลี่ยนสิทธิ์ หรือลบผู้ใช้ ได้ที่ `https://rodwai.com/care/admin` (ปุ่ม "จัดการผู้ใช้" บนหน้ากราฟ) ระบบสุ่มรหัสผ่านและสร้างข้อความพร้อมส่ง LINE ให้
3. ลบผู้ใช้แล้ว คนนั้นยังใช้งานได้จนครบ 30 วันถ้าล็อกอินค้างไว้ ถ้าต้องการเตะออกทันที ให้เปลี่ยน `CARE_SESSION_SECRET` (ทุกคนต้องล็อกอินใหม่)
4. ทางเลือกแบบบรรทัดคำสั่ง: `npm run care:hash -- "รหัสผ่าน"` แล้ววางผลลัพธ์ในช่อง `password_hash` เอง
