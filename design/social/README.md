# ภาพโซเชียล RodWai (เสือไว)

| ไฟล์ | ขนาด | ใช้ที่ |
|---|---|---|
| `profile-640.png` | 640×640 | รูปโปรไฟล์ LINE OA, Facebook, IG, TikTok |
| `facebook-cover.png` | 1640×624 | ภาพปกเพจ Facebook |
| `line-cover-1080x878.png` | 1080×878 | ภาพปก (Cover) LINE OA |
| `line-richmenu-2500x1686.png` | 2500×1686 | Rich menu LINE OA (แบบ 6 ช่อง) |
| `ig-01-intro.png` | 1080×1080 | โพสต์แนะนำแบรนด์ (FB/IG) |
| `ig-02-steps.png` | 1080×1080 | โพสต์ 4 ขั้นตอนขายรถ |
| `ig-03-finance.png` | 1080×1080 | โพสต์ขายรถติดไฟแนนซ์ |
| `ig-04-documents.png` | 1080×1080 | โพสต์เอกสารขายรถ |
| `ig-05-dealer.png` | 1080×1080 | โพสต์ชวนเต็นท์รถ |
| `story-01-sell.png` | 1080×1920 | IG/FB Story ฝั่งผู้ขาย |
| `story-02-dealer.png` | 1080×1920 | IG/FB Story ฝั่งเต็นท์ |

## ตั้ง Rich menu ใน LINE OA Manager
Home → Rich menu → Create → Template: **Large, 6 ช่อง (3×2)** → อัปโหลด `line-richmenu-2500x1686.png` แล้วตั้ง Action ทีละช่อง (Type: Link):

| ช่อง | ข้อความ | ลิงก์ |
|---|---|---|
| A (บนซ้าย) | ประเมินราคาฟรี | https://rodwai.com/prameen-rakha-rod |
| B (บนกลาง) | ขายรถติดไฟแนนซ์ | https://rodwai.com/khai-rod-tid-finance |
| C (บนขวา) | ขั้นตอนขายรถ | https://rodwai.com/#steps |
| D (ล่างซ้าย) | เอกสารที่ต้องใช้ | https://rodwai.com/blog/documents-for-selling-car |
| E (ล่างกลาง) | สำหรับเต็นท์รถ | https://rodwai.com/dealer |
| F (ล่างขวา) | เว็บไซต์ | https://rodwai.com |

## แก้ข้อความ / สร้างใหม่
แก้ข้อความใน `generate.js` แล้วรัน `node design/social/generate.js "$PWD/design"` จากโฟลเดอร์ repo
