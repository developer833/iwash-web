import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/download", "/prices", ...site.areas.map((a) => `/areas/${a.slug}`)];
  return pages.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "/prices" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/download" ? 0.9 : 0.7,
  }));
}
