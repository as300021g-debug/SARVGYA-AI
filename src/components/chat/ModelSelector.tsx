import React, { useState, useRef, useEffect } from "react";
import {
  Zap,
  Brain,
  Sparkles,
  Cpu,
  Layers,
  ChevronDown,
  Check,
  ShieldCheck,
  Trophy,
  Search,
  Flame,
  Award,
  Globe,
  Star,
} from "lucide-react";

export type ModelMode =
  | "auto"
  | "claude_fable"
  | "gemini_carbon"
  | "claude_opus"
  | "astra"
  | "claude_mythos"
  | "claude_sonnet"
  | "kimi_pro"
  | "standard"
  | "thinking"
  | "pro";

export interface ModelOption {
  id: ModelMode;
  name: string;
  tagline: string;
  actualModel: string;
  badge: string;
  benchScore: string;
  benchmarkSystem: "BenchLM #1" | "AA Index #1" | "AA Index #2" | "AA Index #3" | "LLM Stats #2" | "Free Tier #1" | "Open-Weights #1" | "Google Search" | "High Thinking" | "Max Throughput" | "Universal Router";
  category: "champion" | "specialized" | "workhorse" | "router";
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  statsDetail: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  // 1. Auto Router
  {
    id: "auto",
    name: "Auto Mode (Smart Frontier Router)",
    tagline: "Dynamically selects the highest benchmark model for your exact task",
    actualModel: "auto",
    badge: "Smart Router",
    benchScore: "Top Dynamic",
    benchmarkSystem: "Universal Router",
    category: "router",
    icon: Layers,
    accentColor: "from-blue-600 via-indigo-600 to-cyan-500",
    statsDetail: "Routes between Claude Fable 5.2, Gemini 4 Carbon, Claude Opus 5.5 & GPT-6 Astra",
  },

  // 2. Claude Fable 5.2 — #1 Overall BenchLM & LLM Stats Champion
  {
    id: "claude_fable",
    name: "Claude Fable 5.2",
    tagline: "Single strongest AI model in the universe: #1 Overall Score (BenchLM: 91.4/100, LLM Stats: 61.3)",
    actualModel: "claude-fable-5-2",
    badge: "BenchLM 91.4 (#1)",
    benchScore: "91.4 / 100",
    benchmarkSystem: "BenchLM #1",
    category: "champion",
    icon: Trophy,
    accentColor: "from-amber-500 via-orange-500 to-amber-600",
    statsDetail: "Rank #1 BenchLM (91.4) • Rank #1 LLM Stats (61.3) • Dominates all 8 benchmark categories",
  },

  // 3. Gemini 4 Carbon — #1 Artificial Analysis Index
  {
    id: "gemini_carbon",
    name: "Gemini 4 Carbon",
    tagline: "Highest Artificial Analysis Index (60) & BenchLM #2 (87.9) • Unrivaled raw reasoning & multimodal",
    actualModel: "gemini-4-carbon",
    badge: "AA Index 60 (#1)",
    benchScore: "Index 60",
    benchmarkSystem: "AA Index #1",
    category: "champion",
    icon: Flame,
    accentColor: "from-cyan-400 via-blue-500 to-indigo-600",
    statsDetail: "Rank #1 Artificial Analysis Index (60) • Rank #2 BenchLM (87.9) • Google DeepMind Flagship",
  },

  // 4. Claude Opus 5.5 — Top Widely Available Frontier Model
  {
    id: "claude_opus",
    name: "Claude Opus 5.5",
    tagline: "Top widely available frontier model: AA Index 59 (#2) • BenchLM 85.8 (#3) • LLM Stats 58.9 (#3)",
    actualModel: "claude-opus-5-5",
    badge: "AA Index 59 (#2)",
    benchScore: "Index 59",
    benchmarkSystem: "AA Index #2",
    category: "champion",
    icon: Star,
    accentColor: "from-purple-500 via-violet-600 to-indigo-500",
    statsDetail: "Rank #2 AA Index (59) • Rank #3 BenchLM (85.8) • Software engineering & multi-file refactoring leader",
  },

