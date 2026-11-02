"use client";
import { usePathname } from "next/navigation";
import { SITE, lineAddFriendUrl } from "@/lib/site";
import { track } from "@/lib/track";

export default function FloatingCta() {
  const path = usePathname();
  if (path?.startsWith("/dealer")) {
    return (
      <div className="floating-cta" role="complementary" aria-label="สมัครพาร์ทเนอร์">
        <a className="btn btn-accent" href="#samak">สมัครเป็นเต็นท์พาร์ทเนอร์ ฟรี</a>
      </div>
    );
  }
  return (
    <div className="floating-cta" role="complementary" aria-label="ติดต่อเรา">
      {SITE.phone && (
        <a className="btn btn-call" href={`tel:${SITE.phone}`} onClick={() => track("generate_lead", { method: "call", source: "floating" })}>
          โทรเลย
        </a>
      )}
      <a className="btn btn-line" href={lineAddFriendUrl()} target="_blank" rel="noopener"
        onClick={() => track("generate_lead", { method: "line_add", source: "floating" })}>
        ประเมินราคาฟรีทาง LINE
      </a>
    </div>
  );
}
