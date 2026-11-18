import { createHmac, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const SESSION_COOKIE = "care_session";
const SESSION_DAYS = 30;

export type Session = { u: string; n: string; r: "admin" | "caregiver" | "family"; exp: number };

function secret() {
  const s = process.env.CARE_SESSION_SECRET || "";
  if (s.length < 32) throw new Error("CARE_SESSION_SECRET must be at least 32 characters");
  return s;
}

// password hash format: scrypt$<salt base64>$<hash base64>  (make one with: npm run care:hash)
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, saltB64, hashB64] = stored.split("$");
  if (alg !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const got = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length);
  return got.length === expected.length && timingSafeEqual(got, expected);
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function makeSessionToken(s: Omit<Session, "exp">): { token: string; maxAge: number } {
  const maxAge = SESSION_DAYS * 86400;
  const payload = Buffer.from(JSON.stringify({ ...s, exp: Math.floor(Date.now() / 1000) + maxAge })).toString("base64url");
  return { token: `${payload}.${sign(payload)}`, maxAge };
}

export function readSessionToken(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const good = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (good.length !== given.length || !timingSafeEqual(good, given)) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    if (!s.exp || s.exp < Date.now() / 1000) return null;
    return s;
  } catch {
    return null;
  }
}

export async function currentSession(): Promise<Session | null> {
  const jar = await cookies();
  try {
    return readSessionToken(jar.get(SESSION_COOKIE)?.value);
  } catch {
    return null;
  }
}

export const canWrite = (s: Session) => s.r === "admin" || s.r === "caregiver";
