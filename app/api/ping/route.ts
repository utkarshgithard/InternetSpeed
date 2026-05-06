import { NextResponse } from "next/server";

// Measures server-side RTT to Cloudflare's trace endpoint.
// Because Next.js runs on the same machine as the browser, this == real internet latency.
export async function GET() {
  const samples: number[] = [];

  for (let i = 0; i < 6; i++) {
    const t0 = Date.now();
    const res = await fetch("https://speed.cloudflare.com/cdn-cgi/trace", {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Cloudflare ping failed: HTTP ${res.status}` },
        { status: 502 }
      );
    }
    await res.text(); // drain body so connection can be reused
    samples.push(Date.now() - t0);

    if (i < 5) await new Promise((r) => setTimeout(r, 80));
  }

  // Trim fastest + slowest, average the rest
  samples.sort((a, b) => a - b);
  const trimmed = samples.slice(1, -1);
  const avg = Math.round(trimmed.reduce((a, b) => a + b, 0) / trimmed.length);

  return NextResponse.json(
    { latency: avg, samples },
    { headers: { "Cache-Control": "no-store" } }
  );
}
