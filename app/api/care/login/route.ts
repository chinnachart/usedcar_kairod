import { NextResponse } from "next/server";
import { verifyPassword, makeSessionToken, SESSION_COOKIE } from "@/lib/care/auth";
import { findUser, sheetsConfigured } from "@/lib/care/sheets";

export const runtime = "nodejs";

// Slow down password guessing: after 5 failures from one IP, refuse for 10 minutes (per server instance).
const fails = new Map<string, { n: number; until: number }>();

export async function POST(req: Request) {
  if (!sheetsConfigured() || !process.env.CARE_SESSION_SECRET) {
    return NextResponse.json({ error: "ระบบยังไม่ได้ตั้งค่า (Google Sheet / secret)" }, { status: 503 });
  }
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  const f = fails.get(ip);
  if (f && f.n >= 5 && f.until > Date.now()) {
    return NextResponse.json({ error: "ลองผิดหลายครั้งเกินไป รอ 10 นาทีแล้วลองใหม่" }, { status: 429 });
  }

  let body: { username?: string; password?: string };
  try { body = await req.json(); } catch { body = {}; }
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  if (!username || !password) return NextResponse.json({ error: "กรอกชื่อผู้ใช้และรหัสผ่าน" }, { status: 400 });

  let user;
  try { user = await findUser(username); }
  catch { return NextResponse.json({ error: "เชื่อมต่อ Google Sheet ไม่ได้ ลองใหม่อีกครั้ง" }, { status: 502 }); }

  if (!user || !(await verifyPassword(password, user.hash))) {
    const cur = fails.get(ip);
    const n = cur && cur.until > Date.now() ? cur.n + 1 : 1;
    fails.set(ip, { n, until: Date.now() + 10 * 60 * 1000 });
    return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }
  fails.delete(ip);

  const { token, maxAge } = makeSessionToken({ u: user.username, n: user.name, r: user.role });
  const res = NextResponse.json({ ok: true, name: user.name, role: user.role });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge });
  return res;
}
