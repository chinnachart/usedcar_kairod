"use client";
import { lineAddFriendUrl } from "@/lib/site";
import { track } from "@/lib/track";

export default function LineLink({
  className = "btn btn-line",
  children = "แอด LINE ขอราคา",
  source = "button",
}: { className?: string; children?: React.ReactNode; source?: string }) {
  return (
    <a
      href={lineAddFriendUrl()}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={() => track("generate_lead", { method: "line_add", source })}
    >
      {children}
    </a>
  );
}