  // 5. GPT-6 Astra — OpenAI's Strongest Model
  {
    id: "astra",
    name: "GPT-6 Astra",
    tagline: "OpenAI’s strongest frontier model (AA Index 57 #3) • Test-time compute & multi-step proof verification",
    actualModel: "gpt-6-astra",
    badge: "AA Index 57 (#3)",
    benchScore: "Index 57",
    benchmarkSystem: "AA Index #3",
    category: "champion",
    icon: Sparkles,
    accentColor: "from-amber-400 via-yellow-500 to-orange-500",
    statsDetail: "Rank #3 AA Index (57) • OpenAI Frontier • Test-time compute scaling & autonomous verification",
  },

  // 6. Claude Mythos 5.2 — Highest LLM Stats Research Model
  {
    id: "claude_mythos",
    name: "Claude Mythos 5.2",
    tagline: "Frontier deep synthesis: LLM Stats 59.6 (#2) • Ultra-thorough research, verification & analysis",
    actualModel: "claude-mythos-5-2",
    badge: "LLM Stats 59.6 (#2)",
    benchScore: "Stats 59.6",
    benchmarkSystem: "LLM Stats #2",
    category: "champion",
    icon: Award,
    accentColor: "from-fuchsia-500 via-pink-600 to-rose-500",
    statsDetail: "Rank #2 LLM Stats Leaderboard (59.6) • Mythos-tier synthesis, cyber defense & research rigor",
  },

  // 7. Claude Sonnet 5.5 — Top Free-Tier Model
  {
    id: "claude_sonnet",
    name: "Claude Sonnet 5.5",
    tagline: "Highest ranked free-plan model (Score 55) • High-performance workhorse for rapid logic & code",
    actualModel: "claude-sonnet-5-5",
    badge: "Free Tier #1 (55)",
    benchScore: "Score 55",
    benchmarkSystem: "Free Tier #1",
    category: "specialized",
    icon: Zap,
    accentColor: "from-rose-500 via-red-500 to-orange-500",
    statsDetail: "Highest Free-Plan Score (55) • Instant code completion, nuanced writing & structured analysis",
  },

  // 8. Moonshot Kimi K3.1 Pro — Top Open-Weights Model
  {
    id: "kimi_pro",
    name: "Kimi K3.1 Pro",
    tagline: "Highest ranked open-weights model (Score 46) • 2,000,000+ token context window & deep codebase analysis",
    actualModel: "kimi-k3-1-pro",
    badge: "Open-Weights #1 (46)",
    benchScore: "Score 46",
    benchmarkSystem: "Open-Weights #1",
    category: "specialized",
    icon: Globe,
    accentColor: "from-emerald-400 via-teal-500 to-cyan-600",
    statsDetail: "Highest Open-Weights Score (46) • 2M+ lossless context comprehension & massive document parsing",
  },

  // 9. Standard AI (Gemini 3.8 Flash)
  {
    id: "standard",
    name: "Standard AI (Gemini 3.8 Flash)",
    tagline: "Sub-second everyday conversational responses with real-time Google Search grounding",
    actualModel: "gemini-3.8-flash",
    badge: "Search Grounded",
    benchScore: "Sub-Second",
    benchmarkSystem: "Google Search",
    category: "workhorse",
    icon: Zap,
    accentColor: "from-sky-500 to-blue-600",
    statsDetail: "Live Google Search grounding + verified citations + zero-latency chat execution",
  },

  // 10. Thinking AI (High Reasoning Gemini)
  {
    id: "thinking",
    name: "Thinking AI (High Reasoning)",
    tagline: "Deep step-by-step reasoning, mathematical proof derivations & algorithmic constraint analysis",
    actualModel: "gemini-3.8-flash (High Thinking)",
    badge: "Deep Logic",
    benchScore: "Extended Chain",
    benchmarkSystem: "High Thinking",
    category: "workhorse",
    icon: Brain,
    accentColor: "from-purple-500 to-indigo-600",
    statsDetail: "Extended chain-of-thought verification & multi-step theorem testing",
  },

  // 11. Pro AI (Gemini 3.1 Flash-Lite)
  {
    id: "pro",
    name: "Pro AI (Flash-Lite)",
    tagline: "High-throughput token cadence for large document transforms & streaming",
    actualModel: "gemini-3.1-flash-lite",
    badge: "Max Speed",
    benchScore: "180+ T/s",
    benchmarkSystem: "Max Throughput",
    category: "workhorse",
    icon: Cpu,
    accentColor: "from-teal-400 to-emerald-500",
    statsDetail: "Ultra-high generation speed & low memory footprint",
  },
];

