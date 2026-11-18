import { createSign } from "node:crypto";

// Google Sheets as a tiny database for the care log.
// Tabs (row 1 is a header row):
//   users: username | password_hash | name | role (admin | caregiver | family)
//   log:   date | hour | value | note | updated_at | updated_by
//     date = YYYY-MM-DD, hour = "00".."23", value = -100..100 (empty = not recorded), note = free text

const SHEET_ID = process.env.CARE_SHEET_ID || "";
const SA_EMAIL = process.env.GOOGLE_SA_EMAIL || "";
const SA_KEY = (process.env.GOOGLE_SA_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const API = "https://sheets.googleapis.com/v4/spreadsheets";

export function sheetsConfigured() {
  return Boolean(SHEET_ID && SA_EMAIL && SA_KEY);
}

let cached: { token: string; exp: number } | null = null;

async function accessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.exp - 60 > now) return cached.token;
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: SA_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const sig = createSign("RSA-SHA256").update(unsigned).sign(SA_KEY).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Google auth failed: ${res.status}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: j.access_token, exp: now + j.expires_in };
  return j.access_token;
}

async function call(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API}/${SHEET_ID}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${await accessToken()}`, "content-type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Sheets API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

async function getRows(range: string): Promise<string[][]> {
  const j = (await call(`/values/${encodeURIComponent(range)}`)) as { values?: string[][] };
  return j.values || [];
}

// ---------- users ----------
export type Role = "admin" | "caregiver" | "family";
export type SheetUser = { username: string; hash: string; name: string; role: Role; row: number };

const asRole = (x: string): Role => { const r = (x || "").trim().toLowerCase(); return r === "admin" || r === "caregiver" ? r : "family"; };

export async function listUsers(): Promise<SheetUser[]> {
  const rows = await getRows("users!A2:D");
  const out: SheetUser[] = [];
  rows.forEach((r, i) => {
    const username = (r[0] || "").trim().toLowerCase();
    if (!username || !r[1]) return; // blank or deleted rows
    out.push({ username, hash: r[1].trim(), name: (r[2] || username).trim(), role: asRole(r[3]), row: i + 2 });
  });
  return out;
}

export async function findUser(username: string): Promise<SheetUser | null> {
  const u = username.trim().toLowerCase();
  return (await listUsers()).find((x) => x.username === u) || null;
}

// Add a user, or update an existing one (hash kept when not given).
export function saveUser(u: { username: string; name: string; role: Role; hash?: string }) {
  return serial(async () => {
    const cur = (await listUsers()).find((x) => x.username === u.username);
    if (cur) {
      const row = [u.username, u.hash || cur.hash, u.name, u.role];
      await call(`/values/${encodeURIComponent(`users!A${cur.row}:D${cur.row}`)}?valueInputOption=RAW`, { method: "PUT", body: JSON.stringify({ values: [row] }) });
    } else {
      if (!u.hash) throw new Error("password required for new user");
      await call(`/values/${encodeURIComponent("users!A:D")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, { method: "POST", body: JSON.stringify({ values: [[u.username, u.hash, u.name, u.role]] }) });
    }
  });
}

export function deleteUser(username: string) {
  return serial(async () => {
    const cur = (await listUsers()).find((x) => x.username === username);
    if (!cur) return;
    await call(`/values/${encodeURIComponent(`users!A${cur.row}:D${cur.row}`)}:clear`, { method: "POST", body: "{}" });
  });
}

// ---------- log ----------
export type DayData = { hours: Record<string, number>; notes: Record<string, string>; updatedAt?: string; updatedBy?: string };

// Column D used to hold TRUE/FALSE for "took medicine"; old rows read as a note.
function noteOf(x: unknown): string {
  const s = String(x ?? "").trim();
  if (s.toUpperCase() === "TRUE") return "กินยา";
  if (s.toUpperCase() === "FALSE") return "";
  return s;
}

export async function readDay(date: string): Promise<DayData> {
  const rows = await getRows("log!A2:F");
  const out: DayData = { hours: {}, notes: {} };
  for (const r of rows) {
    if (r[0] !== date) continue;
    const h = String(r[1] || "").padStart(2, "0");
    const v = r[2] === undefined || r[2] === "" ? NaN : Number(r[2]);
    if (Number.isFinite(v)) out.hours[h] = Math.max(-100, Math.min(100, Math.round(v)));
    else delete out.hours[h];
    const n = noteOf(r[3]);
    if (n) out.notes[h] = n; else delete out.notes[h];
    if (r[4] && (!out.updatedAt || r[4] > out.updatedAt)) { out.updatedAt = r[4]; out.updatedBy = r[5]; }
  }
  return out;
}

// Writes are serialised inside one server instance so two quick edits cannot append the same row twice.
let queue: Promise<unknown> = Promise.resolve();
function serial<T>(fn: () => Promise<T>): Promise<T> {
  const job = queue.then(fn);
  queue = job.catch(() => {});
  return job;
}

export function writeHour(date: string, hour: string, value: number | null, note: string, by: string) {
  return serial(async () => {
    const keys = await getRows("log!A2:B");
    let idx = -1;
    keys.forEach((r, i) => { if (r[0] === date && String(r[1]).padStart(2, "0") === hour) idx = i; });
    const row = [date, hour, value === null ? "" : value, note, new Date().toISOString(), by];
    if (idx >= 0) {
      const n = idx + 2;
      await call(`/values/${encodeURIComponent(`log!A${n}:F${n}`)}?valueInputOption=RAW`, { method: "PUT", body: JSON.stringify({ values: [row] }) });
    } else {
      await call(`/values/${encodeURIComponent("log!A:F")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, { method: "POST", body: JSON.stringify({ values: [row] }) });
    }
  });
}
