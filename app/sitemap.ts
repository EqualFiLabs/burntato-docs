import type { MetadataRoute } from "next";

import { getAllPages, getPageHref } from "@/lib/docs";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAllPages();
  const latestUpdate = pages.reduce(
    (latest, page) => (page.updated > latest ? page.updated : latest),
    "1970-01-01",
  );

  return [
    { url: `${SITE_URL}/`, lastModified: latestUpdate },
    ...pages.map((page) => ({
      url: `${SITE_URL}${getPageHref(page)}/`,
      lastModified: page.updated,
    })),
  ];
}
