"use client";

import { useCallback, useEffect, useState } from "react";

type Role = "admin" | "caregiver" | "family";
type User = { username: string; name: string; role: Role };

const ROLE_LABEL: Record<Role, string> = {
  admin: "ผู้ดูแลระบบ · บันทึกได้ + จัดการผู้ใช้",
  caregiver: "ผู้ดูแลคุณพ่อ · บันทึกได้",
  family: "ครอบครัว · ดูอย่างเดียว",
};
const ROLE_SHORT: Record<Role, string> = { admin: "ผู้ดูแลระบบ", caregiver: "บันทึกได้", family: "ดูอย่างเดียว" };

// easy-to-read password: no 0/O, 1/l/I
function makePassword() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  const a = new Uint32Array(8);
  crypto.getRandomValues(a);
  return Array.from(a, (n) => chars[n % chars.length]).join("");
}

export default function AdminApp() {
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // form: either a new user or editing one
  const [editing, setEditing] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("caregiver");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [shared, setShared] = useState<{ username: string; password: string } | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/care/users", { cache: "no-store" });
      if (res.status === 401) { window.location.href = "/care/login"; return; }
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      setUsers(j.users);
      setMe(j.me);
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message || "โหลดรายชื่อไม่สำเร็จ" });
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  function startNew() {
    setEditing(null); setUsername(""); setName(""); setRole("caregiver"); setPassword(makePassword()); setShared(null); setMsg(null);
    document.getElementById("care-uform")?.scrollIntoView({ behavior: "smooth" });
  }
  function startEdit(u: User) {
    setEditing(u.username); setUsername(u.username); setName(u.name); setRole(u.role); setPassword(""); setShared(null); setMsg(null);
    document.getElementById("care-uform")?.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(() => { setPassword(makePassword()); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      const res = await fetch("/api/care/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: username.trim().toLowerCase(), name, role, password }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "บันทึกไม่สำเร็จ");
      if (password) setShared({ username: username.trim().toLowerCase(), password });
      setMsg({ kind: "ok", text: j.created ? `เพิ่ม ${name || username} แล้ว` : `บันทึกการแก้ไข ${name || username} แล้ว` });
      setEditing(null); setUsername(""); setName(""); setRole("caregiver"); setPassword(makePassword());
      load();
    } catch (e) {
      setMsg({ kind: "err", text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function remove(u: string) {
    setConfirmDel(null); setMsg(null);
    const res = await fetch("/api/care/users", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ username: u }) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg({ kind: "err", text: j.error || "ลบไม่สำเร็จ" }); return; }
    setMsg({ kind: "ok", text: `ลบ ${u} แล้ว` });
    load();
  }

  const shareText = shared
    ? `เข้าใช้บันทึกดูแลคุณพ่อ\n${typeof window !== "undefined" ? window.location.origin : ""}/care\nชื่อผู้ใช้: ${shared.username}\nรหัสผ่าน: ${shared.password}`
    : "";
  const [copied, setCopied] = useState(false);
  async function copyShare() {
    try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }

  return (
    <div className="care-wrap">
      <header className="care-top">
        <div>
          <h1>จัดการผู้ใช้</h1>
          <p className="care-sub">เพิ่มคน เปลี่ยนรหัสผ่าน หรือเปลี่ยนสิทธิ์</p>
        </div>
        <a className="care-ghost care-sm" href="/care">← กลับไปหน้ากราฟ</a>
      </header>

      {msg && <p className={msg.kind === "ok" ? "care-okmsg" : "care-error"} role="status">{msg.text}</p>}

      {shared && (
        <section className="care-share">
          <p><b>ส่งข้อมูลนี้ให้ {shared.username}</b> (รหัสผ่านจะไม่แสดงอีก คัดลอกไว้ตอนนี้)</p>
          <pre>{shareText}</pre>
          <button className="care-ghost" type="button" onClick={copyShare}>{copied ? "คัดลอกแล้ว" : "คัดลอกไปส่ง LINE"}</button>
        </section>
      )}

      <section className="care-card">
        <div className="care-card-head">
          <h2>ผู้ใช้ทั้งหมด</h2>
          <button className="care-ghost care-sm" type="button" onClick={startNew}>+ เพิ่มผู้ใช้</button>
        </div>
        {loading ? <p className="care-sub">กำลังโหลด…</p> : (
          <ul className="care-users">
            {users.map((u) => (
              <li key={u.username}>
                <div className="care-u-main">
                  <b>{u.name}</b>{u.username === me && <span className="care-me">คุณ</span>}
                  <span className="care-sub">{u.username}</span>
                </div>
                <span className={`care-role r-${u.role}`}>{ROLE_SHORT[u.role]}</span>
                <div className="care-u-act">
                  <button type="button" className="care-link" onClick={() => startEdit(u)}>แก้ไข / เปลี่ยนรหัส</button>
                  {u.username !== me && (confirmDel === u.username ? (
                    <>
                      <button type="button" className="care-link care-danger" onClick={() => remove(u.username)}>ยืนยันลบ</button>
                      <button type="button" className="care-link" onClick={() => setConfirmDel(null)}>ยกเลิก</button>
                    </>
                  ) : (
                    <button type="button" className="care-link" onClick={() => setConfirmDel(u.username)}>ลบ</button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form id="care-uform" className="care-card care-form" onSubmit={submit}>
        <h2>{editing ? `แก้ไข ${editing}` : "เพิ่มผู้ใช้ใหม่"}</h2>
        <label htmlFor="cu-name">ชื่อที่แสดง</label>
        <input id="cu-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น พี่สมฤดี" />
        <label htmlFor="cu-user">ชื่อผู้ใช้ (ใช้ล็อกอิน)</label>
        <input id="cu-user" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="เช่น somrudee"
          autoCapitalize="none" autoComplete="off" readOnly={!!editing} required />
        <small className="care-sub">อังกฤษตัวเล็ก ตัวเลข . _ - ยาว 3–32 ตัว</small>
        <label>สิทธิ์</label>
        <div className="care-roles">
          {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
            <label key={r} className="care-radio">
              <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} disabled={editing === me && r !== "admin"} />
              <span>{ROLE_LABEL[r]}</span>
            </label>
          ))}
        </div>
        <label htmlFor="cu-pass">{editing ? "รหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)" : "รหัสผ่าน"}</label>
        <div className="care-pass">
          <input id="cu-pass" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required={!editing} minLength={6} />
          <button type="button" onClick={() => setPassword(makePassword())}>สุ่มใหม่</button>
        </div>
        <div className="care-row-btns">
          <button className="care-primary" type="submit" disabled={busy}>{busy ? "กำลังบันทึก…" : editing ? "บันทึกการแก้ไข" : "เพิ่มผู้ใช้"}</button>
          {editing && <button className="care-ghost" type="button" onClick={startNew}>ยกเลิก</button>}
        </div>
      </form>
    </div>
  );
}
