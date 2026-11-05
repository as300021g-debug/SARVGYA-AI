import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Search,
  Sparkles,
  ArrowRight,
  Layers,
  GraduationCap,
  Palette,
  Briefcase,
  TrendingUp,
  Tag,
  MapPin,
  FlaskConical,
  Play,
  CheckCircle2,
  AlertCircle,
  X,
  Code2,
  RefreshCw,
} from "lucide-react";
import { ActiveTab } from "../types";

interface CommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab, payload?: string) => void;
}

interface DispatchResult {
  targetTab: ActiveTab;
  actionTitle: string;
  description: string;
  requiresApproval: boolean;
  approvalSummary: string;
  autoFillPayload: string;
}

export const CommandCenterModal: React.FC<CommandCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState("");
  const [dispatchResult, setDispatchResult] = useState<DispatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [codeMode, setCodeMode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(fibonacci(10)))");
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [executingCode, setExecutingCode] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setDispatchResult(null);
      setCodeMode(false);
      setCodeOutput(null);
    }
  }, [isOpen]);

  // Handle Enter key for dispatch
  const handleDispatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setDispatchResult(null);

    try {
      const res = await fetch("/api/command/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: query.trim() }),
      });
      const data = await res.json();
      if (data.dispatch) {
        setDispatchResult(data.dispatch);
      }
    } catch (err) {
      console.error("Dispatch fault:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run live computational code execution via Host Python 3 & Gemini compute
  const handleExecuteCode = async () => {
    if (!codeSnippet.trim() || executingCode) return;
    setExecutingCode(true);
    setCodeOutput(null);

    try {
      const res = await fetch("/api/code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeSnippet, language: "python" }),
      });
      const data = await res.json();
      if (data.success) {
        setCodeOutput(data.output || data.text || "Execution finished with 0 errors.");
      } else {
        setCodeOutput(`Execution Error: ${data.error || "Failed"}`);
      }
    } catch (err: any) {
      setCodeOutput(`Execution Network Fault: ${err.message}`);
    } finally {
      setExecutingCode(false);
    }
  };

  const executeAction = () => {
    if (!dispatchResult) return;
    onNavigateTab(dispatchResult.targetTab, dispatchResult.autoFillPayload);
    onClose();
  };

  const quickPresets = [
    { label: "Vision Lab: Detect 2D bounding boxes & OCR to JSON", query: "Detect objects and extract text from uploaded images in Vision Lab" },
    { label: "Live Voice: Connect 16kHz PCM duplex audio agent", query: "Connect real-time bidirectional voice agent with Kore persona" },
    { label: "Workbench: Plot mathematical curve with Recharts", query: "Calculate math expression and generate interactive chart data" },
    { label: "Software Studio: Engineer real web app & Python script", query: "Compile and execute real quantitative application in Full-Stack Studio" },
    { label: "Speech & Translate: Multi-speaker TTS & 70+ languages", query: "Synthesize spoken audio and translate into Hindi with cultural nuance" },
    { label: "Study: Create 20 biology quiz questions", query: "Create a 20-question quiz on cellular biology with explanations" },
    { label: "Stock: Analyze Apple (AAPL) quarterly trend", query: "Perform financial and technical analysis for AAPL stock" },
    { label: "Deals: Search active coupon codes for laptops", query: "Find verified coupon promo codes for Dell and Lenovo laptops" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md transition-all">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header / Mode Switcher */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <span className="p-1 rounded bg-cyan-500/10 border border-cyan-500/20">
              <Terminal className="w-4 h-4" />
            </span>
            <span>SARVAGYA Universal Command Center</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCodeMode(!codeMode)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium border transition ${
                codeMode
                  ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/40"
                  : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 inline mr-1" />
              {codeMode ? "Developer Code Runner" : "Code Runner"}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Developer Real Code Runner View */}
        {codeMode ? (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-indigo-300">Live Python 3 Compute Engine (Host & Gemini SDK)</span>
              <span className="text-[10px] text-slate-500">Official Server-Side @google/genai + Python 3.10 Host</span>
            </div>

            <textarea
              rows={6}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={handleExecuteCode}
                disabled={executingCode}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-2 disabled:opacity-50"
              >
                {executingCode ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Executing Live Python 3 Code...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Run Live Python 3 Code
                  </>
                )}
              </button>

              <button
                onClick={() => setCodeMode(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Back to Command Router
              </button>
            </div>

            {codeOutput && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                <div className="text-[10px] uppercase text-slate-500 mb-1">Standard Output:</div>
                {codeOutput}
              </div>
            )}
          </div>
        ) : (
          /* Natural Language Command Bar View */
          <div className="p-4 space-y-4">
            <form onSubmit={handleDispatch} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What would you like SARVAGYA to research, study, create, code, or execute?"
                className="w-full pl-10 pr-24 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Plan & Route
              </button>
            </form>

            {/* Quick Action Presets */}
            {!dispatchResult && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Autonomous Pipelines
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(preset.query);
                      }}
                      className="text-left p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center justify-between group"
                    >
                      <span className="truncate">{preset.label}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dispatch Result Card */}
            {dispatchResult && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/30 to-indigo-950/30 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Target Module: {dispatchResult.targetTab.toUpperCase()}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/40">
                    {dispatchResult.actionTitle}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {dispatchResult.description}
                </p>

                {dispatchResult.requiresApproval && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{dispatchResult.approvalSummary || "Requires user confirmation before applying changes."}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setDispatchResult(null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    Adjust
                  </button>
                  <button
                    onClick={executeAction}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
                  >
                    Execute in {dispatchResult.targetTab.toUpperCase()}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px]">Esc</kbd> Close</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px]">Enter</kbd> Route</span>
          </div>
          <span className="text-[10px] text-slate-500">SARVAGYA Master Blueprint v3.0 Compliance</span>
        </div>
      </div>
    </div>
  );
};
