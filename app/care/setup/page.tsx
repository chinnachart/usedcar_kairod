"use client";

import { useEffect, useState } from "react";

export default function CareSetup() {
  const [state, setState] = useState<"loading" | "open" | "closed" | "unconfigured" | "error">("loading");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/care/setup", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setState(!j.configured ? "unconfigured" : j.open ? "open" : "closed"))
      .catch(() => setState("error"));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/care/setup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, name, username: username.trim().toLowerCase(), password }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setError(j.error || "ตั้งค่าไม่สำเร็จ"); setBusy(false); return; }
      window.location.href = "/care/admin";
    } catch {
      setError("ไม่มีอินเทอร์เน็ต ลองใหม่อีกครั้ง"); setBusy(false);
    }
  }

  return (
    <div className="care-wrap care-login">
      <div className="care-login-card">
        <h1>ตั้งค่าครั้งแรก</h1>
        {state === "loading" && <p className="care-sub">กำลังตรวจสอบ…</p>}
        {state === "unconfigured" && <p className="care-error">เว็บยังไม่ได้ตั้งค่า Google Sheet บน Vercel</p>}
        {state === "error" && <p className="care-error">เชื่อมต่อ Google Sheet ไม่ได้ ตรวจว่าแชร์ชีตให้ Service Account แล้ว</p>}
        {state === "closed" && (
          <>
            <p className="care-sub">ระบบมีผู้ดูแลแล้ว ให้ผู้ดูแลระบบเพิ่มบัญชีให้คุณ</p>
            <a className="care-primary care-btnlink" href="/care/login">ไปหน้าเข้าสู่ระบบ</a>
          </>
        )}
        {state === "open" && (
          <>
            <p className="care-sub">สร้างบัญชีผู้ดูแลระบบคนแรก ใช้ได้ครั้งเดียว หลังจากนั้นเพิ่มคนอื่นได้ในหน้าจัดการผู้ใช้</p>
            <form onSubmit={submit} className="care-form">
              <label htmlFor="cs-code">รหัสตั้งค่า</label>
              <input id="cs-code" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" autoCapitalize="none" required />
              <small className="care-sub">คือค่า CARE_SESSION_SECRET ที่ตั้งไว้บน Vercel</small>
              <label htmlFor="cs-name">ชื่อที่แสดง</label>
              <input id="cs-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น ชินชาติ" />
              <label htmlFor="cs-user">ชื่อผู้ใช้</label>
              <input id="cs-user" value={username} onChange={(e) => setUsername(e.target.value)} autoCapitalize="none" autoComplete="username" required />
              <label htmlFor="cs-pass">รหัสผ่าน (อย่างน้อย 6 ตัว)</label>
              <input id="cs-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={6} required />
              {error && <p className="care-error" role="alert">{error}</p>}
              <button className="care-primary" type="submit" disabled={busy}>{busy ? "กำลังสร้าง…" : "สร้างบัญชีผู้ดูแลระบบ"}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
