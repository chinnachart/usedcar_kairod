import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { hashPassword, makeSessionToken, SESSION_COOKIE, USERNAME_RE, MIN_PASSWORD } from "@/lib/care/auth";
import { listUsers, saveUser, sheetsConfigured } from "@/lib/care/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const err = (error: string, status: number) => NextResponse.json({ error }, { status });

// First-time setup: creates the first admin. Works only while the users tab is empty,
// and only for someone who knows CARE_SESSION_SECRET (set by the site owner on Vercel).
export async function GET() {
  if (!sheetsConfigured()) return NextResponse.json({ open: false, configured: false });
  try {
    return NextResponse.json({ open: (await listUsers()).length === 0, configured: true });
  } catch {
    return err("เชื่อมต่อ Google Sheet ไม่ได้", 502);
  }
}

let attempts = 0;

export async function POST(req: Request) {
  const secret = process.env.CARE_SESSION_SECRET || "";
  if (!sheetsConfigured() || secret.length < 32) return err("ระบบยังไม่ได้ตั้งค่า (Google Sheet / secret)", 503);
  if (attempts >= 10) return err("ลองหลายครั้งเกินไป ให้ deploy ใหม่แล้วลองอีกครั้ง", 429);

  let b: { code?: string; username?: string; name?: string; password?: string };
  try { b = await req.json(); } catch { b = {}; }
  const code = Buffer.from(String(b.code || "").trim());
  const want = Buffer.from(secret);
  if (code.length !== want.length || !timingSafeEqual(code, want)) {
    attempts++;
    return err("รหัสตั้งค่าไม่ถูกต้อง", 401);
  }
  const username = String(b.username || "").trim().toLowerCase();
  const name = String(b.name || "").trim().slice(0, 60) || username;
  const password = String(b.password || "");
  if (!USERNAME_RE.test(username)) return err("ชื่อผู้ใช้ต้องเป็นอังกฤษตัวเล็ก ตัวเลข . _ - ยาว 3–32 ตัว", 400);
  if (password.length < MIN_PASSWORD) return err(`รหัสผ่านต้องยาวอย่างน้อย ${MIN_PASSWORD} ตัว`, 400);

  try {
    if ((await listUsers()).length > 0) return err("ตั้งค่าไปแล้ว ให้ผู้ดูแลระบบเพิ่มบัญชีให้", 409);
    await saveUser({ username, name, role: "admin", hash: await hashPassword(password) });
  } catch {
    return err("บันทึกลง Google Sheet ไม่สำเร็จ", 502);
  }
  const { token, maxAge } = makeSessionToken({ u: username, n: name, r: "admin" });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge });
  return res;
}
