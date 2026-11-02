import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";
import { DISTRICTS } from "@/lib/districts";
import { BRANDS } from "@/lib/brands";
import { POSTS } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: abs("/"), lastModified: now, priority: 1 },
    { url: abs("/prameen-rakha-rod"), lastModified: now, priority: 0.9 },
    { url: abs("/khai-rod-tid-finance"), lastModified: now, priority: 0.9 },
    { url: abs("/khet"), lastModified: now, priority: 0.8 },
    { url: abs("/dealer"), lastModified: now, priority: 0.8 },
    { url: abs("/about"), lastModified: now, priority: 0.7 },
    { url: abs("/privacy"), lastModified: now, priority: 0.2 },
    ...DISTRICTS.map((d) => ({ url: abs(`/khet/${d.slug}`), lastModified: now, priority: 0.7 })),
    ...BRANDS.map((b) => ({ url: abs(`/brand/${b.slug}`), lastModified: now, priority: 0.7 })),
    { url: abs("/blog"), lastModified: now, priority: 0.6 },
    ...POSTS.map((p) => ({ url: abs(`/blog/${p.slug}`), lastModified: new Date(p.date), priority: 0.6 })),
  ];
}
