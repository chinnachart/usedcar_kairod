"use client";
import { useState } from "react";
import { BRANDS } from "@/lib/brands";
import { lineMessageUrl } from "@/lib/site";
import { track } from "@/lib/track";

const VOLUME = ["1–5 คัน/เดือน", "6–15 คัน/เดือน", "16–30 คัน/เดือน", "มากกว่า 30 คัน/เดือน"];
const TYPES = ["รถเก๋ง", "กระบะ", "SUV / PPV", "รถตู้", "รถยุโรป", "รถ EV / ไฮบริด"];

export default function DealerForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) || "").trim() || "-";
    const types = f.getAll("types").map(String).join(", ") || "-";
    const text = [
      "สนใจร่วมเป็นเต็นท์พาร์ทเนอร์ RodWai",
      `ชื่อเต็นท์: ${v("dealer")}`,
      `ผู้ติดต่อ: ${v("name")}`,
      `เบอร์โทร: ${v("phone")}`,
      `ที่ตั้งเต็นท์: ${v("location")}`,
      `ประเภทรถที่รับซื้อ: ${types}`,
      `ยี่ห้อที่เน้น: ${v("brands")}`,
      `จำนวนที่ต้องการรับซื้อ: ${v("volume")}`,
    ].join("\n");
    track("generate_lead", { method: "dealer_form", source: "dealer-page" });
    setSent(true);
    window.open(lineMessageUrl(text), "_blank", "noopener");
  }

  return (
    <form className="valuation-form" onSubmit={onSubmit} id="samak">
      <p className="form-title">สมัครเป็นเต็นท์พาร์ทเนอร์</p>
      <div className="form-grid">
        <label className="span-2">ชื่อเต็นท์ / บริษัท
          <input name="dealer" required placeholder="เช่น ดีคาร์ ลาดพร้าว" />
        </label>
        <label>ชื่อผู้ติดต่อ
          <input name="name" required />
        </label>
        <label>เบอร์โทร
          <input name="phone" type="tel" inputMode="tel" required placeholder="08x-xxx-xxxx" />
        </label>
        <label className="span-2">ที่ตั้งเต็นท์ (เขต / จังหวัด)
          <input name="location" required placeholder="เช่น บางนา กรุงเทพฯ" />
        </label>
        <fieldset className="span-2 checks-inline">
          <legend>ประเภทรถที่รับซื้อ</legend>
          {TYPES.map((t) => (
            <label key={t}><input type="checkbox" name="types" value={t} /> {t}</label>
          ))}
        </fieldset>
        <label>ยี่ห้อที่เน้น
          <input name="brands" list="dealer-brands" placeholder="เช่น Toyota, Honda" />
          <datalist id="dealer-brands">{BRANDS.map((b) => <option key={b.slug} value={b.name} />)}</datalist>
        </label>
        <label>จำนวนที่อยากรับซื้อ
          <select name="volume" defaultValue="">
            <option value="">ไม่ระบุ</option>
            {VOLUME.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
      </div>
      <button type="submit" className="btn btn-accent btn-block">ส่งใบสมัครทาง LINE</button>
      <p className="form-note">
        {sent ? "เปิด LINE แล้ว กด “ส่ง” ในแชท ทีมงานจะติดต่อกลับเพื่ออธิบายเงื่อนไขการเป็นพาร์ทเนอร์" : "ระบบจะเปิด LINE พร้อมข้อมูลที่กรอก สมัครฟรี ทีมงานจะติดต่อกลับ"}
      </p>
    </form>
  );
}
