import React, { useState } from "react";
import {
  X,
  Sun,
  Moon,
  Laptop,
  Trash2,
  Download,
  Upload,
  Cpu,
  Sliders,
  Type,
  ShieldCheck,
  Check,
} from "lucide-react";
import { ModelParameters } from "../../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelParams: ModelParameters;
  onUpdateParams: (updates: Partial<ModelParameters>) => void;
  onClearAllChats: () => void;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: "dark" | "light";
  onToggleTheme: (t: "dark" | "light") => void;
  fontStyle: "sans" | "serif";
  onToggleFont: (f: "sans" | "serif") => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  modelParams,
  onUpdateParams,
  onClearAllChats,
  onExportBackup,
  onImportBackup,
  theme,
  onToggleTheme,
  fontStyle,
  onToggleFont,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"general" | "model" | "data">("general");
  const [clearedConfirm, setClearedConfirm] = useState(false);

  const handleClear = () => {
    onClearAllChats();
    setClearedConfirm(true);
    setTimeout(() => setClearedConfirm(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Settings & Preferences</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-800/80 bg-slate-900/50">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === "general"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            General & Appearance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("model")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === "model"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            AI Intelligence & Persona
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("data")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === "data"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Data & Privacy
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
          {/* 1. General & Appearance */}
          {activeTab === "general" && (
            <div className="space-y-5">
              {/* Theme Mode */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Theme Mode</span>
                  <span className="text-xs text-slate-400">Choose your visual appearance</span>
                </div>
                <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => onToggleTheme("light")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      theme === "light"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleTheme("dark")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      theme === "dark"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Typography */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Font Typography</span>
                  <span className="text-xs text-slate-400">Select reading typeface</span>
                </div>
                <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => onToggleFont("sans")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      fontStyle === "sans"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Modern Sans</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleFont("serif")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      fontStyle === "serif"
                        ? "bg-indigo-600 text-white shadow-sm font-serif"
                        : "text-slate-400 hover:text-white font-serif"
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Editorial Serif</span>
                  </button>
                </div>
              </div>

              {/* Google Search Grounding default */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">Default Google Search Grounding</span>
                  <span className="text-xs text-slate-400">Pull verified real-time facts automatically</span>
                </div>
                <input
                  type="checkbox"
                  checked={modelParams.searchGroundingEnabled}
                  onChange={(e) => onUpdateParams({ searchGroundingEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* 2. AI Intelligence & Persona */}
          {activeTab === "model" && (
            <div className="space-y-5">
              {/* Default Model */}
              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Default Foundation Model
                </label>
                <select
                  value={modelParams.model}
                  onChange={(e) => onUpdateParams({ model: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended Standard)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (High Speed)</option>
                  <option value="gemini-flash-latest">gemini-flash-latest</option>
                  <option value="gpt-6-astra">gpt-6-astra / Astra Advanced Mode</option>
                </select>
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-200">Creativity & Temperature</label>
                  <span className="font-mono text-xs text-indigo-400">{modelParams.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={modelParams.temperature}
                  onChange={(e) => onUpdateParams({ temperature: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 bg-slate-800"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>0.0 Precise & Deterministic</span>
                  <span>1.0 Creative & Imaginative</span>
                </div>
              </div>

              {/* Custom System Instruction */}
              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Custom Instructions / System Prompt
                </label>
                <textarea
                  value={modelParams.systemInstruction}
                  onChange={(e) => onUpdateParams({ systemInstruction: e.target.value })}
                  rows={4}
                  placeholder="What would you like SARVAGYA to know about you to provide better responses?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                />
              </div>
            </div>
          )}

          {/* 3. Data & Storage */}
          {activeTab === "data" && (
            <div className="space-y-5">
              {/* Export Backup */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Export Data Backup</span>
                  <span className="text-xs text-slate-400">Download conversations, settings, and memory to JSON</span>
                </div>
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>

              {/* Import Backup */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Import Data Backup</span>
                  <span className="text-xs text-slate-400">Restore conversations and configurations</span>
                </div>
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition border border-slate-700 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={onImportBackup}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Clear All Chats */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-rose-400 block">Clear All Conversations</span>
                  <span className="text-xs text-slate-400">Permanently delete local chat history</span>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition border border-rose-500/30"
                >
                  {clearedConfirm ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>{clearedConfirm ? "Cleared" : "Clear History"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Local Storage</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
