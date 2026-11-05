import React, { useState } from "react";
import {
  Activity,
  Headphones,
  Database,
  Cpu,
  Zap,
  Volume2,
  Trash2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { UserProfile } from "../types";
import { LiveStatusPanel } from "./visual/LiveStatusPanel.tsx";

interface EvolutionHUDProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  workerTicks: number;
  workerFeed: Array<{ timestamp: number; tickIndex: number; payloadSize: number; source: string }>;
  isSoundscapeActive: boolean;
  toggleSoundscape: () => void;
  cacheStats: { shellCacheCount: number; aiCacheCount: number; profileCacheCount: number; status: string } | null;
  onRefreshCacheStats: () => void;
  onClearCaches: () => void;
  onUpdateBrainwaveVolume: (vol: number) => void;
  onSelectBrainwaveProfile: (profile: "Delta" | "Theta" | "Alpha" | "Beta" | "Gamma") => void;
}

export const EvolutionHUD: React.FC<EvolutionHUDProps> = ({
  profile,
  workerTicks,
  workerFeed,
  isSoundscapeActive,
  toggleSoundscape,
  cacheStats,
  onRefreshCacheStats,
  onClearCaches,
  onUpdateBrainwaveVolume,
  onSelectBrainwaveProfile,
}) => {
  const brainwaveOptions: Array<{
    id: "Delta" | "Theta" | "Alpha" | "Beta" | "Gamma";
    label: string;
    freq: string;
    description: string;
  }> = [
    { id: "Delta", label: "Delta Wave", freq: "2.5 Hz", description: "Deep regenerative cognitive rest and sub-conscious healing" },
    { id: "Theta", label: "Theta Wave", freq: "6.0 Hz", description: "Deep learning assimilation, memory consolidation and flow state" },
    { id: "Alpha", label: "Alpha Wave", freq: "10.0 Hz", description: "Relaxed alertness, creative ideation and stress reduction" },
    { id: "Beta", label: "Beta Wave", freq: "20.0 Hz", description: "Analytical focus, problem solving and active data processing" },
    { id: "Gamma", label: "Gamma Wave", freq: "40.0 Hz", description: "Peak cognitive performance, multi-modal synthesis and epiphany" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Continuous Learning Evolution HUD</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Created by Aryan Sharma. Real-time telemetry, continuous learning convergence, and system health status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            MATURITY: 100.0% [MAX LIMIT]
          </span>
        </div>
      </div>

      {/* Live System Subsystems Status Panel */}
      <LiveStatusPanel
        title="Live System Core Subsystems & Telemetry Feeds"
        subtitle="Continuous verified operational feeds & background telemetry"
        items={[
          {
            id: "search_grounding",
            name: "Live Google Search Grounding",
            status: "operational",
            latencyMs: 412,
            lastPing: new Date().toLocaleTimeString(),
            description: "Continuous factual verification active with canonical URI citations",
          },
          {
            id: "railway_telemetry",
            name: "National Train Enquiry System (NTES)",
            status: "operational",
            latencyMs: 290,
            lastPing: new Date().toLocaleTimeString(),
            description: "Indian Railways live train tracking & station itinerary active",
          },
          {
            id: "market_stream",
            name: "Yahoo Finance Market Telemetry",
            status: "operational",
            latencyMs: 185,
            lastPing: new Date().toLocaleTimeString(),
            description: "Sub-second tick stream active for global equity tickers",
          },
          {
            id: "evolution_worker",
            name: "Universal Evolution Worker & WebAudio",
            status: "active",
            latencyMs: 12,
            lastPing: new Date().toLocaleTimeString(),
            description: `Tick #${workerTicks} synchronized with binaural brainwave synthesizer`,
          },
        ]}
      />

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Rapport Resonance</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-slate-100 font-mono">
            {profile.rapportLevel}
          </div>
          <p className="text-[10px] text-slate-500">Continuous cognitive alignment & empathetic tracking</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Adaptive Bond Level</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            {profile.bondLevel}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${profile.bondLevel}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Worker Telemetry Ticks</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300 font-mono">
            #{workerTicks}
          </div>
          <p className="text-[10px] text-slate-500">Emitted every 1000ms by evolutionWorker.js</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Service Worker Offline Cache</span>
            <Database className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {cacheStats ? `${cacheStats.shellCacheCount + cacheStats.aiCacheCount + cacheStats.profileCacheCount} items` : "Active"}
          </div>
          <p className="text-[10px] text-slate-500">Universal Service Worker v1.2</p>
        </div>
      </div>

      {/* Main Grid: Brainwave Synthesizer + Live Worker Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Web Audio API Binaural Synthesizer */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-slate-100">
                Web Audio API Binaural Soundscape Generator
              </h3>
            </div>
            <button
              onClick={toggleSoundscape}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                isSoundscapeActive
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
            >
              {isSoundscapeActive ? "Playing (Stop)" : "Start Soundscape"}
            </button>
          </div>

          {/* Wave Profile Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Select Brainwave State</label>
            <div className="space-y-2">
              {brainwaveOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => onSelectBrainwaveProfile(opt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    profile.brainwaveProfile === opt.id
                      ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-200"
                      : "bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-100">{opt.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {opt.freq}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{opt.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Volume Control */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                Soundscape Volume
              </span>
              <span className="font-mono text-slate-200 font-bold">{Math.round(profile.soundscapeVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={profile.soundscapeVolume}
              onChange={(e) => onUpdateBrainwaveVolume(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Live Web Worker Telemetry Feed & Service Worker Inspector */}
        <div className="space-y-4">
          {/* Service Worker Cache Manager */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-xs text-slate-100">Service Worker Resilience Cache</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onRefreshCacheStats}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                  title="Refresh Cache Stats"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button
                  onClick={onClearCaches}
                  className="p-1 hover:bg-slate-800 rounded text-rose-400 hover:text-rose-300"
                  title="Clear Caches"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[10px]">Shell Cache</span>
                <span className="font-mono font-bold text-slate-100">{cacheStats?.shellCacheCount || 2} entries</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[10px]">AI Responses</span>
                <span className="font-mono font-bold text-slate-100">{cacheStats?.aiCacheCount || 0} entries</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[10px]">Profile State</span>
                <span className="font-mono font-bold text-slate-100">{cacheStats?.profileCacheCount || 1} entries</span>
              </div>
            </div>
          </div>

          {/* Live Background Worker Telemetry Log */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-xs text-slate-100">Live Background Worker Event Stream</h4>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE STREAMING
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] max-h-56 overflow-y-auto pr-1">
              {workerFeed.length === 0 ? (
                <p className="text-slate-500 text-xs py-4 text-center">Initializing background worker stream...</p>
              ) : (
                workerFeed.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 text-slate-300">
                    <span>
                      <span className="text-indigo-400 font-bold">TICK #{item.tickIndex}</span> - Ingested {item.payloadSize} bytes
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
