"use client";
import { useState } from "react";
import { BRANDS } from "@/lib/brands";
import { DISTRICTS } from "@/lib/districts";
import { lineMessageUrl } from "@/lib/site";
import { track } from "@/lib/track";

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 25 }, (_, i) => String(THIS_YEAR - i));
const MILEAGE = ["ต่ำกว่า 50,000 กม.", "50,000–100,000 กม.", "100,000–150,000 กม.", "150,000–200,000 กม.", "มากกว่า 200,000 กม."];

export default function ValuationForm({
  defaultBrand = "",
  defaultDistrict = "",
  source = "form",
  title = "ประเมินราคารถฟรี ภายในไม่กี่นาที",
}: { defaultBrand?: string; defaultDistrict?: string; source?: string; title?: string }) {
  const [brand, setBrand] = useState(defaultBrand);
  const [sent, setSent] = useState(false);
  const models = BRANDS.find((b) => b.name === brand)?.models ?? [];

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) || "").trim() || "-";
    const text = [
      "สวัสดีครับ/ค่ะ ขอประเมินราคารถ",
      `ยี่ห้อ: ${v("brand")}`,
      `รุ่น: ${v("model")}`,
      `ปี: ${v("year")}`,
      `เลขไมล์: ${v("mileage")}`,
      `ไฟแนนซ์: ${v("finance")}`,
      `เขต: ${v("district")}`,
      `เบอร์ติดต่อ: ${v("phone")}`,
      "(จะส่งรูปรถตามไปค่ะ/ครับ)",
    ].join("\n");
    track("generate_lead", { method: "valuation_form", source, brand: v("brand") });
    setSent(true);
    window.open(lineMessageUrl(text), "_blank", "noopener");
  }

  return (
    <form className="valuation-form" onSubmit={onSubmit} id="prameen">
      <p className="form-title">{title}</p>
      <div className="form-grid">
        <label>ยี่ห้อ
          <select name="brand" required value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">เลือกยี่ห้อ</option>
            {BRANDS.map((b) => <option key={b.slug} value={b.name}>{b.name}</option>)}
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </label>
        <label>รุ่น
          <input name="model" list="model-list" placeholder="เช่น Yaris, City, D-Max" required />
          <datalist id="model-list">{models.map((m) => <option key={m} value={m} />)}</datalist>
        </label>
        <label>ปีรถ (ค.ศ.)
          <select name="year" required defaultValue="">
            <option value="">เลือกปี</option>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
            <option value={`ก่อน ${THIS_YEAR - 24}`}>ก่อน {THIS_YEAR - 24}</option>
          </select>
        </label>
        <label>เลขไมล์
          <select name="mileage" defaultValue="">
            <option value="">ไม่ระบุ</option>
            {MILEAGE.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label>สถานะไฟแนนซ์
          <select name="finance" defaultValue="ปลอดภาระ (มีเล่ม)">
            <option>ปลอดภาระ (มีเล่ม)</option>
            <option>ยังติดไฟแนนซ์</option>
          </select>
        </label>
        <label>เขตที่อยู่รถ
          <select name="district" defaultValue={defaultDistrict}>
            <option value="">เลือกเขต</option>
            {DISTRICTS.map((d) => <option key={d.slug} value={d.th}>{d.th}</option>)}
          </select>
        </label>
        <label className="span-2">เบอร์โทร (ไม่บังคับ)
          <input name="phone" type="tel" inputMode="tel" placeholder="08x-xxx-xxxx" />
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>ยินยอมให้รถไวใช้ข้อมูลนี้เพื่อติดต่อกลับ และส่งข้อมูลรถ (ไม่รวมชื่อและเบอร์) ให้เต็นท์พาร์ทเนอร์เพื่อเสนอราคา ตาม <a href="/privacy" target="_blank">นโยบายความเป็นส่วนตัว</a></span>
      </label>
      <button type="submit" className="btn btn-line btn-block">ส่งข้อมูลทาง LINE เพื่อรับราคา</button>
      <p className="form-note">
        {sent
          ? "เปิด LINE แล้ว กด “ส่ง” ในแชทได้เลย แล้วแนบรูปรถรอบคัน + หน้าปัดเลขไมล์ จะได้ราคาที่แม่นยำขึ้น"
          : "กดปุ่มแล้วระบบจะเปิด LINE พร้อมข้อความที่กรอกไว้ ไม่มีค่าใช้จ่ายและไม่มีข้อผูกมัด"}
      </p>
    </form>
  );
}
