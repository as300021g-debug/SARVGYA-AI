import React, { useState, useMemo } from "react";
import { ChartConfig, ChartDataPoint, ChartType } from "./types.ts";
import { BarChart3, TrendingUp, PieChart, Table as TableIcon, Eye, Info, ShieldCheck, Activity } from "lucide-react";

export interface ChartRendererProps {
  config: ChartConfig;
  height?: number;
  className?: string;
  enableTableToggle?: boolean;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  config,
  height = 280,
  className = "",
  enableTableToggle = true,
}) => {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const {
    type,
    title,
    description,
    data,
    unit = "",
    xAxisLabel,
    yAxisLabel,
    isSimulated = false,
  } = config;

  const defaultPalette = [
    "#38bdf8", // sky
    "#818cf8", // indigo
    "#34d399", // emerald
    "#fbbf24", // amber
    "#f472b6", // pink
    "#a78bfa", // purple
    "#fb923c", // orange
  ];

  // Numerical range calculations
  const values = useMemo(() => data.map((d) => d.value ?? 0), [data]);
  const maxValue = useMemo(() => Math.max(...values, 1), [values]);
  const minValue = useMemo(() => Math.min(...values, 0), [values]);
  const valueRange = maxValue - minValue || 1;

  // Chart Dimensions
  const padding = { top: 20, right: 30, bottom: 40, left: 55 };
  const chartWidth = 600;
  const chartHeight = height;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // RENDER: Bar & Horizontal Bar Charts
  const renderBarChart = () => {
    const isHorizontal = type === "horizontal_bar";
    if (isHorizontal) {
      const barHeight = Math.min(28, (innerHeight / data.length) * 0.7);
      const gap = (innerHeight - barHeight * data.length) / (data.length + 1);

      return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
          {data.map((d, i) => {
            const y = padding.top + gap * (i + 1) + barHeight * i;
            const barW = Math.max(4, ((d.value - minValue) / valueRange) * innerWidth);
            const x = padding.left;
            const isHovered = hoveredIndex === i;
            const barColor = d.color || defaultPalette[i % defaultPalette.length];

            return (
              <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                <text
                  x={padding.left - 8}
                  y={y + barHeight / 2 + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {d.label.length > 10 ? d.label.slice(0, 9) + "…" : d.label}
                </text>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barHeight}
                  rx={4}
                  fill={barColor}
                  opacity={isHovered ? 1 : 0.85}
                  className="transition-all duration-300 cursor-pointer"
                />
                <text
                  x={x + barW + 6}
                  y={y + barHeight / 2 + 4}
                  className="text-[11px] fill-slate-300 font-mono font-semibold"
                >
                  {d.value} {unit}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    // Vertical Bar Chart
    const barWidth = Math.min(42, (innerWidth / data.length) * 0.65);
    const stepX = innerWidth / data.length;

    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
        {/* Y Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding.top + innerHeight * (1 - ratio);
          const val = Math.round(minValue + ratio * valueRange);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[10px] fill-slate-500 font-mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barH = Math.max(4, ((d.value - minValue) / valueRange) * innerHeight);
          const x = padding.left + stepX * i + (stepX - barWidth) / 2;
          const y = padding.top + (innerHeight - barH);
          const isHovered = hoveredIndex === i;
          const barColor = d.color || defaultPalette[i % defaultPalette.length];

          return (
            <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={4}
                fill={barColor}
                opacity={isHovered ? 1 : 0.85}
                className="transition-all duration-300 cursor-pointer"
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight - padding.bottom + 16}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {d.label.length > 8 ? d.label.slice(0, 7) + "…" : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // RENDER: Line & Area Charts
  const renderLineOrAreaChart = () => {
    const isArea = type === "area";
    const stepX = innerWidth / (data.length - 1 || 1);

    const points = data.map((d, i) => {
      const x = padding.left + stepX * i;
      const y = padding.top + innerHeight - ((d.value - minValue) / valueRange) * innerHeight;
      return { x, y, ...d };
    });

    const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");
    const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${
      padding.top + innerHeight
    } Z`;

    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding.top + innerHeight * (1 - ratio);
          const val = Math.round(minValue + ratio * valueRange);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[10px] fill-slate-500 font-mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {isArea && <path d={areaD} fill="url(#areaGradient)" />}

        <path
          d={pathD}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 3.5}
                fill={isHovered ? "#38bdf8" : "#0f172a"}
                stroke="#38bdf8"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200"
              />
              <text
                x={p.x}
                y={chartHeight - padding.bottom + 16}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {p.label.length > 7 ? p.label.slice(0, 6) + "…" : p.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // RENDER: Pie & Doughnut Charts
  const renderPieChart = () => {
    const isDoughnut = type === "doughnut";
    const total = data.reduce((acc, d) => acc + (d.value || 0), 0) || 1;
    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    const radius = Math.min(innerWidth, innerHeight) / 2.2;
    const innerRadius = isDoughnut ? radius * 0.58 : 0;

    let cumulativeAngle = 0;
    const slices = data.map((d, i) => {
      const angle = (d.value / total) * 2 * Math.PI;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle = endAngle;

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const x3 = centerX + innerRadius * Math.cos(endAngle);
      const y3 = centerY + innerRadius * Math.sin(endAngle);
      const x4 = centerX + innerRadius * Math.cos(startAngle);
      const y4 = centerY + innerRadius * Math.sin(startAngle);

      const largeArc = angle > Math.PI ? 1 : 0;

      const path = isDoughnut
        ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`
        : `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const percent = Math.round((d.value / total) * 100);
      return { path, percent, ...d, color: d.color || defaultPalette[i % defaultPalette.length] };
    });

    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-full">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-64 h-64 overflow-visible">
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.path}
              fill={slice.color}
              stroke="#0f172a"
              strokeWidth="2"
              opacity={hoveredIndex === i ? 1 : 0.85}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
          {isDoughnut && (
            <text
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              className="text-xs font-bold fill-slate-200 font-mono"
            >
              {total} {unit}
            </text>
          )}
        </svg>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-2">
          {slices.map((slice, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between gap-3 text-xs p-1 rounded cursor-pointer transition ${
                hoveredIndex === i ? "bg-slate-800 text-white" : "text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                <span>{slice.label}</span>
              </div>
              <span className="font-mono text-slate-300 font-semibold">{slice.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // RENDER: Candlestick Chart
  const renderCandlestickChart = () => {
    const highVal = Math.max(...data.map((d) => d.high ?? d.value), 1);
    const lowVal = Math.min(...data.map((d) => d.low ?? d.value), 0);
    const range = highVal - lowVal || 1;
    const stepX = innerWidth / data.length;
    const candleWidth = Math.min(22, stepX * 0.65);

    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
        {/* Y Grid Lines */}
        {[0, 0.33, 0.66, 1].map((ratio, idx) => {
          const y = padding.top + innerHeight * (1 - ratio);
          const val = Math.round(lowVal + ratio * range);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[10px] fill-slate-500 font-mono"
              >
                ${val}
              </text>
            </g>
          );
        })}

        {/* Candles */}
        {data.map((d, i) => {
          const open = d.open ?? d.value;
          const close = d.close ?? d.value;
          const high = d.high ?? Math.max(open, close);
          const low = d.low ?? Math.min(open, close);

          const isBullish = close >= open;
          const candleColor = isBullish ? "#10b981" : "#f43f5e";

          const x = padding.left + stepX * i + (stepX - candleWidth) / 2;
          const centerX = x + candleWidth / 2;

          const wickTop = padding.top + innerHeight - ((high - lowVal) / range) * innerHeight;
          const wickBottom = padding.top + innerHeight - ((low - lowVal) / range) * innerHeight;

          const bodyTop = padding.top + innerHeight - ((Math.max(open, close) - lowVal) / range) * innerHeight;
          const bodyBottom = padding.top + innerHeight - ((Math.min(open, close) - lowVal) / range) * innerHeight;
          const bodyH = Math.max(3, bodyBottom - bodyTop);

          return (
            <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              {/* Wick */}
              <line x1={centerX} y1={wickTop} x2={centerX} y2={wickBottom} stroke={candleColor} strokeWidth="1.5" />
              {/* Body */}
              <rect
                x={x}
                y={bodyTop}
                width={candleWidth}
                height={bodyH}
                fill={candleColor}
                rx={1.5}
                className="cursor-pointer"
              />
              <text
                x={centerX}
                y={chartHeight - padding.bottom + 16}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className={`p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 ${className}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {type === "candlestick" ? (
                <TrendingUp className="w-4 h-4" />
              ) : type === "pie" || type === "doughnut" ? (
                <PieChart className="w-4 h-4" />
              ) : (
                <BarChart3 className="w-4 h-4" />
              )}
            </span>
            <h3 className="text-sm font-bold text-slate-100">{title || "Interactive Data Chart"}</h3>
          </div>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>

        <div className="flex items-center gap-2">
          {isSimulated ? (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10">
              Simulated / Illustrative Data
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Data
            </span>
          )}

          {enableTableToggle && (
            <div className="flex items-center p-0.5 bg-slate-800 rounded-lg border border-slate-700">
              <button
                onClick={() => setViewMode("chart")}
                className={`p-1 rounded text-xs transition ${
                  viewMode === "chart" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
                title="View Chart"
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1 rounded text-xs transition ${
                  viewMode === "table" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
                title="View Table"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-72">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                <th className="p-2.5">Label</th>
                <th className="p-2.5 text-right">Value {unit && `(${unit})`}</th>
                {type === "candlestick" && (
                  <>
                    <th className="p-2.5 text-right">Open</th>
                    <th className="p-2.5 text-right">High</th>
                    <th className="p-2.5 text-right">Low</th>
                    <th className="p-2.5 text-right">Close</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-medium">{row.label}</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{row.value}</td>
                  {type === "candlestick" && (
                    <>
                      <td className="p-2.5 text-right font-mono">${row.open ?? "—"}</td>
                      <td className="p-2.5 text-right font-mono text-emerald-400">${row.high ?? "—"}</td>
                      <td className="p-2.5 text-right font-mono text-rose-400">${row.low ?? "—"}</td>
                      <td className="p-2.5 text-right font-mono">${row.close ?? "—"}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden" style={{ height }}>
          {type === "pie" || type === "doughnut"
            ? renderPieChart()
            : type === "candlestick"
            ? renderCandlestickChart()
            : type === "line" || type === "area"
            ? renderLineOrAreaChart()
            : renderBarChart()}

          {/* Active Hover Tooltip */}
          {hoveredIndex !== null && data[hoveredIndex] && (
            <div className="absolute top-2 right-2 p-2 rounded-lg bg-slate-950/95 border border-slate-700 shadow-xl pointer-events-none text-xs space-y-0.5 font-mono">
              <div className="text-slate-400">{data[hoveredIndex].label}</div>
              <div className="text-sky-400 font-bold text-sm">
                {data[hoveredIndex].value} {unit}
              </div>
              {data[hoveredIndex].secondaryValue !== undefined && (
                <div className="text-slate-400 text-[10px]">
                  Ref: {data[hoveredIndex].secondaryValue}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
