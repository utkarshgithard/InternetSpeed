"use client";

import { useSpeedTest } from "@/hooks/useSpeedTest";
import { SpeedGauge } from "@/components/SpeedGauge";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultCard } from "@/components/ResultCard";
import { HistoryTable } from "@/components/HistoryTable";

function NetworkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28" height="28">
      <defs>
        <linearGradient id="navArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6"/>
          <stop offset="50%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
      {/* Speed arc */}
      <path d="M 101 370 A 175 175 0 1 1 411 370"
        fill="none" stroke="url(#navArcGrad)" strokeWidth="28"
        strokeLinecap="round" opacity="0.9"/>
      {/* Needle */}
      <g transform="translate(256,270)">
        <line x1="0" y1="0" x2="-110" y2="-130"
          stroke="#06b6d4" strokeWidth="14" strokeLinecap="round"/>
        <circle cx="-110" cy="-130" r="14" fill="#06b6d4"/>
        <circle cx="0" cy="0" r="22" fill="#1e2a40" stroke="#3b82f6" strokeWidth="5"/>
        <circle cx="0" cy="0" r="9" fill="#06b6d4"/>
      </g>
      {/* WiFi rings */}
      <g transform="translate(256,348)" opacity="0.85">
        <path d="M -52 0 A 52 52 0 0 1 52 0" fill="none" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round"/>
        <path d="M -33 0 A 33 33 0 0 1 33 0" fill="none" stroke="#06b6d4" strokeWidth="12" strokeLinecap="round"/>
        <path d="M -15 0 A 15 15 0 0 1 15 0" fill="none" stroke="#06b6d4" strokeWidth="12" strokeLinecap="round"/>
        <circle cx="0" cy="0" r="8" fill="#06b6d4"/>
      </g>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
  );
}

function PingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 0 1 0-5.303m5.304 0a3.75 3.75 0 0 1 0 5.303m-7.425 2.122a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.789M12 12h.008v.008H12V12Z" />
    </svg>
  );
}

