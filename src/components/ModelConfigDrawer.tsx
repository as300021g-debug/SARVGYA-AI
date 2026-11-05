import React from "react";
import {
  X,
  Sliders,
  Cpu,
  Sparkles,
  Search,
  Brain,
  Download,
  Upload,
  UserCheck,
  Check,
} from "lucide-react";
import { ModelParameters, CompanionProfileType } from "../types";

interface ModelConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  params: ModelParameters;
  onUpdateParams: (params: Partial<ModelParameters>) => void;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ModelConfigDrawer: React.FC<ModelConfigDrawerProps> = ({
  isOpen,
  onClose,
  params,
  onUpdateParams,
  onExportBackup,
  onImportBackup,
}) => {
  if (!isOpen) return null;

  const models = [
    {
      id: "gemini-3.8-flash",
      name: "Gemini 3.8 Flash",
      tag: "High-Speed Multimodal & Search (Recommended)",
      badge: "Free Tier",
    },
    {
      id: "gemini-4-argon",
      name: "Gemini 4 Argon",
      tag: "Frontier Deep Reasoning, Coding & Complex STEM",
      badge: "Deep Reasoning",
    },
    {
      id: "gemini-3.1-flash-lite",
      name: "Gemini 3.1 Flash Lite",
      tag: "Ultra-Lightweight & Sub-Second Latency",
      badge: "Ultra Fast",
    },
  ];

  const personas: Array<{ id: CompanionProfileType; label: string; desc: string }> = [
    {
      id: "MENTOR",
      label: "Mentor Persona",
      desc: "Patient, step-by-step guidance, educational explanations, Socratic inquiry",
    },
    {
      id: "CREATOR",
      label: "Creator Persona",
      desc: "Imaginative writing, visual aesthetic prompts, storyboards, lateral thinking",
    },
    {
      id: "ANALYST",
      label: "Analyst Persona",
      desc: "Quantitative data, rigorous citations, systematic logic, risk factors",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl p-6 overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-100">Global Model & Parameters</h2>
              <span className="text-[11px] text-slate-400">Live Server-Side Engine Tuning</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Active Frontier Model */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Active Frontier Model
          </label>
          <div className="space-y-2">
            {models.map((m) => (
              <div
                key={m.id}
                onClick={() => onUpdateParams({ model: m.id })}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                  params.model === m.id
                    ? "bg-cyan-950/40 border-cyan-500/60 text-cyan-200 shadow-md"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">{m.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {m.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{m.tag}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Three AI Companion Profiles */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            AI Companion Profile
          </label>
          <div className="grid grid-cols-1 gap-2">
            {personas.map((p) => (
              <div
                key={p.id}
                onClick={() => onUpdateParams({ activePersona: p.id })}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                  params.activePersona === p.id
                    ? "bg-indigo-950/40 border-indigo-500/60 text-indigo-200"
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{p.label}</span>
                  {params.activePersona === p.id && (
                    <Check className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Global Feature Toggles */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Capabilities & Grounding
          </label>

          {/* Deep Thinking Mode */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Brain className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Deep Thinking Mode</span>
                <span className="text-[10px] text-slate-500">Exposes step-by-step reasoning trace accordion</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={params.deepThinkingEnabled}
              onChange={(e) => onUpdateParams({ deepThinkingEnabled: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          {/* Google Search Grounding */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Google Search Grounding</span>
                <span className="text-[10px] text-slate-500">Retrieves live web knowledge with source chips</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={params.searchGroundingEnabled}
              onChange={(e) => onUpdateParams({ searchGroundingEnabled: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Fine-Tuning Sliders */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Hyperparameters
          </label>

          {/* Temperature */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Temperature (Creativity vs Determinism)</span>
              <span className="font-mono text-cyan-300">{params.temperature}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={params.temperature}
              onChange={(e) => onUpdateParams({ temperature: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Top-P */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Top-P (Nucleus Sampling)</span>
              <span className="font-mono text-cyan-300">{params.topP}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={params.topP}
              onChange={(e) => onUpdateParams({ topP: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* 5. Custom System Instructions */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Custom System Instructions
          </label>
          <textarea
            value={params.systemInstruction}
            onChange={(e) => onUpdateParams({ systemInstruction: e.target.value })}
            rows={3}
            className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60 resize-none font-mono"
            placeholder="e.g. Always format mathematical formulas with LaTeX and code in clean TypeScript..."
          />
        </div>

        {/* 6. Full Data Backup (JSON Export / Import) */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Workspace Persistence & Backup
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onExportBackup}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Export JSON Backup
            </button>
            <label className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              Import JSON Backup
              <input type="file" accept=".json" onChange={onImportBackup} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
