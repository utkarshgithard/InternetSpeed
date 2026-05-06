import { NextRequest, NextResponse } from "next/server";

const CF_UP_URL = "https://speed.cloudflare.com/__up";

// Receives the client's upload payload and forwards it to Cloudflare.
// Data path: browser → (localhost) → this server → (internet) → Cloudflare.
// The browser-to-server leg is negligible (loopback), so the measured time
// equals the server→Cloudflare upload time, which IS the user's upload speed.
//
// This also completely avoids the CORS preflight failure that occurs when
// the browser tries to POST binary data directly to speed.cloudflare.com.
export async function POST(req: NextRequest) {
  let body: ArrayBuffer;

  try {
    body = await req.arrayBuffer();
  } catch {
    return NextResponse.json(
      { error: "Failed to read request body" },
      { status: 400 }
    );
  }

  const t0 = Date.now();

  let cfRes: Response;
  try {
    cfRes = await fetch(CF_UP_URL, {
      method:  "POST",
      body,
      headers: { "Content-Type": "application/octet-stream" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Cloudflare upload request failed: ${String(err)}` },
      { status: 502 }
    );
  }

  if (!cfRes.ok) {
    return NextResponse.json(
      { error: `Cloudflare upload returned HTTP ${cfRes.status}` },
      { status: 502 }
    );
  }

  const uploadDuration = Date.now() - t0; // ms the server took to push data to CF

  return NextResponse.json(
    {
      success:  true,
      bytes:    body.byteLength,
      duration: uploadDuration,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
