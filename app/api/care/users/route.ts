import { NextResponse } from "next/server";
import { currentSession, hashPassword, USERNAME_RE, MIN_PASSWORD } from "@/lib/care/auth";
import { listUsers, findUser, saveUser, deleteUser, type Role } from "@/lib/care/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLES: Role[] = ["admin", "caregiver", "family"];
const err = (error: string, status: number) => NextResponse.json({ error }, { status });

// Only someone who is still an admin in the Sheet right now may manage users.
async function requireAdmin() {
  const s = await currentSession();
  if (!s) return { error: err("กรุณาเข้าสู่ระบบ", 401) };
  const me = await findUser(s.u).catch(() => null);
  if (!me || me.role !== "admin") return { error: err("เฉพาะผู้ดูแลระบบเท่านั้น", 403) };
  return { me };
}

export async function GET() {
  const a = await requireAdmin();
  if (a.error) return a.error;
  try {
    const users = (await listUsers()).map(({ username, name, role }) => ({ username, name, role }));
    return NextResponse.json({ users, me: a.me.username });
  } catch {
    return err("อ่าน Google Sheet ไม่ได้", 502);
  }
}

// Body: { username, name, role, password? } — creates the user, or updates name/role (and password when given)
export async function POST(req: Request) {
  const a = await requireAdmin();
  if (a.error) return a.error;
  let b: { username?: string; name?: string; role?: string; password?: string };
  try { b = await req.json(); } catch { b = {}; }
  const username = String(b.username || "").trim().toLowerCase();
  const name = String(b.name || "").trim().slice(0, 60) || username;
  const role = String(b.role || "") as Role;
  const password = String(b.password || "");
  if (!USERNAME_RE.test(username)) return err("ชื่อผู้ใช้ต้องเป็นอังกฤษตัวเล็ก ตัวเลข . _ - ยาว 3–32 ตัว", 400);
  if (!ROLES.includes(role)) return err("เลือกสิทธิ์ให้ถูกต้อง", 400);
  if (password && password.length < MIN_PASSWORD) return err(`รหัสผ่านต้องยาวอย่างน้อย ${MIN_PASSWORD} ตัว`, 400);
  if (username === a.me.username && role !== "admin") return err("เปลี่ยนสิทธิ์ของตัวเองออกจากผู้ดูแลระบบไม่ได้", 400);
  try {
    const exists = await findUser(username);
    if (!exists && !password) return err("ผู้ใช้ใหม่ต้องตั้งรหัสผ่าน", 400);
    await saveUser({ username, name, role, hash: password ? await hashPassword(password) : undefined });
    return NextResponse.json({ ok: true, created: !exists });
  } catch {
    return err("บันทึกลง Google Sheet ไม่สำเร็จ", 502);
  }
}

// Body: { username }
export async function DELETE(req: Request) {
  const a = await requireAdmin();
  if (a.error) return a.error;
  let b: { username?: string };
  try { b = await req.json(); } catch { b = {}; }
  const username = String(b.username || "").trim().toLowerCase();
  if (username === a.me.username) return err("ลบบัญชีของตัวเองไม่ได้", 400);
  try {
    await deleteUser(username);
    return NextResponse.json({ ok: true });
  } catch {
    return err("ลบไม่สำเร็จ", 502);
  }
}
