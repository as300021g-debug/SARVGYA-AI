import React from "react";
import { X, Sparkles, Code2, Search, BookOpen, PenTool, TrendingUp, Cpu, ArrowRight } from "lucide-react";

interface GPTPersona {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  promptStarter: string;
  badge: string;
  gradient: string;
}

const PERSONAS: GPTPersona[] = [
  {
    id: "code-architect",
    name: "Code Architect & Debugger",
    role: "Senior Software Engineer",
    description: "Architects scalable full-stack applications, refactors legacy code, and debugs complex concurrency issues in Python, TypeScript, React, and Go.",
    icon: Code2,
    promptStarter: "Write a high-performance TypeScript microservice with rate limiting and exponential backoff retry logic.",
    badge: "Coding",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    id: "deep-research",
    name: "Deep Research Analyst",
    role: "Scientific & Market Investigator",
    description: "Performs exhaustive multi-source web investigations, cross-verifies empirical claims, and delivers publication-grade synthesis with source citations.",
    icon: Search,
    promptStarter: "Conduct a deep research report on the current commercial viability of solid-state lithium batteries in 2026.",
    badge: "Research",
    gradient: "from-emerald-600 to-teal-500",
  },
  {
    id: "stem-tutor",
    name: "STEM Professor & Tutor",
    role: "Mathematics & Physics Educator",
    description: "Breaks down complex equations, calculus proofs, quantum mechanics, and organic chemistry step-by-step with intuitive analogies.",
    icon: BookOpen,
    promptStarter: "Explain Fourier Transforms intuitively and show how they are calculated with step-by-step math.",
    badge: "Education",
    gradient: "from-purple-600 to-pink-500",
  },
  {
    id: "creative-writer",
    name: "Narrative & Creative Studio",
    role: "World-Class Author & Copywriter",
    description: "Crafts compelling stories, screenplays, editorial essays, and high-converting marketing copy with nuanced tonal control.",
    icon: PenTool,
    promptStarter: "Write a gripping sci-fi opening chapter about an AI operating system discovering an unrecognized physical constant.",
    badge: "Writing",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "executive-analyst",
    name: "Quantitative Financial Analyst",
    role: "Macroeconomic & Equities Strategist",
    description: "Analyzes quarterly financial statements, evaluates valuation multiples, and tracks institutional market liquidity in real time.",
    icon: TrendingUp,
    promptStarter: "Analyze Apple and Nvidia financial reports, comparing operating cash flows and margin trajectories.",
    badge: "Finance",
    gradient: "from-rose-600 to-red-500",
  },
];

interface ExploreGPTsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPersona: (promptStarter: string, personaName: string) => void;
}

export const ExploreGPTsModal: React.FC<ExploreGPTsModalProps> = ({
  isOpen,
  onClose,
  onSelectPersona,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Explore Specialized GPTs</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Launch pre-configured specialized intelligence personas tailored for specific tasks
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Personas Grid */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPersona(p.promptStarter, p.name);
                  onClose();
                }}
                className="group flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 hover:border-slate-700 transition cursor-pointer shadow-sm"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${p.gradient} text-white shadow-md shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {p.badge}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {p.description}
                  </p>

                  <div className="text-[11px] font-mono text-indigo-400 bg-indigo-950/30 px-2.5 py-1 rounded-md border border-indigo-900/40 truncate">
                    Starter: "{p.promptStarter}"
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>All personas connect to 100% real live endpoints</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