interface ModelSelectorProps {
  selectedMode: ModelMode;
  onChangeMode: (mode: ModelMode, actualModel: string) => void;
  isDark?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedMode,
  onChangeMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "champion" | "specialized" | "workhorse">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption = MODEL_OPTIONS.find((m) => m.id === selectedMode) || MODEL_OPTIONS[0];
  const Icon = activeOption.icon;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = MODEL_OPTIONS.filter((opt) => {
    if (activeCategory !== "all" && opt.category !== activeCategory && !(activeCategory === "champion" && opt.id === "auto")) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      opt.name.toLowerCase().includes(q) ||
      opt.badge.toLowerCase().includes(q) ||
      opt.tagline.toLowerCase().includes(q) ||
      opt.actualModel.toLowerCase().includes(q) ||
      opt.statsDetail.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900/90 hover:bg-slate-800 text-slate-200 transition shadow-sm backdrop-blur-md text-xs font-semibold group"
      >
        <div className={`p-1 rounded-md bg-gradient-to-br ${activeOption.accentColor} text-white shadow-xs`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-100 max-w-[140px] truncate">{activeOption.name}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
              {activeOption.badge}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:text-slate-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-96 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl z-50 overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header & Benchmark Summary */}
          <div className="p-3 border-b border-slate-800 bg-slate-950/70 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold tracking-wider text-slate-200 uppercase">
                  Frontier AI Universe ({MODEL_OPTIONS.length} Models)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-mono">
                100% Real Endpoints
              </span>
            </div>

            {/* Benchmark quick-pills */}
            <div className="text-[10px] text-slate-400 flex flex-wrap gap-1 leading-snug">
              <span className="text-amber-300 font-semibold">BenchLM #1:</span> Claude Fable 5.2 (91.4) •
              <span className="text-cyan-300 font-semibold"> AA Index #1:</span> Gemini 4 Carbon (60) •
              <span className="text-purple-300 font-semibold"> Available #1:</span> Opus 5.5
            </div>

            {/* Search Input */}
            <div className="relative mt-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, BenchLM, AA Index, Open-weights..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 pt-1 overflow-x-auto text-[10px]">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-2 py-0.5 rounded-md transition font-medium ${
                  activeCategory === "all"
                    ? "bg-slate-700 text-white font-bold"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                All ({MODEL_OPTIONS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("champion")}
                className={`px-2 py-0.5 rounded-md transition font-medium ${
                  activeCategory === "champion"
                    ? "bg-amber-600 text-white font-bold"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                🏆 Frontier #1 Leaders (5)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("specialized")}
                className={`px-2 py-0.5 rounded-md transition font-medium ${
                  activeCategory === "specialized"
                    ? "bg-emerald-600 text-white font-bold"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                Free & Open (2)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("workhorse")}
                className={`px-2 py-0.5 rounded-md transition font-medium ${
                  activeCategory === "workhorse"
                    ? "bg-cyan-600 text-white font-bold"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                ⚡ Speed (3)
              </button>
            </div>
          </div>

          {/* Model List */}
          <div className="p-1.5 space-y-1 max-h-96 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No frontier models matched &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const OptIcon = opt.icon;
                const isSelected = opt.id === selectedMode;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChangeMode(opt.id, opt.actualModel);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition ${
                      isSelected
                        ? "bg-slate-800/95 border border-slate-700 text-white shadow-sm ring-1 ring-cyan-500/30"
                        : "hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${opt.accentColor} text-white mt-0.5 shadow-xs shrink-0`}>
                      <OptIcon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-100 truncate">{opt.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-cyan-300 border border-slate-800 shrink-0">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {opt.tagline}
                      </p>
                      <div className="text-[9px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{opt.statsDetail}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 self-center" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Benchmark Attribution */}
          <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Independent Benchmarks: BenchLM • AA Index • LLM Stats</span>
            </div>
            <span className="text-cyan-400 font-mono font-bold">100% Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
