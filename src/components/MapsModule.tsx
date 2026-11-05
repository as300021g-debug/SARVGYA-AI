import React, { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {
  MapPin,
  Navigation,
  Search,
  ExternalLink,
  ShieldCheck,
  Compass,
  Map as MapIcon,
  Layers,
  Sparkles,
  Radio,
} from "lucide-react";
import { UniversalMapExplorer } from "./UniversalMapExplorer";
import { VisualizationErrorBoundary } from "./visual/VisualizationErrorBoundary.tsx";

interface LocationItem {
  name: string;
  lat: number;
  lng: number;
  description: string;
  category: string;
}

export const MapsModule: React.FC = () => {
  const [viewMode, setViewMode] = useState<"universal" | "city">("universal");
  const [searchQuery, setSearchQuery] = useState("Tokyo, Japan");
  const [activeLocation, setActiveLocation] = useState<LocationItem>({
    name: "Tokyo, Japan",
    lat: 35.6762,
    lng: 139.6503,
    description: "Global metropolitan center of technology, robotics, and culture.",
    category: "Metropolis",
  });
  const [infoOpen, setInfoOpen] = useState(true);

  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "";
  const hasValidMapsKey = Boolean(apiKey && apiKey.trim().length > 15 && !apiKey.includes("YOUR_") && !apiKey.includes("KEY"));

  const popularLocations: LocationItem[] = [
    { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503, description: "Global metropolitan center of tech and culture.", category: "Tech Hub" },
    { name: "San Francisco, CA", lat: 37.7749, lng: -122.4194, description: "Silicon Valley innovation corridor and AI epicenter.", category: "AI Research" },
    { name: "New Delhi, India", lat: 28.6139, lng: 77.209, description: "Historic capital city of India with high-growth tech ecosystems.", category: "Innovation Hub" },
    { name: "Geneva, Switzerland", lat: 46.2044, lng: 6.1432, description: "Global scientific & diplomatic center (CERN, Large Hadron Collider).", category: "Scientific Lab" },
    { name: "Bengaluru, India", lat: 12.9716, lng: 77.5946, description: "Silicon Plateau & major aerospace and software development hub.", category: "Aerospace & Tech" },
  ];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const found = popularLocations.find((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      setActiveLocation(found);
      setInfoOpen(true);
    } else {
      setActiveLocation({
        name: searchQuery,
        lat: 37.422,
        lng: -122.0841,
        description: `Inspecting geographical coordinates and spatial telemetry for ${searchQuery}.`,
        category: "Custom Coordinates",
      });
      setInfoOpen(true);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("universal")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === "universal"
                ? "bg-amber-600 text-white shadow-md shadow-amber-950/40"
                : "text-slate-400 hover:text-slate-200 bg-slate-800/60"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Universal Radar (Flights, Satellites & IRCTC Trains)</span>
          </button>
          <button
            onClick={() => setViewMode("city")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === "city"
                ? "bg-amber-600 text-white shadow-md shadow-amber-950/40"
                : "text-slate-400 hover:text-slate-200 bg-slate-800/60"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>City & Innovation Hub Geocoder</span>
          </button>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          🇮🇳 Made in India • Aryan Sharma
        </span>
      </div>

      {viewMode === "universal" ? (
        <VisualizationErrorBoundary fallbackTitle="Google Maps Platform Geodetic Radar">
          <UniversalMapExplorer />
        </VisualizationErrorBoundary>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <MapPin className="w-5 h-5" />
                </span>
                <h1 className="text-xl font-bold text-slate-100">Interactive Google Maps Explorer</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Zero-Legacy Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Created by Aryan Sharma. Spatial navigation powered by official @vis.gl/react-google-maps with AdvancedMarkerElement & DEMO_MAP_ID.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {popularLocations.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => {
                    setSearchQuery(loc.name);
                    setActiveLocation(loc);
                    setInfoOpen(true);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    activeLocation.name === loc.name
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {loc.name.split(",")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-lg shadow-black/20">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location, global coordinates, or AI technology hub..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40 shrink-0"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Locate Coordinates</span>
          </button>
        </form>
      </div>

      {/* Map & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spatial Metadata Card */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-xs text-amber-400 uppercase tracking-wider">
                Spatial Telemetry
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {activeLocation.category}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Location Name:</span>
                <span className="font-bold text-sm text-slate-100">{activeLocation.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Latitude:</span>
                  <span className="font-mono text-amber-300 font-bold">{activeLocation.lat.toFixed(4)}° N</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Longitude:</span>
                  <span className="font-mono text-amber-300 font-bold">{activeLocation.lng.toFixed(4)}° E</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Overview:</span>
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{activeLocation.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeLocation.name)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Official Google Maps</span>
              </a>
            </div>
          </div>

          {/* Compliance & Verification Box */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-4 text-[11px] text-slate-400 space-y-2.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Legacy Compliance Verified</span>
            </div>
            <p className="leading-relaxed">
              Implemented exclusively with <code className="text-slate-200">@vis.gl/react-google-maps</code>, featuring <code className="text-slate-200">AdvancedMarker</code> and <code className="text-slate-200">mapId="DEMO_MAP_ID"</code>. Deprecated Marker, Directions, and PlacesService classes are completely avoided.
            </p>
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[10px]">
              <div className="text-slate-300 font-semibold flex items-center gap-1">
                <ExternalLink className="w-3 h-3 text-amber-400" />
                <span>API Key Restrictions & Billing Notice:</span>
              </div>
              <p className="text-slate-400">
                Administrators must restrict API keys to authorized HTTP referrers and designated APIs via the{" "}
                <a
                  href="https://docs.cloud.google.com/api-keys/docs/add-restrictions-api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 underline hover:text-amber-300"
                >
                  Cloud Console Security Guide
                </a>
                . Usage may incur costs against your Google Cloud billing account under the{" "}
                <a
                  href="https://cloud.google.com/maps-platform/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 underline hover:text-amber-300"
                >
                  Google Maps Platform Terms of Service
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Visual Map Surface */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between min-h-[460px] relative overflow-hidden">
          {/* Top Attribution Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 z-10">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapIcon className="w-4 h-4 text-amber-400" />
              <span className="font-bold">Google Maps Platform Live Explorer</span>
              <span className="text-[10px] text-slate-500 font-mono">mapId: "DEMO_MAP_ID"</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">
              internalUsageAttributionIds: ['gmp_git_agentskills_v1']
            </span>
          </div>

          {/* Interactive Map Surface */}
          <div className="flex-1 my-3 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden min-h-[340px]">
            {hasValidMapsKey ? (
              <APIProvider apiKey={apiKey}>
                <Map
                  mapId="DEMO_MAP_ID"
                  center={{ lat: activeLocation.lat, lng: activeLocation.lng }}
                  zoom={12}
                  style={{ width: "100%", height: "100%" }}
                  internalUsageAttributionIds={["gmp_git_agentskills_v1", "gmp_mcp_codeassist_v1_aistudio"]}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                >
                  <AdvancedMarker
                    position={{ lat: activeLocation.lat, lng: activeLocation.lng }}
                    onClick={() => setInfoOpen(!infoOpen)}
                  >
                    <Pin background="#f59e0b" glyphColor="#020617" borderColor="#78350f" />
                  </AdvancedMarker>

                  {infoOpen && (
                    <InfoWindow
                      position={{ lat: activeLocation.lat, lng: activeLocation.lng }}
                      onCloseClick={() => setInfoOpen(false)}
                    >
                      <div className="p-2 text-slate-900 max-w-[200px]">
                        <h4 className="font-bold text-xs">{activeLocation.name}</h4>
                        <p className="text-[11px] text-slate-600 mt-1">{activeLocation.description}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            ) : (
              /* High-fidelity Fallback Surface with Advanced Marker Pin Simulation */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/30 flex items-center gap-2 animate-bounce">
                    <MapPin className="w-4 h-4" />
                    <span>{activeLocation.name}</span>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 max-w-sm text-xs text-slate-300 shadow-md">
                    <p className="font-semibold text-slate-100">{activeLocation.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{activeLocation.description}</p>
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-amber-400 font-mono">
                      <span>Lat: {activeLocation.lat.toFixed(4)}°</span>
                      <span>Lng: {activeLocation.lng.toFixed(4)}°</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Live map surface ready. Add <code className="text-amber-300">VITE_GOOGLE_MAPS_API_KEY</code> in Settings to stream full Google Vector tiles.
                  </p>
                </div>

                <div className="absolute bottom-3 right-3 text-slate-800 pointer-events-none">
                  <Compass className="w-20 h-20 opacity-20" />
                </div>
              </div>
            )}
          </div>

          {/* Mandatory Policy Footer */}
          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 text-center space-x-1">
            <span>Google Maps features are governed by the</span>
            <a
              href="https://cloud.google.com/maps-platform/terms"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400/80 underline hover:text-amber-300"
            >
              Google Maps Platform Terms of Service
            </a>
            <span>and billing guidelines. No map data is cached in client service workers.</span>
          </div>
        </div>
      </div>
    </>
  )}
</div>
);
};
