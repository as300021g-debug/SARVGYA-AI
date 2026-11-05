import React from "react";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendPercent?: number;
  statusBadge?: string;
  statusColor?: "emerald" | "blue" | "amber" | "purple" | "rose";
  icon?: React.ReactNode;
  sparkline?: number[];
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subValue,
  trend,
  trendPercent,
  statusBadge,
  statusColor = "blue",
  icon,
  sparkline,
}) => {
  const badgeColorMap = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  // Generate lightweight SVG sparkline
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 80;
    const height = 24;
    const points = sparkline
      .map((val, idx) => {
        const x = (idx / (sparkline.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(" ");

    const strokeColor =
      trend === "up" ? "#10b981" : trend === "down" ? "#f43f5e" : "#38bdf8";

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 truncate">
          {icon || <Activity className="w-3.5 h-3.5 text-slate-500" />}
          {title}
        </span>
        {statusBadge && (
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeColorMap[statusColor]}`}
          >
            {statusBadge}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
            {value}
          </span>
          {unit && <span className="text-xs text-slate-400 font-mono">{unit}</span>}
        </div>
        {renderSparkline()}
      </div>

      {(subValue || trendPercent !== undefined) && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
          <span>{subValue || "Normalized"}</span>
          {trendPercent !== undefined && (
            <div
              className={`flex items-center gap-0.5 font-medium ${
                trend === "up"
                  ? "text-emerald-400"
                  : trend === "down"
                  ? "text-rose-400"
                  : "text-slate-400"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend === "down" ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              <span>{Math.abs(trendPercent)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
