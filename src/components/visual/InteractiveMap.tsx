import React, { useState } from "react";
import { MapMarker, RouteWaypoint } from "./types.ts";
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, Layers, Compass, Globe } from "lucide-react";

export interface InteractiveMapProps {
  title?: string;
  markers?: MapMarker[];
  routes?: RouteWaypoint[][];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: number | string;
  enableControls?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  title = "Geospatial Radar & Route Explorer",
  markers = [],
  routes = [],
  center = { lat: 28.6139, lng: 77.209 }, // Default New Delhi
  zoom = 6,
  height = 360,
  enableControls = true,
}) => {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [mapLayer, setMapLayer] = useState<"standard" | "satellite" | "transit">("transit");
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Approximate coordinate projection to SVG canvas (Equirectangular)
  const mapWidth = 800;
  const mapHeight = 500;

  // View bounds roughly centered on center prop
  const bounds = {
    minLat: center.lat - 12 / (currentZoom / 4),
    maxLat: center.lat + 12 / (currentZoom / 4),
    minLng: center.lng - 16 / (currentZoom / 4),
    maxLng: center.lng + 16 / (currentZoom / 4),
  };

  const project = (lat: number, lng: number) => {
    const x =
      ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * mapWidth + panOffset.x;
    const y =
      ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * mapHeight + panOffset.y;
    return { x, y };
  };

  const handleZoom = (delta: number) => {
    setCurrentZoom((z) => Math.min(18, Math.max(2, z + delta)));
  };

  const resetView = () => {
    setCurrentZoom(zoom);
    setPanOffset({ x: 0, y: 0 });
    setSelectedMarker(null);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Globe className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-100">{title}</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {markers.length} POIs • Zoom {currentZoom}x
          </span>
        </div>

        {enableControls && (
          <div className="flex items-center gap-2">
            {/* Layer selector */}
            <div className="flex items-center p-0.5 bg-slate-800 rounded-lg border border-slate-700 text-xs">
              {(["transit", "satellite", "standard"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setMapLayer(l)}
                  className={`px-2 py-1 rounded capitalize transition ${
                    mapLayer === l
                      ? "bg-slate-700 text-white font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Zoom / Reset */}
            <div className="flex items-center p-0.5 bg-slate-800 rounded-lg border border-slate-700">
              <button
                onClick={() => handleZoom(1)}
                className="p-1 text-slate-400 hover:text-white transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom(-1)}
                className="p-1 text-slate-400 hover:text-white transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetView}
                className="p-1 text-slate-400 hover:text-white transition border-l border-slate-700"
                title="Reset Map View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map Canvas */}
      <div
        className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 select-none"
        style={{ height }}
      >
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.75" />
            </pattern>
            {/* Transit Route Gradient */}
            <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {/* Background Grid & Landform contour */}
          <rect width={mapWidth} height={mapHeight} fill="#090d16" />
          <rect width={mapWidth} height={mapHeight} fill="url(#grid)" opacity="0.6" />

          {/* Render Route Paths */}
          {routes.map((route, rIdx) => {
            if (route.length < 2) return null;
            const pathStr = route.reduce((acc, pt, i) => {
              const { x, y } = project(pt.lat, pt.lng);
              return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
            }, "");

            return (
              <g key={rIdx}>
                {/* Glow Track */}
                <path
                  d={pathStr}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="5"
                  opacity="0.25"
                  strokeLinecap="round"
                />
                {/* Active Railway / Route Track */}
                <path
                  d={pathStr}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="6 3"
                />
              </g>
            );
          })}

          {/* Render Markers */}
          {markers.map((m) => {
            const { x, y } = project(m.lat, m.lng);
            const isSelected = selectedMarker?.id === m.id;
            const markerColor = m.color || (m.category === "station" ? "#10b981" : "#38bdf8");

            return (
              <g
                key={m.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => setSelectedMarker(m)}
                className="cursor-pointer group"
              >
                {/* Ping animation for selected or live vehicle */}
                <circle
                  r={isSelected ? 14 : 9}
                  fill={markerColor}
                  opacity={isSelected ? "0.3" : "0.15"}
                  className="animate-ping"
                />
                <circle
                  r={isSelected ? 8 : 5}
                  fill={markerColor}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                {/* Label */}
                <text
                  y="-10"
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-slate-300 font-semibold drop-shadow"
                >
                  {m.title}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Marker Detail Card */}
        {selectedMarker && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs p-3.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-sm space-y-1.5 text-xs animate-in fade-in">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {selectedMarker.title}
              </span>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-slate-400 hover:text-white font-mono p-1"
              >
                ✕
              </button>
            </div>
            {selectedMarker.description && (
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {selectedMarker.description}
              </p>
            )}
            <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800 flex items-center justify-between">
              <span>
                {selectedMarker.lat.toFixed(4)}°N, {selectedMarker.lng.toFixed(4)}°E
              </span>
              <span className="capitalize text-emerald-400 font-semibold">
                {selectedMarker.category || "Location"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
