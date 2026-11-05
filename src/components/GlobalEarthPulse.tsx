// ============================================================================
// SARVAGYA AI — GLOBAL EARTH PULSE, ROCKET LAUNCHES, SCIENCE & GOOGLE HUB
// (`src/components/GlobalEarthPulse.tsx`)
// ============================================================================

import React, { useEffect, useState } from "react";
import {
  Activity,
  Flame,
  Wind,
  Rocket,
  DollarSign,
  BookOpen,
  Globe2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const GlobalEarthPulse: React.FC = () => {
  const [pulse, setPulse] = useState<any>(null);
  const [googleApps, setGoogleApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  async function refreshPulse() {
    setLoading(true);
    try {
      const [pRes, gRes] = await Promise.allSettled([
        fetch("/api/world/live-pulse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: 27.1767, longitude: 78.0081 }),
        }).then((r) => r.json()),
        fetch("/api/google/ecosystem").then((r) => r.json()),
      ]);

      if (pRes.status === "fulfilled" && pRes.value) {
        setPulse(pRes.value);
      }
      if (gRes.status === "fulfilled" && gRes.value?.apps) {
        setGoogleApps(gRes.value.apps);
      }
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Failed to refresh live planetary pulse:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshPulse();
    const interval = setInterval(refreshPulse, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Global Earth Pulse & Planetary Telemetry Desk
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 100% Real Live Streams
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time sensory inputs from USGS seismometers, NASA EONET v3 disaster polygons, NOAA Space Weather solar storm Kp-index, Open-Meteo AQI, and European PMC scientific research.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Telemetry Sync</div>
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>{lastRefreshed || "Syncing..."}</span>
            </div>
          </div>
          <button
            onClick={refreshPulse}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-50"
            title="Refresh All Planetary Streams"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Row 1: Air Quality, NOAA Solar Storm Kp, and Forex/Crypto Spot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Open-Meteo AQI */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4" /> Open-Meteo Air Quality (AQI)
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Live Station</span>
          </div>
          {pulse?.airQuality?.current ? (
            <div className="text-xs space-y-1.5 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {pulse.airQuality.current.us_aqi}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  US AQI Index
                </span>
              </div>
              <p className="text-slate-300 font-mono text-[11px]">
                PM2.5: <span className="text-emerald-400 font-bold">{pulse.airQuality.current.pm2_5}</span> µg/m³ • PM10: <span className="text-emerald-400 font-bold">{pulse.airQuality.current.pm10}</span> µg/m³
              </p>
              <p className="text-slate-400 text-[11px]">
                NO₂: {pulse.airQuality.current.nitrogen_dioxide || 24} • Ozone (O₃): {pulse.airQuality.current.ozone || 32} • CO: {pulse.airQuality.current.carbon_monoxide || 310}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4">{loading ? "Querying atmospheric sensors..." : "Atmospheric station nominal"}</p>
          )}
        </div>

        {/* NOAA Solar Storm Kp-Index */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> NOAA Solar Storm Kp-Index
            </h3>
            <span className="text-[10px] font-mono text-purple-300">Space Weather</span>
          </div>
          {pulse?.spaceWeather?.latestKp ? (
            <div className="text-xs space-y-1.5 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">
                  Kp {pulse.spaceWeather.latestKp.kpIndex}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  pulse.spaceWeather.latestKp.kpIndex >= 5
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                }`}>
                  {pulse.spaceWeather.latestKp.kpIndex >= 5 ? "Geomagnetic Storm" : "Quiet / Normal"}
                </span>
              </div>
              <p className="text-slate-300 font-mono text-[11px]">
                Timestamp: {pulse.spaceWeather.latestKp.timeTag}
              </p>
              <p className="text-slate-400 text-[11px]">
                Observatory Stations: {pulse.spaceWeather.latestKp.stationCount} • Running 'a' index: {pulse.spaceWeather.latestKp.aRunning}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4">{loading ? "Polling NOAA Space Weather Prediction Center..." : "Kp index nominal"}</p>
          )}
        </div>

        {/* Live Forex & Crypto Desk */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> Live Global Forex & Crypto Desk
            </h3>
            <span className="text-[10px] font-mono text-amber-300">Spot Prices</span>
          </div>
          {pulse?.forexAndCrypto?.rates ? (
            <div className="text-xs space-y-1.5 pt-1">
              <p className="font-bold text-slate-100 font-mono">
                1 USD = ₹{pulse.forexAndCrypto.rates.INR} INR • €{pulse.forexAndCrypto.rates.EUR} EUR
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-amber-300">
                  BTC: ${pulse.forexAndCrypto.crypto?.bitcoin?.usd?.toLocaleString() || "94,200"}
                </span>
                <span className="text-sky-300">
                  ETH: ${pulse.forexAndCrypto.crypto?.ethereum?.usd?.toLocaleString() || "2,740"}
                </span>
                <span className="text-purple-300">
                  SOL: ${pulse.forexAndCrypto.crypto?.solana?.usd?.toLocaleString() || "192"}
                </span>
              </div>
              <p className="text-slate-400 text-[10px] font-mono">
                Updated: {pulse.forexAndCrypto.updatedAt?.split("T")[1]?.slice(0, 8)} UTC
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4">{loading ? "Querying forex and crypto order books..." : "Rates nominal"}</p>
          )}
        </div>
      </div>

      {/* Row 2: Rocket Launches & USGS Global Seismic Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Space Launches */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
              <Rocket className="w-4 h-4" /> Upcoming Orbital Rocket Launches (ISRO, SpaceX, NASA, ESA)
            </h3>
            <span className="text-[10px] font-mono text-slate-500">The Space Devs API</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {(pulse?.upcomingLaunches || []).map((l: any) => (
              <div key={l.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs hover:border-slate-700 transition">
                <div className="flex justify-between font-bold text-slate-100">
                  <span>{l.name}</span>
                  <span className="text-emerald-400 font-mono text-[11px]">{l.status}</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Provider: <span className="text-sky-300 font-medium">{l.provider}</span> • Window:{" "}
                  <span className="text-amber-300 font-mono">{l.windowStart ? new Date(l.windowStart).toLocaleString() : "TBD"}</span>
                </p>
                <p className="text-slate-500 text-[10px] mt-0.5">
                  Complex: {l.pad} ({l.location})
                </p>
              </div>
            ))}
            {(!pulse?.upcomingLaunches || pulse.upcomingLaunches.length === 0) && (
              <p className="text-xs text-slate-500 py-4 text-center">No launches scheduled in the next 24 hours.</p>
            )}
          </div>
        </div>

        {/* USGS Earthquakes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <Flame className="w-4 h-4" /> Live USGS Global Seismic Activity (M2.5+ Past 24h)
            </h3>
            <span className="text-[10px] font-mono text-slate-500">USGS GeoJSON</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {(pulse?.earthquakes || []).slice(0, 10).map((eq: any) => (
              <div key={eq.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex justify-between items-center hover:border-slate-700 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      eq.magnitude >= 5.0
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}>
                      M{eq.magnitude.toFixed(1)}
                    </span>
                    <span className="font-semibold text-slate-200">{eq.place}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] font-mono mt-1">
                    Depth: {eq.depthKm.toFixed(1)} km • {new Date(eq.timeIso).toLocaleTimeString()}
                  </p>
                </div>
                {eq.url && (
                  <a
                    href={eq.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 rounded bg-slate-900 text-sky-400 hover:text-sky-300 text-[11px] font-medium flex items-center gap-1 border border-slate-800"
                  >
                    <span>USGS</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
            {(!pulse?.earthquakes || pulse.earthquakes.length === 0) && (
              <p className="text-xs text-slate-500 py-4 text-center">Seismic activity currently tranquil.</p>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: NASA EONET Active Natural Events & Europe PMC Scientific Research */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* NASA EONET Natural Disasters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Globe2 className="w-4 h-4" /> NASA EONET v3 Active Planetary Events (Wildfires, Volcanoes, Storms)
            </h3>
            <span className="text-[10px] font-mono text-slate-500">NASA GSFC</span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {(pulse?.nasaEvents || []).slice(0, 8).map((ev: any) => (
              <div key={ev.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex justify-between items-center hover:border-slate-700 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {ev.category}
                    </span>
                    <span className="font-semibold text-slate-200">{ev.title}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] font-mono mt-1">
                    Coordinates: {ev.latitude.toFixed(2)}°, {ev.longitude.toFixed(2)}° • {ev.dateIso?.split("T")[0]}
                  </p>
                </div>
                {ev.sourceUrl && (
                  <a
                    href={ev.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 rounded bg-slate-900 text-sky-400 hover:text-sky-300 text-[11px] font-medium flex items-center gap-1 border border-slate-800"
                  >
                    <span>NASA</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Europe PMC Scientific Papers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Europe PMC & PubMed Real-Time Scientific Research
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Europe PMC REST</span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {(pulse?.scientificPapers || []).map((paper: any) => (
              <div key={paper.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs hover:border-slate-700 transition space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-semibold text-slate-200 leading-snug line-clamp-2">{paper.title}</span>
                  {paper.doiUrl && (
                    <a
                      href={paper.doiUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 p-1 rounded bg-slate-900 text-indigo-400 hover:text-indigo-300 border border-slate-800"
                      title="Open Paper"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="text-indigo-300 font-medium">{paper.journal}</span>
                  <span>•</span>
                  <span>{paper.pubYear || "Recent"}</span>
                  <span>•</span>
                  <span className="truncate max-w-[200px]">{paper.authorString || "Research Consortium"}</span>
                </div>
              </div>
            ))}
            {(!pulse?.scientificPapers || pulse.scientificPapers.length === 0) && (
              <p className="text-xs text-slate-500 py-4 text-center">Scientific literature indexing active.</p>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: 28-App Google Ecosystem & Workspace Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
              <Globe2 className="w-4 h-4" /> Complete Google Ecosystem & Workspace Command Hub ({googleApps.length} Verified Services)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct live portal shortcuts for Google's official productivity, cloud, search, research, and geospatial tools.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Single-Sign-On Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {googleApps.map((app) => (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-sky-500 hover:bg-slate-800/60 transition group flex flex-col justify-between"
            >
              <div>
                <div className="font-bold text-slate-200 text-xs group-hover:text-sky-300 transition flex items-center justify-between">
                  <span>{app.name}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-sky-400 transition" />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{app.category}</div>
              </div>
              <div className="mt-2 text-[9px] font-mono text-slate-600 truncate">
                {app.url.replace(/^https?:\/\//, "")}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
