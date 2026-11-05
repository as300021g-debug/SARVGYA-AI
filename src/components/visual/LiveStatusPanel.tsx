import React from "react";
import { Activity, RefreshCw, CheckCircle2, AlertCircle, Clock, Radio } from "lucide-react";

export interface StatusItem {
  id: string;
  name: string;
  status: "operational" | "active" | "degraded" | "offline" | "syncing";
  latencyMs?: number;
  lastPing?: string;
  description?: string;
}

export interface LiveStatusPanelProps {
  title?: string;
  subtitle?: string;
  items: StatusItem[];
  lastUpdated?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const LiveStatusPanel: React.FC<LiveStatusPanelProps> = ({
  title = "Live Subsystem Matrix Telemetry",
  subtitle = "Continuous operational verification & state inspection",
  items,
  lastUpdated,
  onRefresh,
  isRefreshing = false,
}) => {
  const getStatusBadge = (status: StatusItem["status"]) => {
    switch (status) {
      case "operational":
      case "active":
        return {
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
          label: "Operational",
        };
      case "syncing":
        return {
          color: "bg-sky-500/10 text-sky-400 border-sky-500/20",
          icon: <Radio className="w-3 h-3 text-sky-400 animate-pulse" />,
          label: "Live Sync",
        };
      case "degraded":
        return {
          color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          icon: <AlertCircle className="w-3 h-3 text-amber-400" />,
          label: "Degraded",
        };
      case "offline":
      default:
        return {
          color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          icon: <AlertCircle className="w-3 h-3 text-rose-400" />,
          label: "Standby",
        };
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-100">{title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{lastUpdated}</span>
            </div>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-50"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => {
          const badge = getStatusBadge(item.status);
          return (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition"
            >
              <div className="space-y-0.5 truncate">
                <div className="text-xs font-semibold text-slate-200 truncate">{item.name}</div>
                {item.description && (
                  <div className="text-[11px] text-slate-400 truncate">{item.description}</div>
                )}
                {item.latencyMs !== undefined && (
                  <div className="text-[10px] text-slate-500 font-mono">
                    RTT: {item.latencyMs}ms {item.lastPing ? `• ${item.lastPing}` : ""}
                  </div>
                )}
              </div>

              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border whitespace-nowrap ${badge.color}`}
              >
                {badge.icon}
                <span>{badge.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
