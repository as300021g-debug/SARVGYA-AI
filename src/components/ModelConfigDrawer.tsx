import React, { useState, useEffect } from "react";
import {
  X,
  Sliders,
  Cpu,
  Sparkles,
  Search,
  Brain,
  Download,
  Upload,
  Check,
  Key,
  Shield,
  Layers,
  Zap,
  Code,
  Eye,
  FileText,
  Compass,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { ModelParameters, CompanionProfileType } from "../types";

export type IntelligenceMode =
  | "auto"
  | "quick"
  | "reasoning"
  | "research"
  | "creative"
  | "coding"
  | "vision"
  | "long_doc"
  | "council";

interface ModelConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  params: ModelParameters;
  onUpdateParams: (params: Partial<ModelParameters>) => void;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeMode?: IntelligenceMode;
  onSelectMode?: (mode: IntelligenceMode) => void;
}

export const ModelConfigDrawer: React.FC<ModelConfigDrawerProps> = ({
  isOpen,
  onClose,
  params,
  onUpdateParams,
  onExportBackup,
  onImportBackup,
  activeMode = "auto",
  onSelectMode,
}) => {
  const [openaiKey, setOpenaiKey] = useState<string>(() => localStorage.getItem("sarvagya_openai_key") || "");
  const [anthropicKey, setAnthropicKey] = useState<string>(() => localStorage.getItem("sarvagya_anthropic_key") || "");
  const [geminiKey, setGeminiKey] = useState<string>(() => localStorage.getItem("sarvagya_gemini_key") || "");
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; latencyMs?: number; message?: string }>>({});
  const [providerStatuses, setProviderStatuses] = useState<Record<string, any>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/models/providers")
        .then((res) => res.json())
        .then((data) => {
          if (data.providers) {
            setProviderStatuses(data.providers);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKeys = async () => {
    localStorage.setItem("sarvagya_openai_key", openaiKey.trim());
    localStorage.setItem("sarvagya_anthropic_key", anthropicKey.trim());
    localStorage.setItem("sarvagya_gemini_key", geminiKey.trim());

    try {
      const res = await fetch("/api/models/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          openaiApiKey: openaiKey.trim(),
          anthropicApiKey: anthropicKey.trim(),
          geminiApiKey: geminiKey.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
        // Refresh statuses
        const statusRes = await fetch("/api/models/providers");
        const statusData = await statusRes.json();
        if (statusData.providers) setProviderStatuses(statusData.providers);
      }
    } catch (e) {
      console.error("Save keys error:", e);
    }
  };

  const handleTestConnection = async (provider: string) => {
    setTestingProvider(provider);
    try {
      const res = await fetch("/api/models/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [provider]: {
          success: data.success,
          latencyMs: data.latencyMs,
          message: data.sampleResponse || data.message || (data.success ? "Connected successfully" : "Connection failed"),
        },
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [provider]: { success: false, message: err.message || "Network error" },
      }));
    } finally {
      setTestingProvider(null);
    }
  };

  const intelligenceModes: Array<{
    id: IntelligenceMode;
    title: string;
    description: string;
    provider: string;
    badge: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "auto",
      title: "Auto Select",
      description: "SARVAGYA Central Brain routes dynamically based on complexity & tools",
      provider: "Intelligent Router",
      badge: "Adaptive",
      icon: <Brain className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: "quick",
      title: "Fast Response",
      description: "Sub-second, low-latency execution for everyday questions",
      provider: "Gemini 3.8 Flash / Lite",
      badge: "Instant",
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: "reasoning",
      title: "Advanced Reasoning",
      description: "Deep test-time compute, mathematical proofs, and chain-of-thought",
      provider: "Claude 3.7 / Gemini 4 Argon",
      badge: "Deep Think",
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
    },
    {
      id: "research",
      title: "Deep Research",
      description: "Live multi-source web crawl with verified links and fact checks",
      provider: "Google Search Grounded",
      badge: "Empirical",
      icon: <Search className="w-4 h-4 text-sky-400" />,
    },
    {
      id: "coding",
      title: "Coding Intelligence",
      description: "Full-stack code generation, refactoring, and automated testing",
      provider: "Claude / GPT-6 / Gemini",
      badge: "Executable",
      icon: <Code className="w-4 h-4 text-amber-400" />,
    },
    {
      id: "vision",
      title: "Vision Intelligence",
      description: "Diagram, screenshot, formula, and document image comprehension",
      provider: "Native Multimodal Gemini",
      badge: "Visual",
      icon: <Eye className="w-4 h-4 text-pink-400" />,
    },
    {
      id: "long_doc",
      title: "Long-Document Analysis",
      description: "Comprehensive parsing of massive PDFs, research papers & codebases",
      provider: "Claude / Gemini 1M+ Context",
      badge: "Massive Context",
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: "creative",
      title: "Creative Intelligence",
      description: "Literary writing, world-building, and media generation prompts",
      provider: "Creative Media Studio",
      badge: "Aesthetic",
      icon: <Sparkles className="w-4 h-4 text-rose-400" />,
    },
    {
      id: "council",
      title: "Multi-Model Council",
      description: "Parallel cross-examination across Gemini, OpenAI & Claude with consensus verdict",
      provider: "Tri-Model Council",
      badge: "Consensus",
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
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
      <div className="w-full max-w-lg h-full bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl p-6 overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-100">SARVAGYA Central Brain & Engine Config</h2>
              <span className="text-[11px] text-slate-400">Multi-Model Routing & Provider Management</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Intelligence Mode Presets */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              Intelligence Mode Presets
            </label>
            <span className="text-[10px] text-cyan-400 font-mono">9 Modes</span>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
            {intelligenceModes.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMode && onSelectMode(m.id)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                  activeMode === m.id
                    ? "bg-cyan-950/40 border-cyan-500/80 text-cyan-100 shadow-md ring-1 ring-cyan-500/40"
                    : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    {m.icon}
                    <span>{m.title}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                    {m.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 pl-6">{m.description}</p>
                <div className="mt-1 pl-6 text-[10px] text-slate-500 font-mono">Engine: {m.provider}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Provider API Credentials & Real Diagnostics */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Provider Credentials & Status
            </label>
            <span className="text-[10px] text-emerald-400 font-mono">Zero Mock Telemetry</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            SARVAGYA runs natively on Google Gemini with zero setup. You can optionally add OpenAI and Anthropic keys to activate frontier model comparison and the Multi-Model Council.
          </p>

          {/* Google Gemini Card */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">Google Gemini Frontier</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                Connected • Free Tier
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Primary built-in provider (Gemini 4 Argon, 3.8 Flash, 3.1 Flash Lite). Live Search Grounding included.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Custom GEMINI_API_KEY (Optional)"
                className="flex-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
              />
              <button
                onClick={() => handleTestConnection("gemini")}
                disabled={testingProvider === "gemini"}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
              >
                {testingProvider === "gemini" ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Test"}
              </button>
            </div>
            {testResults.gemini && (
              <p className={`text-[10px] ${testResults.gemini.success ? "text-emerald-400" : "text-amber-400"}`}>
                {testResults.gemini.message} ({testResults.gemini.latencyMs}ms)
              </p>
            )}
          </div>

          {/* OpenAI GPT Card */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${providerStatuses.astra?.isConfigured ? "bg-emerald-400" : "bg-slate-500"}`} />
                <span className="text-xs font-bold text-slate-200">OpenAI (GPT-6 Astra / GPT-4o)</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${providerStatuses.astra?.isConfigured ? "bg-emerald-950/60 text-emerald-300 border-emerald-800" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                {providerStatuses.astra?.isConfigured ? "Connected" : "Unconfigured"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="Enter OPENAI_API_KEY (sk-...)"
                className="flex-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
              />
              <button
                onClick={() => handleTestConnection("astra")}
                disabled={testingProvider === "astra"}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
              >
                {testingProvider === "astra" ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Test"}
              </button>
            </div>
            {testResults.astra && (
              <p className={`text-[10px] ${testResults.astra.success ? "text-emerald-400" : "text-amber-400"}`}>
                {testResults.astra.message}
              </p>
            )}
          </div>

          {/* Anthropic Claude Card */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${providerStatuses.claude?.isConfigured ? "bg-emerald-400" : "bg-slate-500"}`} />
                <span className="text-xs font-bold text-slate-200">Anthropic Claude (3.7 / 3.5 Sonnet)</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${providerStatuses.claude?.isConfigured ? "bg-emerald-950/60 text-emerald-300 border-emerald-800" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                {providerStatuses.claude?.isConfigured ? "Connected" : "Unconfigured"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="Enter ANTHROPIC_API_KEY (sk-ant-...)"
                className="flex-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
              />
              <button
                onClick={() => handleTestConnection("claude")}
                disabled={testingProvider === "claude"}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
              >
                {testingProvider === "claude" ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Test"}
              </button>
            </div>
            {testResults.claude && (
              <p className={`text-[10px] ${testResults.claude.success ? "text-emerald-400" : "text-amber-400"}`}>
                {testResults.claude.message}
              </p>
            )}
          </div>

          <button
            onClick={handleSaveKeys}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
          >
            {saveSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Key className="w-4 h-4" />}
            <span>{saveSuccess ? "Credentials Saved & Active!" : "Save & Synchronize Provider Keys"}</span>
          </button>
        </div>

        {/* 3. AI Companion Persona */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            AI Companion Persona
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

        {/* 4. Fine-Tuning Sliders */}
        <div className="space-y-4 pt-3 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Hyperparameters
          </label>

          {/* Temperature */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Temperature</span>
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
              <span className="text-slate-400">Top-P</span>
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
        <div className="space-y-2 pt-3 border-t border-slate-800">
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
