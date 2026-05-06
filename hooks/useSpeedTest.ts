"use client";

import { useState, useCallback, useRef } from "react";

export type TestPhase =
  | "idle"
  | "ping"
  | "download"
  | "upload"
  | "complete"
  | "error";

export interface TestResult {
  ping: number | null;
  download: number | null;
  upload: number | null;
}

export interface TestHistory {
  timestamp: Date;
  ping: number;
  download: number;
  upload: number;
}

export interface SpeedTestState {
  phase: TestPhase;
  progress: number;
  currentSpeed: number;
  results: TestResult;
  history: TestHistory[];
  error: string | null;
}

// ─── Upload payload size ──────────────────────────────────────────────────────
// 5 MB sent to /api/upload, which forwards to speed.cloudflare.com/__up
const UPLOAD_BYTES = 5_000_000;

// ─── ping ─────────────────────────────────────────────────────────────────────
// Calls the server-side ping route, which times multiple requests to
// Cloudflare and returns the averaged latency in ms.
async function measurePing(): Promise<number> {
  const res = await fetch("/api/ping", { cache: "no-store" });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Ping failed: HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.latency as number;
}

// ─── download ─────────────────────────────────────────────────────────────────
// /api/download proxies Cloudflare's 25 MB stream. We read the stream
// chunk-by-chunk and report live speed + progress.
async function measureDownload(
  onProgress: (speedMbps: number, pct: number) => void
): Promise<number> {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 90_000);

  let t0: number | null = null;
  let received = 0;

  try {
    const res = await fetch("/api/download", {
      cache:  "no-store",
      signal: ctrl.signal,
    });

    if (!res.ok || !res.body) {
      throw new Error(`Download failed: HTTP ${res.status}`);
    }

    const contentLength =
      parseInt(res.headers.get("content-length") ?? "0", 10) || 25_000_000;

    t0 = performance.now();
    const reader = res.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      received += value.length;
      const elapsed   = (performance.now() - t0) / 1000;
      const speedMbps = (received * 8) / (elapsed * 1_000_000);
      onProgress(speedMbps, Math.min((received / contentLength) * 100, 99));
    }

    reader.releaseLock();
  } finally {
    clearTimeout(timeout);
  }

  const totalSecs = (performance.now() - (t0 ?? performance.now())) / 1000;
  return Math.round(((received * 8) / (totalSecs * 1_000_000)) * 100) / 100;
}

// ─── upload ───────────────────────────────────────────────────────────────────
// Sends UPLOAD_BYTES to /api/upload (same-origin, no CORS).
// The API route forwards the data to speed.cloudflare.com/__up server-side
// and returns how long that took, which we use to compute the upload speed.
async function measureUpload(
  onProgress: (speedMbps: number, pct: number) => void
): Promise<number> {
  // Build payload — 64 KB true-random, rest patterned
  const data = new Uint8Array(UPLOAD_BYTES);
  crypto.getRandomValues(data.subarray(0, Math.min(65536, UPLOAD_BYTES)));
  for (let i = 65536; i < UPLOAD_BYTES; i++) data[i] = i & 0xff;

  const clientStart = performance.now();

  // Fake progress while the single POST is in-flight
  const timer = setInterval(() => {
    const elapsed = (performance.now() - clientStart) / 1000;
    onProgress(
      (UPLOAD_BYTES * 8) / (elapsed * 1_000_000),
      Math.min((elapsed / 5) * 100, 95)
    );
  }, 120);

  let speedMbps: number;

  try {
    const res = await fetch("/api/upload", {
      method:  "POST",
      body:    data,
      headers: { "Content-Type": "application/octet-stream" },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `Upload failed: HTTP ${res.status}`);
    }

    const json = await res.json();

    // The API returns the duration the server spent uploading to Cloudflare,
    // which accurately reflects the user's real upload speed.
    const uploadDurationSecs = (json.duration as number) / 1000;
    speedMbps =
      Math.round(((UPLOAD_BYTES * 8) / (uploadDurationSecs * 1_000_000)) * 100) /
      100;
  } finally {
    clearInterval(timer);
  }

  return speedMbps;
}

// ─── hook ─────────────────────────────────────────────────────────────────────

export function useSpeedTest() {
  const [state, setState] = useState<SpeedTestState>({
    phase:        "idle",
    progress:     0,
    currentSpeed: 0,
    results:      { ping: null, download: null, upload: null },
    history:      [],
    error:        null,
  });

  const running = useRef(false);

  const runTest = useCallback(async () => {
    if (running.current) return;
    running.current = true;

    setState((prev) => ({
      phase:        "ping",
      progress:     0,
      currentSpeed: 0,
      results:      { ping: null, download: null, upload: null },
      history:      prev.history,
      error:        null,
    }));

    try {
      // ── PING ──────────────────────────────────────────────────────────────
      setState((prev) => ({ ...prev, phase: "ping", progress: 10 }));
      const pingMs = await measurePing();
      setState((prev) => ({
        ...prev,
        progress: 100,
        results:  { ...prev.results, ping: pingMs },
      }));

      await new Promise((r) => setTimeout(r, 350));

      // ── DOWNLOAD ──────────────────────────────────────────────────────────
      setState((prev) => ({
        ...prev,
        phase:        "download",
        progress:     0,
        currentSpeed: 0,
      }));

      const downloadMbps = await measureDownload((speed, pct) => {
        setState((prev) => ({
          ...prev,
          phase:        "download",
          progress:     pct,
          currentSpeed: speed,
        }));
      });

      setState((prev) => ({
        ...prev,
        progress:     100,
        currentSpeed: downloadMbps,
        results:      { ...prev.results, download: downloadMbps },
      }));

      await new Promise((r) => setTimeout(r, 350));

      // ── UPLOAD ────────────────────────────────────────────────────────────
      setState((prev) => ({
        ...prev,
        phase:        "upload",
        progress:     0,
        currentSpeed: 0,
      }));

      const uploadMbps = await measureUpload((speed, pct) => {
        setState((prev) => ({
          ...prev,
          phase:        "upload",
          progress:     pct,
          currentSpeed: speed,
        }));
      });

      // ── COMPLETE ──────────────────────────────────────────────────────────
      setState((prev) => ({
        ...prev,
        phase:        "complete",
        progress:     100,
        currentSpeed: uploadMbps,
        results:      { ping: pingMs, download: downloadMbps, upload: uploadMbps },
        history:      [
          ...prev.history,
          {
            timestamp: new Date(),
            ping:      pingMs,
            download:  downloadMbps,
            upload:    uploadMbps,
          },
        ].slice(-5),
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        phase: "error",
        error:
          err instanceof Error
            ? err.message
            : "Test failed — check your connection.",
      }));
    } finally {
      running.current = false;
    }
  }, []);

  return { state, runTest };
}
