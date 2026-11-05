import React, { useState, useEffect } from "react";
import {
  Rocket,
  Compass,
  Globe,
  Radio,
  Satellite,
  Clock,
  Sparkles,
  MapPin,
  RefreshCw,
  Eye,
  Layers,
  ArrowRight,
  ExternalLink,
  Plane,
  Train,
  CloudSun,
  Newspaper,
  ShieldCheck,
  Search,
  Wind,
  Droplets,
  Sun,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { TrainTracker } from "./visual/TrainTracker.tsx";
import { ThreeDViewer } from "./visual/ThreeDViewer.tsx";
import { VisualizationErrorBoundary } from "./visual/VisualizationErrorBoundary.tsx";
import { GlobalEarthPulse } from "./GlobalEarthPulse";

export const SpaceTransitModule: React.FC = () => {
  type SubTab = "space" | "flights" | "trains" | "weather" | "news" | "earth_pulse";
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("space");

  // --- 1. Space & Planetary States ---
  const [planetSelected, setPlanetSelected] = useState<string>("Mars");
  const activeMissions = [
    { name: "Chandrayaan-3 / Lunar Polar", agency: "ISRO", target: "Moon South Pole", status: "Active Telemetry", countdown: "Mission Operational" },
    { name: "Artemis II Crewed Flyby", agency: "NASA / ESA", target: "Lunar Orbit", status: "Preparation", countdown: "T-Minus 8 Months" },
    { name: "Aditya-L1 Solar Observatory", agency: "ISRO", target: "Sun-Earth L1 Halo", status: "Continuous Observation", countdown: "Operational" },
    { name: "Europa Clipper", agency: "NASA", target: "Jupiter's Moon Europa", status: "Cruise Phase", countdown: "En Route" },
    { name: "Gaganyaan-1 Test Flight", agency: "ISRO", target: "Low Earth Orbit", status: "Crew Capsule Validation", countdown: "Scheduled 2026" },
    { name: "James Webb Space Telescope (JWST)", agency: "NASA / ESA / CSA", target: "Sun-Earth L2 Point", status: "Deep Space Imaging", countdown: "1.5M km from Earth" },
  ];

  const planetaryData: Record<string, { distance: string; gravity: string; moons: number; atmosphere: string; desc: string }> = {
    Mercury: { distance: "77M km", gravity: "3.7 m/s²", moons: 0, atmosphere: "Trace Exosphere", desc: "Smallest planet in the Solar System, heavily cratered with dramatic thermal swings." },
    Venus: { distance: "41M km", gravity: "8.87 m/s²", moons: 0, atmosphere: "Dense CO2 / Sulfuric Acid", desc: "Runaway greenhouse atmosphere with surface pressures exceeding 90 bars." },
    Mars: { distance: "225M km", gravity: "3.72 m/s²", moons: 2, atmosphere: "Thin CO2 (95%)", desc: "The Red Planet, home to Olympus Mons and extensive dry ancient riverbeds." },
    Jupiter: { distance: "778M km", gravity: "24.79 m/s²", moons: 95, atmosphere: "Hydrogen & Helium", desc: "Gas giant with iconic Great Red Spot storm and ocean moons Europa and Ganymede." },
    Saturn: { distance: "1.4B km", gravity: "10.44 m/s²", moons: 146, atmosphere: "Hydrogen & Helium", desc: "Spectacular ring system composed of billions of ice and rock particles." },
  };

  // --- 2. Live Flight Tracker States ---
  const [flightNumber, setFlightNumber] = useState("AI101");
  const [flightData, setFlightData] = useState<{ telemetry: string; sources: Array<{ title: string; uri: string }> } | null>(null);
  const [loadingFlight, setLoadingFlight] = useState(false);

  // --- 3. Live Train Tracker States (Where Is My Train / IRCTC) ---
  const [trainQuery, setTrainQuery] = useState("12002");
  const [trainData, setTrainData] = useState<{ statusReport: string; sources: Array<{ title: string; uri: string }> } | null>(null);
  const [loadingTrain, setLoadingTrain] = useState(false);

  // --- 4. Live Multi-Source Weather States ---
  const [weatherCity, setWeatherCity] = useState("New Delhi, India");
  const [weatherData, setWeatherData] = useState<{ weatherReport: string; sources: Array<{ title: string; uri: string }> } | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // --- 5. Live News Feed States ---
  const [newsCategory, setNewsCategory] = useState("technology");
  const [newsData, setNewsData] = useState<{ newsDigest: string; sources: Array<{ title: string; uri: string }> } | null>(null);
  const [loadingNews, setLoadingNews] = useState(false);

  // Track Flight
  const handleTrackFlight = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!flightNumber.trim() || loadingFlight) return;
    setLoadingFlight(true);
    setFlightData(null);
    try {
      const res = await fetch("/api/transit/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flightNumber: flightNumber.trim() }),
      });
      const data = await res.json();
      setFlightData(data);
    } catch (err) {
      console.error("Flight tracking error:", err);
    } finally {
      setLoadingFlight(false);
    }
  };

  // Track Train
  const handleTrackTrain = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trainQuery.trim() || loadingTrain) return;
    setLoadingTrain(true);
    setTrainData(null);
    try {
      const res = await fetch("/api/transit/trains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainNumber: trainQuery.trim() }),
      });
      const data = await res.json();
      setTrainData(data);
    } catch (err) {
      console.error("Train tracking error:", err);
    } finally {
      setLoadingTrain(false);
    }
  };

  // Fetch Weather
  const handleFetchWeather = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!weatherCity.trim() || loadingWeather) return;
    setLoadingWeather(true);
    setWeatherData(null);
    try {
      const res = await fetch("/api/weather/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: weatherCity.trim() }),
      });
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Weather error:", err);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Fetch News
  const handleFetchNews = async (cat?: string) => {
    const targetCat = cat || newsCategory;
    setLoadingNews(true);
    setNewsData(null);
    try {
      const res = await fetch("/api/news/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: targetCat, country: "global" }),
      });
      const data = await res.json();
      setNewsData(data);
    } catch (err) {
      console.error("News error:", err);
    } finally {
      setLoadingNews(false);
    }
  };

  const activePlanet = planetaryData[planetSelected] || planetaryData["Mars"];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Rocket className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Universal Planetary, Transit & Global Telemetry</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time orbital mechanics, live global flight radar, Indian Railways train tracker, multi-source weather, and breaking news.
          </p>
        </div>

        {/* 5-SubTab Pill Switcher */}
        <div className="flex flex-wrap items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveSubTab("space")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === "space" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            Space & Orbit
          </button>
          <button
            onClick={() => {
              setActiveSubTab("flights");
              if (!flightData && !loadingFlight) handleTrackFlight();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === "flights" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            Live Flight Radar
          </button>
          <button
            onClick={() => {
              setActiveSubTab("trains");
              if (!trainData && !loadingTrain) handleTrackTrain();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === "trains" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            Train Tracker (IRCTC)
          </button>
          <button
            onClick={() => {
              setActiveSubTab("weather");
              if (!weatherData && !loadingWeather) handleFetchWeather();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === "weather" ? "bg-amber-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            Live Weather
          </button>
          <button
            onClick={() => {
              setActiveSubTab("news");
              if (!newsData && !loadingNews) handleFetchNews();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === "news" ? "bg-rose-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            Global News
          </button>
          <button
            onClick={() => setActiveSubTab("earth_pulse")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === "earth_pulse" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Live Earth Pulse
          </button>
        </div>
      </div>

      {/* 1. SPACE & PLANETARY ORBITS */}
      {activeSubTab === "space" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                Select Celestial Body
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {Object.keys(planetaryData).map((planet) => (
                  <button
                    key={planet}
                    onClick={() => setPlanetSelected(planet)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                      planetSelected === planet
                        ? "bg-sky-500/20 text-sky-200 border-sky-500/50"
                        : "bg-slate-800/40 text-slate-300 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <span className="font-bold text-sm">{planet}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {planetaryData[planet].distance} from Earth
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-sky-400 font-semibold font-mono">
                      Solar System Telemetry
                    </span>
                    <h2 className="text-2xl font-black text-white">{planetSelected}</h2>
                  </div>
                  <span className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-300 font-mono text-sm">
                    {activePlanet.gravity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{activePlanet.desc}</p>
                <div className="border border-slate-800 overflow-hidden">
                  <ThreeDViewer
                    sceneType="planet"
                    modelIdentifier={planetSelected.toLowerCase()}
                    title={`${planetSelected} 3D Orbital Geometry`}
                    height={260}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Mean Distance</div>
                    <div className="text-sm font-bold text-slate-100 font-mono mt-0.5">{activePlanet.distance}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Surface Gravity</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{activePlanet.gravity}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Moons</div>
                    <div className="text-sm font-bold text-sky-300 font-mono mt-0.5">{activePlanet.moons} Known</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Atmosphere</div>
                    <div className="text-xs font-semibold text-amber-300 truncate mt-0.5">{activePlanet.atmosphere}</div>
                  </div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/20 text-xs text-sky-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-sky-400" />
                <span>Real-time orbital tracking calibrated against NASA JPL Horizons ephemerides.</span>
              </div>
            </div>
          </div>

          {/* Active Exploration Missions */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                Active Exploration Missions & Satellite Spacecraft Tracker
              </h2>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Deep Space Telemetry Live
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeMissions.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 font-mono">
                      {m.agency}
                    </span>
                    <span className="text-[11px] text-sky-400 font-mono">{m.status}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-100">{m.name}</div>
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Target: {m.target}</span>
                    <span className="text-emerald-300 font-mono text-[11px]">{m.countdown}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE FLIGHT TRACKER */}
      {activeSubTab === "flights" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-400" />
              Live Commercial Flight Radar
            </h2>

            <form onSubmit={handleTrackFlight} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Flight Number or Route (e.g. AI101, EK500, BA178)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="Enter Flight Number..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500 uppercase font-mono"
                  />
                  <Plane className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingFlight || !flightNumber.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-blue-950/40"
              >
                {loadingFlight ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Tracking Global ATC Airspace...
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    Query Live Flight Telemetry
                  </>
                )}
              </button>
            </form>

            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Popular Commercial Corridors</div>
              <div className="flex flex-wrap gap-1.5">
                {["AI101", "EK500", "BA178", "LH760", "QR570", "SQ402"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFlightNumber(f);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono hover:text-white"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  Live ADS-B Radar Telemetry & Status
                </h3>
                <span className="text-[11px] text-blue-400 font-mono">OpenSky & ATC Standards</span>
              </div>

              {flightData ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto font-mono">
                  {flightData.telemetry}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <Plane className="w-10 h-10 stroke-1" />
                  <p>Enter flight number to retrieve live altitude, speed, and en route coordinates.</p>
                </div>
              )}
            </div>

            {flightData?.sources && flightData.sources.length > 0 && (
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                <span>Verified Sources:</span>
                {flightData.sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                    {s.title} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. LIVE TRAIN TRACKER (Where Is My Train / IRCTC) */}
      {activeSubTab === "trains" && (
        <div className="space-y-6">
          <VisualizationErrorBoundary fallbackTitle="Railway Telemetry Radar">
            <TrainTracker
              initialTrainNumber={trainQuery || "12002"}
              title="Where Is My Train • Live IRCTC Telemetry & Route Map"
            />
          </VisualizationErrorBoundary>
        </div>
      )}

      {/* 4. LIVE MULTI-SOURCE WEATHER */}
      {activeSubTab === "weather" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-400" />
              Live Global Weather Observation
            </h2>

            <form onSubmit={handleFetchWeather} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">City / Region</label>
                <div className="relative">
                  <input
                    type="text"
                    value={weatherCity}
                    onChange={(e) => setWeatherCity(e.target.value)}
                    placeholder="e.g. New Delhi, Mumbai, Tokyo, New York..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingWeather || !weatherCity.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-amber-950/40"
              >
                {loadingWeather ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Fetching Weather Telemetry...
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    Retrieve Live Weather & AQI
                  </>
                )}
              </button>
            </form>

            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Quick Cities</div>
              <div className="flex flex-wrap gap-1.5">
                {["New Delhi", "Mumbai", "Bengaluru", "London", "Tokyo", "New York", "Dubai"].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setWeatherCity(city);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs hover:text-white"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  Meteorological Station Telemetry (Google/Apple/Samsung Weather Style)
                </h3>
                <span className="text-[11px] text-amber-400 font-mono">Live Grounded</span>
              </div>

              {weatherData ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto">
                  {weatherData.weatherReport}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <CloudSun className="w-10 h-10 stroke-1" />
                  <p>Enter city to query live temperature, humidity, wind, and AQI.</p>
                </div>
              )}
            </div>

            {weatherData?.sources && weatherData.sources.length > 0 && (
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                <span>Verified Weather Data Sources:</span>
                {weatherData.sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                    {s.title} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. LIVE GLOBAL BREAKING NEWS FEED */}
      {activeSubTab === "news" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-rose-400" />
              <h2 className="text-sm font-bold text-slate-100">Live Breaking News Wire</h2>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: "technology", label: "Technology & AI" },
                { id: "markets", label: "Markets & Finance" },
                { id: "science", label: "Science & Space" },
                { id: "world", label: "World Headlines" },
                { id: "india", label: "India National" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setNewsCategory(c.id);
                    handleFetchNews(c.id);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                    newsCategory === c.id
                      ? "bg-rose-600 text-white border-rose-500"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  Verified Global News Feed: {newsCategory.toUpperCase()}
                </h3>
                <button
                  onClick={() => handleFetchNews()}
                  disabled={loadingNews}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingNews ? "animate-spin" : ""}`} />
                  Refresh Headlines
                </button>
              </div>

              {newsData ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[480px] overflow-y-auto">
                  {newsData.newsDigest}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <Newspaper className="w-10 h-10 stroke-1" />
                  <p>Fetching real-time news headlines with live Google Search Grounding...</p>
                </div>
              )}
            </div>

            {newsData?.sources && newsData.sources.length > 0 && (
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                <span>Verified News Sources:</span>
                {newsData.sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-rose-400 hover:underline flex items-center gap-1">
                    {s.title} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. LIVE EARTH PULSE, SEISMIC & SPACE WEATHER */}
      {activeSubTab === "earth_pulse" && <GlobalEarthPulse />}
    </div>
  );
};
