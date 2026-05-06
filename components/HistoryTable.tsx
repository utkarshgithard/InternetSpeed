"use client";

import { TestHistory } from "@/hooks/useSpeedTest";

interface HistoryTableProps {
  history: TestHistory[];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getSpeedClass(speed: number, type: "download" | "upload"): string {
  const threshold = type === "download" ? 25 : 10;
  if (speed >= threshold * 4) return "text-emerald-400";
  if (speed >= threshold * 2) return "text-green-400";
  if (speed >= threshold) return "text-yellow-400";
  return "text-red-400";
}

function getPingClass(ping: number): string {
  if (ping <= 20) return "text-emerald-400";
  if (ping <= 50) return "text-green-400";
  if (ping <= 100) return "text-yellow-400";
  return "text-red-400";
}

export function HistoryTable({ history }: HistoryTableProps) {
  if (history.length === 0) return null;

  const avgPing = Math.round(history.reduce((a, b) => a + b.ping, 0) / history.length);
  const avgDownload =
    Math.round((history.reduce((a, b) => a + b.download, 0) / history.length) * 10) / 10;
  const avgUpload =
    Math.round((history.reduce((a, b) => a + b.upload, 0) / history.length) * 10) / 10;

  return (
    <div className="glass-card rounded-2xl p-6 fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-slate-400">📊</span>
          Test History
        </h3>
        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
          Last {history.length} test{history.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
              <th className="pb-3 text-left font-medium">#</th>
              <th className="pb-3 text-left font-medium">Time</th>
              <th className="pb-3 text-right font-medium">Ping</th>
              <th className="pb-3 text-right font-medium">Download</th>
              <th className="pb-3 text-right font-medium">Upload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {[...history].reverse().map((entry, idx) => (
              <tr
                key={idx}
                className="transition-colors hover:bg-slate-800/30"
              >
                <td className="py-3 text-slate-600 font-mono text-xs">
                  {history.length - idx}
                </td>
                <td className="py-3 text-slate-400 font-mono text-xs">
                  {formatTime(entry.timestamp)}
                </td>
                <td
                  className={`py-3 text-right font-bold tabular-nums ${getPingClass(entry.ping)}`}
                >
                  {entry.ping}
                  <span className="text-xs font-normal text-slate-600 ml-1">ms</span>
                </td>
                <td
                  className={`py-3 text-right font-bold tabular-nums ${getSpeedClass(entry.download, "download")}`}
                >
                  {entry.download < 10
                    ? entry.download.toFixed(1)
                    : Math.round(entry.download)}
                  <span className="text-xs font-normal text-slate-600 ml-1">Mbps</span>
                </td>
                <td
                  className={`py-3 text-right font-bold tabular-nums ${getSpeedClass(entry.upload, "upload")}`}
                >
                  {entry.upload < 10
                    ? entry.upload.toFixed(1)
                    : Math.round(entry.upload)}
                  <span className="text-xs font-normal text-slate-600 ml-1">Mbps</span>
                </td>
              </tr>
            ))}
          </tbody>
          {history.length > 1 && (
            <tfoot>
              <tr className="border-t border-slate-700/50 text-xs font-bold">
                <td className="pt-3 text-slate-500" colSpan={2}>
                  Average
                </td>
                <td className={`pt-3 text-right ${getPingClass(avgPing)}`}>
                  {avgPing}
                  <span className="text-slate-600 font-normal ml-1">ms</span>
                </td>
                <td
                  className={`pt-3 text-right ${getSpeedClass(avgDownload, "download")}`}
                >
                  {avgDownload < 10 ? avgDownload.toFixed(1) : Math.round(avgDownload)}
                  <span className="text-slate-600 font-normal ml-1">Mbps</span>
                </td>
                <td
                  className={`pt-3 text-right ${getSpeedClass(avgUpload, "upload")}`}
                >
                  {avgUpload < 10 ? avgUpload.toFixed(1) : Math.round(avgUpload)}
                  <span className="text-slate-600 font-normal ml-1">Mbps</span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
