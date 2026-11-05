import React, { useState } from "react";
import { Layers, Zap, Clock, CheckCircle2, AlertTriangle, Sparkles, Send } from "lucide-react";
import { MatrixResponseItem } from "../types";

export const MatrixModule: React.FC = () => {
  const [prompt, setPrompt] = useState("Compare quantum computing qubits vs classical bits and outline real-world cryptography implications.");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatrixResponseItem[] | null>(null);
  const [totalLatency, setTotalLatency] = useState<number | null>(null);
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [synthesizing, setSynthesizing] = useState(false);
  const [category, setCategory] = useState<"frontier" | "gemini_family" | "gpt_family" | "claude_family" | "open_weights">("frontier");

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
      const combinedAnswers = results.map((r) => `[${r.name}]:\n${r.answer}`).join("\n\n");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Synthesize the following 4 frontier AI perspectives into the single most definitive, coherent, and verified consensus response:\n\n${combinedAnswers}`,
          model: "gemini-3.8-flash",
          highThinking: false,
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
            <h1 className="text-xl font-bold text-slate-100">Frontier Multi-Model Matrix</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simultaneous parallel execution & comparative evaluation across Proprietary Frontier Models (GPT-6 Astra, Claude Opus 5.5, Gemini 4 Argon, Grok 4.7) and Global Open-Weights (DeepSeek V4 Pro, Llama 4 Scout, Qwen3.8 Max, Mistral Large 3).
          </p>
        </div>

        {totalLatency !== null && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Total Matrix Time:</span>
            <span className="font-bold text-cyan-300">{totalLatency}ms</span>
          </div>
        )}
      </div>

      {/* Input query form */}
      {/* Category Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setCategory("frontier")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            category === "frontier"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>1. Frontier Labs (GPT-6 Astra • Claude Opus 5.5 • Gemini 4 Argon • Grok 4.7)</span>
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
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>2. Gemini Ecosystem (Argon • 3.8 Flash • 3 Deep Think • 3.5 Flash-Lite)</span>
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
          <span>3. OpenAI GPT-6 (GPT-6 Astra • GPT-6 Sol • GPT-6.1 Terra • GPT-Rosalind)</span>
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
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>4. Claude Mythos (Fable 5.1 • Opus 5.5 • Sonnet 5.5 • Haiku 5.5)</span>
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
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>5. Open-Weights (DeepSeek V4 Pro • Llama 4 Scout • Qwen3.8 Max • Mistral Large 3)</span>
        </button>
      </div>

      <form onSubmit={handleRunMatrix} className="space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter complex query or prompt to test across all 4 premier models simultaneously..."
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>4 Premier Neural Engines Armed & Ready</span>
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs disabled:opacity-50 flex items-center gap-2 transition-all shadow-md shadow-cyan-950/40"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Executing Matrix in Parallel...
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
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-slate-100">4 Model Outputs Captured.</span> Compare side-by-side or synthesize a single consensus answer with Gemini 4 Argon.
          </div>
          <button
            onClick={handleSynthesize}
            disabled={synthesizing}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
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
            Frontier Consensus Synthesis (Powered by Gemini 4 Argon)
          </div>
          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {synthesis}
          </div>
        </div>
      )}

      {/* 4 Models Grid */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((item, index) => {
            const providerColors: Record<string, string> = {
              Anthropic: "text-amber-400 bg-amber-500/10 border-amber-500/20",
              Google: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
              OpenAI: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
              DeepSeek: "text-purple-400 bg-purple-500/10 border-purple-500/20",
            };

            const badgeStyle = providerColors[item.provider] || "text-slate-300 bg-slate-800 border-slate-700";

            return (
              <div
                key={index}
                className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-lg shadow-black/30"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeStyle}`}>
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
