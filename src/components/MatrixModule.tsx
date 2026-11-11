import React, { useState } from "react";
import {
  Layers,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Trophy,
  Flame,
  Award,
  Star,
  Globe,
  ChevronDown,
  ChevronUp,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { MatrixResponseItem } from "../types";

export const MatrixModule: React.FC = () => {
  const [prompt, setPrompt] = useState(
    "Compare quantum computing qubits vs classical bits, explain Shor's algorithm impact on RSA cryptography, and provide a verified Python simulation."
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatrixResponseItem[] | null>(null);
  const [totalLatency, setTotalLatency] = useState<number | null>(null);
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [synthesizing, setSynthesizing] = useState(false);
  const [category, setCategory] = useState<
    "benchmark_champions" | "frontier" | "gemini_family" | "gpt_family" | "claude_family" | "open_weights"
  >("benchmark_champions");
  const [showBenchmarkLeaderboard, setShowBenchmarkLeaderboard] = useState(true);

  const handleRunMatrix = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResults(null);
    setSynthesis(null);

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), category }),
      });
      const data = await res.json();

      if (data.matrixResponses) {
        setResults(data.matrixResponses);
        setTotalLatency(data.latencyMs);
      }
    } catch (err) {
      console.error("Matrix execution error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSynthesize = async () => {
    if (!results || synthesizing) return;
    setSynthesizing(true);

    try {
      const combinedAnswers = results.map((r) => `[${r.name} (${r.provider})]:\n${r.answer}`).join("\n\n");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Synthesize the following frontier AI perspectives into the single most definitive, mathematically verified, and complete consensus answer:\n\n${combinedAnswers}`,
          model: "gemini-3.8-flash",
          highThinking: true,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setSynthesis(data.reply);
      }
    } catch (e) {
      console.error("Synthesis error:", e);
    } finally {
      setSynthesizing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Frontier Multi-Model Matrix & Intelligence Index</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Universal AI Orchestration across Claude Fable 5.2 (#1 BenchLM 91.4), Gemini 4 Carbon (#1 AA Index 60), Claude Opus 5.5 (#2 AA Index 59), GPT-6 Astra (#3 AA Index 57), Claude Mythos 5.2 (#2 LLM Stats 59.6), and Kimi K3.1 Pro (#1 Open-Weights 46).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowBenchmarkLeaderboard(!showBenchmarkLeaderboard)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300 transition"
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showBenchmarkLeaderboard ? "Hide Benchmarks" : "Show Benchmarks"}</span>
            {showBenchmarkLeaderboard ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {totalLatency !== null && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Parallel Execution:</span>
              <span className="font-bold text-cyan-300">{totalLatency}ms</span>
            </div>
          )}
        </div>
      </div>

      {/* Benchmark Summary Section */}
      {showBenchmarkLeaderboard && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900 to-indigo-950/30 border border-slate-700/80 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Independent Benchmark Systems Consensus (BenchLM • Artificial Analysis • LLM Stats)
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              3 Sources Agree: Claude Family & Gemini 4 Carbon Dominate Frontier
            </span>
          </div>

          {/* 3 Benchmark Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. BenchLM */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> 1. BenchLM (Overall)
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">8 Categories</span>
              </div>
              <p className="text-[11px] text-slate-400">Holistic benchmark: reasoning, coding, agentic tasks & multimodal.</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between p-1 rounded bg-slate-900/80">
                  <span className="font-semibold text-amber-200">1. Claude Fable 5.2</span>
                  <span className="font-mono text-amber-400 font-bold">91.4 / 100</span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-slate-900/40 text-slate-300">
                  <span>2. Gemini 4 Carbon</span>
                  <span className="font-mono text-slate-400">87.9</span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-slate-900/40 text-slate-400">
                  <span>3. Claude Opus 5.5</span>
                  <span className="font-mono text-slate-500">85.8</span>
                </div>
              </div>
            </div>

            {/* 2. Artificial Analysis */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-cyan-400" /> 2. Artificial Analysis Index
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">Raw Reasoning</span>
              </div>
              <p className="text-[11px] text-slate-400">Focuses on pure reasoning, mathematical logic & coding throughput.</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between p-1 rounded bg-slate-900/80">
                  <span className="font-semibold text-cyan-200">1. Gemini 4 Carbon</span>
                  <span className="font-mono text-cyan-400 font-bold">Index 60</span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-slate-900/40 text-slate-300">
                  <span>2. Claude Opus 5.5</span>
                  <span className="font-mono text-slate-400">Index 59</span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-slate-900/40 text-slate-400">
                  <span>3. GPT-6 Astra</span>
                  <span className="font-mono text-slate-500">Index 57</span>
                </div>
              </div>
            </div>

            {/* 3. LLM Stats Leaderboard */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-fuchsia-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-fuchsia-400" /> 3. LLM Stats Leaderboard
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-fuchsia-950 text-fuchsia-300 font-mono">Intelligence + Speed</span>
              </div>
              <p className="text-[11px] text-slate-400">Blends intelligence, inference cadence, context & price performance.</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between p-1 rounded bg-slate-900/80">
                  <span className="font-semibold text-fuchsia-200">1. Claude Fable 5.2</span>
                  <span className="font-mono text-fuchsia-400 font-bold">61.3</span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-slate-900/40 text-slate-300">
                  <span>2. Claude Mythos 5.2</span>
                  <span className="font-mono text-slate-400">59.6</span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-slate-900/40 text-slate-400">
                  <span>3. Claude Opus 5.5</span>
                  <span className="font-mono text-slate-500">58.9</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dimension Champions Quick Table */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
              What “Most Powerful” Means — Dimension Champions
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Overall Score #1</div>
                <div className="font-bold text-amber-300">Claude Fable 5.2</div>
                <div className="text-[9px] text-slate-500 font-mono">BenchLM 91.4</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Raw Reasoning #1</div>
                <div className="font-bold text-cyan-300">Gemini 4 Carbon</div>
                <div className="text-[9px] text-slate-500 font-mono">AA Index 60</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Top Widely Available</div>
                <div className="font-bold text-purple-300">Claude Opus 5.5</div>
                <div className="text-[9px] text-slate-500 font-mono">AA Index 59</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Best OpenAI Model</div>
                <div className="font-bold text-yellow-300">GPT-6 Astra</div>
                <div className="text-[9px] text-slate-500 font-mono">AA Index 57</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Best Free-Tier Model</div>
                <div className="font-bold text-rose-300">Claude Sonnet 5.5</div>
                <div className="text-[9px] text-slate-500 font-mono">Score 55</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Best Open-Weights</div>
                <div className="font-bold text-emerald-300">Kimi K3.1 Pro</div>
                <div className="text-[9px] text-slate-500 font-mono">Score 46 • 2M Context</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setCategory("benchmark_champions")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            category === "benchmark_champions"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>🏆 Benchmark Champions (Claude Fable 5.2 • Gemini 4 Carbon • Claude Opus 5.5 • GPT-6 Astra • Kimi)</span>
        </button>

        <button
          type="button"
          onClick={() => setCategory("gemini_family")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            category === "gemini_family"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-sky-400" />
          <span>Gemini Ecosystem (Carbon • Argon • 3.8 Flash • 3 Deep Think)</span>
        </button>

        <button
          type="button"
          onClick={() => setCategory("gpt_family")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            category === "gpt_family"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>OpenAI GPT-6 (GPT-6 Astra • GPT-6 Sol • GPT-6.1 Terra • GPT-Rosalind)</span>
        </button>

        <button
          type="button"
          onClick={() => setCategory("claude_family")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            category === "claude_family"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Star className="w-3.5 h-3.5 text-purple-400" />
          <span>Claude Mythos (Fable 5.2 • Opus 5.5 • Mythos 5.2 • Sonnet 5.5)</span>
        </button>

        <button
          type="button"
          onClick={() => setCategory("open_weights")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            category === "open_weights"
              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>Open-Weights (Kimi K3.1 Pro • DeepSeek V4 Pro • Llama 4 Scout • Mistral)</span>
        </button>
      </div>

      {/* Input query form */}
      <form onSubmit={handleRunMatrix} className="space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter complex query or prompt to test across all premier benchmark models simultaneously..."
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Frontier Benchmark Models Armed & Connected</span>
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-indigo-600 to-cyan-600 hover:from-amber-500 hover:to-cyan-500 text-white font-semibold text-xs disabled:opacity-50 flex items-center gap-2 transition-all shadow-md shadow-indigo-950/40"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Executing Matrix Across All Models in Parallel...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Execute Multi-Model Matrix
              </>
            )}
          </button>
        </div>
      </form>

      {/* Synthesis Section */}
      {results && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-slate-100">{results.length} Model Outputs Captured.</span> Compare side-by-side or synthesize a single consensus answer with Gemini Frontier.
          </div>
          <button
            onClick={handleSynthesize}
            disabled={synthesizing}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {synthesizing ? "Synthesizing Consensus..." : "Synthesize Best Consensus"}
          </button>
        </div>
      )}

      {synthesis && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Universal Frontier Consensus Synthesis
          </div>
          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {synthesis}
          </div>
        </div>
      )}

      {/* Models Grid */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((item, index) => {
            const isFable = item.name.includes("Fable");
            const isCarbon = item.name.includes("Carbon");
            const isOpus = item.name.includes("Opus");
            const isAstra = item.name.includes("Astra");
            const isKimi = item.name.includes("Kimi");

            let cardBorder = "border-slate-800";
            let badgeBg = "bg-slate-800 text-slate-300 border-slate-700";

            if (isFable) {
              cardBorder = "border-amber-500/40 ring-1 ring-amber-500/20";
              badgeBg = "bg-amber-500/10 text-amber-300 border-amber-500/30";
            } else if (isCarbon) {
              cardBorder = "border-cyan-500/40 ring-1 ring-cyan-500/20";
              badgeBg = "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
            } else if (isOpus) {
              cardBorder = "border-purple-500/40 ring-1 ring-purple-500/20";
              badgeBg = "bg-purple-500/10 text-purple-300 border-purple-500/30";
            } else if (isAstra) {
              cardBorder = "border-yellow-500/40 ring-1 ring-yellow-500/20";
              badgeBg = "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
            } else if (isKimi) {
              cardBorder = "border-emerald-500/40 ring-1 ring-emerald-500/20";
              badgeBg = "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
            }

            return (
              <div
                key={index}
                className={`flex flex-col bg-slate-900/90 rounded-2xl border ${cardBorder} p-4 space-y-3 shadow-lg shadow-black/30`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeBg}`}>
                      {item.provider}
                    </span>
                    <span className="font-bold text-sm text-slate-100">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {item.latencyMs}ms
                    </span>
                    {item.success ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                </div>

                {/* Subtitle / Mode */}
                <div className="text-[11px] text-slate-500 font-mono">
                  Mode: <span className="text-slate-400">{item.mode}</span> | Slug: {item.slug}
                </div>

                {/* Answer Content */}
                <div className="flex-1 text-xs text-slate-200 leading-relaxed overflow-y-auto max-h-96 whitespace-pre-wrap pr-1">
                  {item.answer}
                </div>

                {/* Sources if present */}
                {item.sources && item.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-cyan-400 font-semibold">Citations: </span>
                    {item.sources.map((s, i) => (
                      <a
                        key={i}
                        href={s.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-cyan-300 underline mr-2"
                      >
                        {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
