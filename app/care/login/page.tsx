"use client";

import { useEffect, useState } from "react";

export default function CareLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [setupOpen, setSetupOpen] = useState(false);

  useEffect(() => {
    fetch("/api/care/setup", { cache: "no-store" }).then((r) => r.json()).then((j) => setSetupOpen(!!j.open)).catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/care/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setError(j.error || "เข้าสู่ระบบไม่สำเร็จ"); setBusy(false); return; }
      window.location.href = "/care";
    } catch {
      setError("ไม่มีอินเทอร์เน็ต ลองใหม่อีกครั้ง");
      setBusy(false);
    }
  }

  return (
    <div className="care-wrap care-login">
      <div className="care-login-card">
        <div className="care-login-mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="44" height="44">
            <path d="M4 26h9l4-10 6 20 5-14 3 4h13" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1>บันทึกดูแลคุณพ่อ</h1>
        <p className="care-sub">เข้าสู่ระบบเพื่อบันทึกหรือดูอาการรายชั่วโมง</p>
        <form onSubmit={submit} className="care-form">
          <label htmlFor="care-user">ชื่อผู้ใช้</label>
          <input id="care-user" autoComplete="username" autoCapitalize="none" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <label htmlFor="care-pass">รหัสผ่าน</label>
          <div className="care-pass">
            <input id="care-pass" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}>{show ? "ซ่อน" : "แสดง"}</button>
          </div>
          {error && <p className="care-error" role="alert">{error}</p>}
          <button className="care-primary" type="submit" disabled={busy}>{busy ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}</button>
        </form>
        {setupOpen ? (
          <p className="care-note">ยังไม่มีบัญชีในระบบ <a href="/care/setup">ตั้งค่าครั้งแรก (สร้างผู้ดูแลระบบ)</a></p>
        ) : (
          <p className="care-note">ลืมรหัสผ่านหรือยังไม่มีบัญชี ติดต่อผู้ดูแลระบบในครอบครัว</p>
        )}
      </div>
    </div>
  );
}
