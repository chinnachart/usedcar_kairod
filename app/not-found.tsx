import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container section">
      <h1>ไม่พบหน้านี้</h1>
      <p><Link href="/">กลับหน้าแรก</Link> หรือ <Link href="/prameen-rakha-rod">ประเมินราคารถฟรี</Link></p>
    </div>
  );
}
