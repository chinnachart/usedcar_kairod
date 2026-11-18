// Make a password hash for the "users" tab of the care Google Sheet.
// Usage: npm run care:hash -- "รหัสผ่านที่ต้องการ"
import { randomBytes, scryptSync } from "node:crypto";

const pw = process.argv[2];
if (!pw) {
  console.error('ใส่รหัสผ่านด้วย เช่น: npm run care:hash -- "MyPassword123"');
  process.exit(1);
}
const salt = randomBytes(16);
const hash = scryptSync(pw, salt, 32);
console.log(`scrypt$${salt.toString("base64")}$${hash.toString("base64")}`);