function StartIcon({ spinning }: { spinning: boolean }) {
  if (spinning) {
    return (
      <svg className="spin-slow" width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
    </svg>
  );
}

function PhaseStepIndicator({ label, status }: { label: string; status: "idle" | "active" | "done" }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          status === "done"
            ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            : status === "active"
            ? "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)] pulse-ring"
            : "bg-slate-700"
        }`}
      />
      <span
        className={`text-xs font-medium transition-colors duration-300 ${
          status === "done"
            ? "text-emerald-400"
            : status === "active"
            ? "text-blue-300"
            : "text-slate-600"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function getPhaseStatus(
  currentPhase: string,
  targetPhase: string,
  results: { ping: number | null; download: number | null; upload: number | null }
): "idle" | "active" | "done" {
  const resultMap: Record<string, number | null> = {
    ping: results.ping,
    download: results.download,
    upload: results.upload,
  };
  if (resultMap[targetPhase] !== null) return "done";
  if (currentPhase === targetPhase) return "active";
  return "idle";
}

export default function Home() {
  const { state, runTest } = useSpeedTest();
  const { phase, progress, currentSpeed, results, history, error } = state;

  const isRunning = ["ping", "download", "upload"].includes(phase);
  const isComplete = phase === "complete";

  const pingStatus = getPhaseStatus(phase, "ping", results);
  const downloadStatus = getPhaseStatus(phase, "download", results);
  const uploadStatus = getPhaseStatus(phase, "upload", results);

  return (
    <main className="min-h-screen network-grid">
      {/* Ambient orbs */}
      <div
        className="orb"
        style={{
          width: 600,
          height: 600,
          top: -100,
          left: -150,
          background: "radial-gradient(circle, #3b82f6, transparent 70%)",
        }}
      />
      <div
        className="orb"
        style={{
          width: 500,
          height: 500,
          bottom: -50,
          right: -100,
          background: "radial-gradient(circle, #8b5cf6, transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center glow-blue">
              <NetworkIcon />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-gradient-brand">
            SpeedPulse
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
            Real-time internet speed analysis — download, upload &amp; latency
          </p>

          {/* Server info badge */}
          <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)] pulse-ring" />
            <span>Cloudflare Speed Test Servers</span>
          </div>
        </div>

        {/* Main gauge area */}
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden">
          {/* Background decoration */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            {/* Phase steps */}
            <div className="flex items-center justify-center gap-6 mb-10">
              <PhaseStepIndicator label="Ping" status={pingStatus} />
              <div className="w-8 h-px bg-slate-700" />
              <PhaseStepIndicator label="Download" status={downloadStatus} />
              <div className="w-8 h-px bg-slate-700" />
              <PhaseStepIndicator label="Upload" status={uploadStatus} />
            </div>

            {/* Gauges */}
            <div className="grid grid-cols-3 gap-8 mb-10 justify-items-center">
              <SpeedGauge
                value={results.download ?? (phase === "download" ? currentSpeed : 0)}
                max={200}
                unit="Mbps"
                label="Download"
                color="blue"
                size={170}
                isActive={phase === "download"}
              />
              <SpeedGauge
                value={results.ping ?? 0}
                max={200}
                unit="ms"
                label="Ping"
                color="purple"
                size={170}
                isActive={phase === "ping"}
              />
              <SpeedGauge
                value={results.upload ?? (phase === "upload" ? currentSpeed : 0)}
                max={100}
                unit="Mbps"
                label="Upload"
                color="green"
                size={170}
                isActive={phase === "upload"}
              />
            </div>

            {/* Progress bar */}
            {isRunning && (
              <div className="mb-8">
                <ProgressBar
                  phase={phase}
                  progress={progress}
                  currentSpeed={currentSpeed}
                />
              </div>
            )}

            {/* Start button */}
            <div className="flex justify-center">
              <button
                id="start-test-button"
                onClick={runTest}
                disabled={isRunning}
                className="btn-primary relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                style={{ minWidth: "200px", justifyContent: "center" }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <StartIcon spinning={isRunning} />
                  {isRunning
                    ? phase === "ping"
                      ? "Measuring Ping..."
                      : phase === "download"
                      ? "Downloading..."
                      : "Uploading..."
                    : isComplete
                    ? "Run Again"
                    : "Start Test"}
                </span>
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 text-center">
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 inline-block">
                  ⚠️ {error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Result cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ResultCard
            title="Ping"
            value={results.ping}
            unit="ms"
            phase={phase}
            activePhase="ping"
            icon={<PingIcon />}
            color="purple"
            description="Round-trip latency"
          />
          <ResultCard
            title="Download"
            value={results.download}
            unit="Mbps"
            phase={phase}
            activePhase="download"
            icon={<DownloadIcon />}
            color="blue"
            description="Incoming bandwidth"
          />
          <ResultCard
            title="Upload"
            value={results.upload}
            unit="Mbps"
            phase={phase}
            activePhase="upload"
            icon={<UploadIcon />}
            color="green"
            description="Outgoing bandwidth"
          />
        </div>

        {/* Speed quality indicator */}
        {isComplete && results.download && results.upload && results.ping && (
          <div className="glass-card rounded-2xl p-6 mb-8 fade-in-up">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Connection Quality
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  label: "Ping Quality",
                  value: results.ping,
                  thresholds: [20, 50, 100],
                  labels: ["Excellent", "Good", "Fair", "Poor"],
                  unit: "ms",
                  reverse: true,
                },
                {
                  label: "Download Quality",
                  value: results.download,
                  thresholds: [50, 25, 10],
                  labels: ["Excellent", "Good", "Fair", "Poor"],
                  unit: "Mbps",
                  reverse: false,
                },
                {
                  label: "Upload Quality",
                  value: results.upload,
                  thresholds: [20, 10, 5],
                  labels: ["Excellent", "Good", "Fair", "Poor"],
                  unit: "Mbps",
                  reverse: false,
                },
              ].map(({ label, value, thresholds, labels, reverse }) => {
                let qualityIdx = 3;
                if (reverse) {
                  if (value <= thresholds[0]) qualityIdx = 0;
                  else if (value <= thresholds[1]) qualityIdx = 1;
                  else if (value <= thresholds[2]) qualityIdx = 2;
                } else {
                  if (value >= thresholds[0]) qualityIdx = 0;
                  else if (value >= thresholds[1]) qualityIdx = 1;
                  else if (value >= thresholds[2]) qualityIdx = 2;
                }
                const colors = ["text-emerald-400", "text-green-400", "text-yellow-400", "text-red-400"];
                const bars = ["bg-emerald-500", "bg-green-500", "bg-yellow-500", "bg-red-500"];
                return (
                  <div key={label} className="text-center">
                    <p className="text-xs text-slate-500 mb-2">{label}</p>
                    <p className={`text-lg font-bold ${colors[qualityIdx]}`}>
                      {labels[qualityIdx]}
                    </p>
                    <div className="flex gap-1 justify-center mt-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                            i <= qualityIdx ? bars[qualityIdx] : "bg-slate-700"
                          }`}
                          style={{ opacity: i <= qualityIdx ? 1 - i * 0.2 : 0.3 }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History table */}
        {history.length > 0 && <HistoryTable history={history} />}

        {/* ── FAQ Section ─────────────────────────────────────────────────── */}
        {/* Crawlable content that matches high-volume search queries.         */}
        {/* Mirrors the FAQPage JSON-LD schema injected in the layout.         */}
        <section
          aria-label="Frequently asked questions about internet speed tests"
          className="mt-14"
        >
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: "How do I test my internet speed?",
                a: 'Click the "Start Test" button above. SpeedPulse will automatically measure your ping, download speed, and upload speed in sequence and show the results in Mbps and ms.',
              },
              {
                q: "What is a good internet download speed?",
                a: "25 Mbps is sufficient for most users. 100 Mbps+ is recommended for 4K streaming or heavy use. 200 Mbps and above is considered excellent broadband.",
              },
              {
                q: "What is a good ping for gaming?",
                a: "Under 20 ms is excellent. Under 50 ms is good. Under 100 ms is acceptable. Above 150 ms will cause noticeable lag in online games.",
              },
              {
                q: "What is a good upload speed?",
                a: "10 Mbps is fine for most users. Video calls and live streaming need 20 Mbps or more. Remote workers and content creators should aim for 50 Mbps+.",
              },
              {
                q: "Why is my speed test result different from my plan?",
                a: "Speed tests measure your actual connection at the time of the test. Results can vary due to network congestion, Wi-Fi interference, router limits, or shared bandwidth.",
              },
              {
                q: "Is SpeedPulse free to use?",
                a: "Yes — completely free. No account, no download, and no hidden limits. Just click Start Test.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="glass-card rounded-2xl p-5 border border-slate-800/60"
              >
                <h3 className="text-sm font-semibold text-slate-200 mb-2 leading-snug">
                  {q}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Semantic footer ──────────────────────────────────────────────── */}
        <footer className="text-center mt-12 pb-8 text-slate-600 text-xs space-y-1">
          <p>
            SpeedPulse measures your real internet speed via{" "}
            <a
              href="https://speed.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-400 underline underline-offset-2 transition-colors"
            >
              speed.cloudflare.com
            </a>{" "}
            — requires an active internet connection
          </p>
          <p>
            Results reflect your real-world connection to Cloudflare&apos;s
            global network
          </p>
          <p className="mt-3 text-slate-700">
            © {new Date().getFullYear()} SpeedPulse · Free Internet Speed Test
          </p>
        </footer>
      </div>
    </main>
  );
}
