import React, { useState, useEffect, useRef } from "react";
import { TrainJourneyData, TrainStation } from "./types.ts";
import {
  Train,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  ShieldCheck,
  Radio,
  SlidersHorizontal,
  Layers,
} from "lucide-react";

export interface TrainTrackerProps {
  title?: string;
  initialTrainNumber?: string;
  autoRefreshIntervalSeconds?: number;
  className?: string;
}

export const TrainTracker: React.FC<TrainTrackerProps> = ({
  title,
  initialTrainNumber = "12002",
  autoRefreshIntervalSeconds = 30,
  className = "",
}) => {
  const [trainQuery, setTrainQuery] = useState(initialTrainNumber);
  const [journeyData, setJourneyData] = useState<TrainJourneyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"running" | "route" | "stations">("running");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(autoRefreshIntervalSeconds);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTrainStatus = async (queryToFetch?: string) => {
    const q = queryToFetch || trainQuery;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/transit/train-live/${encodeURIComponent(q.trim())}`);
      if (!res.ok) {
        throw new Error(`Railway server returned HTTP ${res.status}`);
      }
      const json = await res.json();
      const data: TrainJourneyData = (json && json.data) ? json.data : json;
      if (data && Array.isArray(data.stations)) {
        setJourneyData(data);
      } else {
        throw new Error("Invalid railway telemetry payload format received.");
      }
      setCountdown(autoRefreshIntervalSeconds);
    } catch (err: any) {
      console.error("[TrainTracker Error]:", err);
      setError(err?.message || "Failed to load live railway running telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainStatus(initialTrainNumber);
  }, [initialTrainNumber]);

  // Auto-refresh interval ticker
  useEffect(() => {
    if (!autoRefresh) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchTrainStatus();
          return autoRefreshIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRefresh, trainQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrainStatus();
  };

  const selectPreset = (num: string) => {
    setTrainQuery(num);
    fetchTrainStatus(num);
  };

  // SVG Railway Map projection
  const renderRailwayMap = () => {
    if (!journeyData || !journeyData.stations || journeyData.stations.length < 2) return null;

    const stations = journeyData.stations;
    const lats = stations.map((s) => s.coordinates.lat);
    const lngs = stations.map((s) => s.coordinates.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    const svgW = 750;
    const svgH = 340;
    const pad = 45;

    const project = (lat: number, lng: number) => {
      const x = pad + ((lng - minLng) / lngRange) * (svgW - pad * 2);
      const y = pad + ((maxLat - lat) / latRange) * (svgH - pad * 2);
      return { x, y };
    };

    const pathPoints = stations.map((s) => project(s.coordinates.lat, s.coordinates.lng));
    const pathD = pathPoints.reduce(
      (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
      ""
    );

    const trainPos = journeyData.currentLocation
      ? project(journeyData.currentLocation.lat, journeyData.currentLocation.lng)
      : pathPoints[0] || { x: 50, y: 50 };

    return (
      <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden select-none">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-80">
          <defs>
            <linearGradient id="trainTrackGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <pattern id="railGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width={svgW} height={svgH} fill="#060911" />
          <rect width={svgW} height={svgH} fill="url(#railGrid)" opacity="0.4" />

          {/* Glowing Outer Track */}
          <path
            d={pathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="6"
            opacity="0.2"
            strokeLinecap="round"
          />

          {/* Main Track */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#trainTrackGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8 4"
          />

          {/* Station Markers */}
          {stations.map((s, idx) => {
            const { x, y } = pathPoints[idx];
            const isPassed = s.status === "PASSED";
            const isCurrent = s.status === "CURRENT";
            const isNext = s.status === "NEXT";

            const pinColor = isCurrent
              ? "#10b981"
              : isNext
              ? "#38bdf8"
              : isPassed
              ? "#64748b"
              : "#475569";

            return (
              <g key={s.code} transform={`translate(${x}, ${y})`}>
                <circle
                  r={isCurrent ? 7 : isNext ? 5.5 : 4}
                  fill={pinColor}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                <text
                  y={idx % 2 === 0 ? -12 : 16}
                  textAnchor="middle"
                  className={`text-[9px] font-mono font-semibold ${
                    isCurrent
                      ? "fill-emerald-400 font-bold"
                      : isNext
                      ? "fill-sky-300"
                      : "fill-slate-400"
                  }`}
                >
                  {s.code}
                </text>
              </g>
            );
          })}

          {/* LIVE MOVING TRAIN MARKER */}
          <g transform={`translate(${trainPos.x}, ${trainPos.y})`}>
            {/* Animated Radar Pulse */}
            <circle r="18" fill="#10b981" opacity="0.25" className="animate-ping" />
            <circle r="10" fill="#10b981" opacity="0.4" />
            <circle r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            {/* Tooltip Badge */}
            <g transform="translate(0, -22)">
              <rect
                x="-42"
                y="-14"
                width="84"
                height="18"
                rx="4"
                fill="#0f172a"
                stroke="#10b981"
                strokeWidth="1"
              />
              <text
                x="0"
                y="-2"
                textAnchor="middle"
                className="text-[9px] fill-emerald-300 font-mono font-bold"
              >
                {journeyData.speedKmh} km/h • LIVE
              </text>
            </g>
          </g>
        </svg>

        {/* Floating Telemetry Overlay */}
        <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Train className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-slate-100">{journeyData.currentLocation.description}</div>
              <div className="text-[11px] text-slate-400 font-mono">
                {journeyData.currentLocation.lat.toFixed(4)}°N, {journeyData.currentLocation.lng.toFixed(4)}°E
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
            <div>
              <span className="text-slate-500">Speed:</span>{" "}
              <span className="text-emerald-400 font-bold">{journeyData.speedKmh} km/h</span>
            </div>
            <div>
              <span className="text-slate-500">Progress:</span>{" "}
              <span className="text-sky-400 font-bold">{journeyData.progressPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 ${className}`}>
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Train className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-100">
              Where Is My Train & IRCTC Live Transit Tracker
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time NTES National Train Enquiry System tracking, route mapping & station delays
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Data Freshness Badge */}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            LIVE_CONFIRMED
          </span>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition flex items-center gap-1.5 ${
              autoRefresh
                ? "bg-slate-800 text-sky-400 border-sky-500/30"
                : "bg-slate-800/60 text-slate-400 border-slate-700"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Auto: {autoRefresh ? `${countdown}s` : "Off"}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => fetchTrainStatus()}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-50"
            title="Refresh running status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Search Bar & Preset Trains */}
      <div className="space-y-2.5">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={trainQuery}
              onChange={(e) => setTrainQuery(e.target.value)}
              placeholder="Search Train Name or Number (e.g. 12002, 22436, 12951, 12301)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-emerald-500 font-mono"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            disabled={loading || !trainQuery.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Train className="w-3.5 h-3.5" />}
            <span>Track Train</span>
          </button>
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-500 font-mono shrink-0 mr-1">Corridors:</span>
          {[
            { num: "12002", name: "Bhopal Shatabdi" },
            { num: "22436", name: "Vande Bharat Express" },
            { num: "12951", name: "Mumbai Rajdhani" },
            { num: "12301", name: "Howrah Rajdhani" },
            { num: "12004", name: "Lucknow Shatabdi" },
          ].map((t) => (
            <button
              key={t.num}
              onClick={() => selectPreset(t.num)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition shrink-0 ${
                journeyData?.trainNumber === t.num
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700/60"
              }`}
            >
              {t.num} • {t.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {journeyData && journeyData.sourceStation && journeyData.destinationStation && (
        <>
          {/* 3. Train Overview Hero Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-bold text-slate-100 font-mono">
                  {journeyData.trainNumber}
                </span>
                <span className="text-sm font-semibold text-slate-300">
                  {journeyData.trainName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {journeyData.trainType}
                </span>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{journeyData.sourceStation.name} ({journeyData.sourceStation.code})</span>
                <ArrowRight className="w-3 h-3 text-slate-600" />
                <span>{journeyData.destinationStation.name} ({journeyData.destinationStation.code})</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono">{journeyData.totalDistanceKm} km Total</span>
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Running Status</div>
                <div
                  className={`text-xs font-bold font-mono mt-0.5 ${
                    journeyData.currentDelayMinutes === 0
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {journeyData.currentDelayMinutes === 0
                    ? "ON TIME"
                    : `DELAYED BY ${journeyData.currentDelayMinutes} MINS`}
                </div>
              </div>

              {journeyData.nextStation && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Next Station ETA</div>
                  <div className="text-xs font-bold text-sky-400 font-mono mt-0.5">
                    {journeyData.nextStation.name} ({journeyData.nextStation.eta})
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. View Mode Switcher */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("running")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "running"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Running View
              </button>
              <button
                onClick={() => setActiveTab("route")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "route"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Route Map
              </button>
              <button
                onClick={() => setActiveTab("stations")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === "stations"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Station Itinerary ({journeyData.stations.length})
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Data Updated: {new Date(journeyData.lastUpdated).toLocaleTimeString()}
            </span>
          </div>

          {/* 5. Active Tab Contents */}
          {activeTab === "running" && (
            <div className="space-y-4">
              {renderRailwayMap()}

              {/* Station Progress Track */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Current Station: <strong className="text-slate-200">{journeyData.currentStation?.name}</strong></span>
                  <span>Next Station: <strong className="text-sky-400">{journeyData.nextStation?.name}</strong> ({journeyData.nextStation?.distanceKm} km away)</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${journeyData.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "route" && (
            <div className="space-y-4">
              {renderRailwayMap()}
              <div className="text-xs text-slate-400 font-mono text-center">
                Interactive Indian Railways GIS Track Projection • Source: {journeyData.providerAttribution}
              </div>
            </div>
          )}

          {activeTab === "stations" && (
            <div className="rounded-xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                    <th className="p-3">Status</th>
                    <th className="p-3">Station</th>
                    <th className="p-3">Code</th>
                    <th className="p-3">Sched. Arr / Dep</th>
                    <th className="p-3">Actual / Delay</th>
                    <th className="p-3">Halt</th>
                    <th className="p-3">Platform</th>
                    <th className="p-3 text-right">Dist. (km)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {journeyData.stations.map((st) => {
                    const isPassed = st.status === "PASSED";
                    const isCurrent = st.status === "CURRENT";
                    const isNext = st.status === "NEXT";

                    return (
                      <tr
                        key={st.code}
                        className={`transition ${
                          isCurrent
                            ? "bg-emerald-500/10 font-bold"
                            : isNext
                            ? "bg-sky-500/10"
                            : isPassed
                            ? "opacity-60 hover:bg-slate-800/20"
                            : "hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="p-3">
                          {isCurrent ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              CURRENT
                            </span>
                          ) : isNext ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30">
                              NEXT
                            </span>
                          ) : isPassed ? (
                            <span className="text-slate-500 text-[10px]">PASSED</span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">UPCOMING</span>
                          )}
                        </td>
                        <td className="p-3 font-semibold text-slate-200">{st.name}</td>
                        <td className="p-3 text-sky-400">{st.code}</td>
                        <td className="p-3 text-slate-400">
                          {st.scheduledArrival} / {st.scheduledDeparture}
                        </td>
                        <td className="p-3">
                          {st.delayArrivalMinutes === 0 ? (
                            <span className="text-emerald-400">Right Time</span>
                          ) : (
                            <span className="text-amber-400">+{st.delayArrivalMinutes}m Late</span>
                          )}
                        </td>
                        <td className="p-3">{st.haltMinutes}m</td>
                        <td className="p-3 text-slate-400">PF #{st.platform || "1"}</td>
                        <td className="p-3 text-right text-slate-400">{st.distanceKm}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};
