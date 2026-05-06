import { NextResponse } from "next/server";

const CF_DOWN_URL = "https://speed.cloudflare.com/__down?bytes=25000000"; // 25 MB

// Streams Cloudflare's download payload through to the browser.
// Data path: Cloudflare → (internet) → this server → (localhost) → browser.
// Since server and browser are on the same machine, the internet leg IS the
// user's download speed. No CORS issues because the browser talks to localhost.
export async function GET() {
  const cfRes = await fetch(CF_DOWN_URL, { cache: "no-store" });

  if (!cfRes.ok || !cfRes.body) {
    return NextResponse.json(
      { error: `Cloudflare download failed: HTTP ${cfRes.status}` },
      { status: 502 }
    );
  }

  const contentLength =
    cfRes.headers.get("content-length") ?? "25000000";

  return new NextResponse(cfRes.body, {
    status: 200,
    headers: {
      "Content-Type":   "application/octet-stream",
      "Content-Length": contentLength,
      "Cache-Control":  "no-store, no-cache, must-revalidate",
      "X-Source":       "speed.cloudflare.com",
    },
  });
}
