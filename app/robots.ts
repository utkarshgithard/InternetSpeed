import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://speedpulse.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep API routes out of search index — they serve binary data, not content
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
