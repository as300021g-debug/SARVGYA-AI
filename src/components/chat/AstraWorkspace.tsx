import React, { useState } from "react";
import {
  Sparkles,
  Brain,
  Cpu,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  Code2,
  Terminal,
  Activity,
  Layers,
  ArrowUp,
  RotateCcw,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { ChatMessage, ArtifactItem } from "../../types";
import { MessageItem } from "./MessageItem";
import { ChatInput } from "./ChatInput";

interface AstraWorkspaceProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSendMessage: (text: string, attachments: any[], depth: "rapid" | "deep" | "master") => void;
  onStopGeneration: () => void;
  onOpenArtifact: (artifact: ArtifactItem) => void;
  onRegenerate: () => void;
}

export const AstraWorkspace: React.FC<AstraWorkspaceProps> = ({
  messages,
  isStreaming,
  onSendMessage,
  onStopGeneration,
  onOpenArtifact,
  onRegenerate,
}) => {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [reasoningDepth, setReasoningDepth] = useState<"rapid" | "deep" | "master">("master");
  const [isResearchMode, setIsResearchMode] = useState(true);
  const [isChainOfThoughtExpanded, setIsChainOfThoughtExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<"workspace" | "documents" | "code_architecture">("workspace");

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return;
    onSendMessage(input, attachments, reasoningDepth);
    setInput("");
    setAttachments([]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d0e12] text-slate-100 overflow-hidden relative selection:bg-amber-500/30">
      {/* Premium Astra Header */}
      <header className="px-6 py-3.5 border-b border-amber-500/20 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-[1px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-wide text-white flex items-center gap-1.5">
                <span>ASTRA ADVANCED WORKSPACE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  GPT-6 Astra & Gemini Frontier
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              Spacious high-compute reasoning engine with multi-step proof verification
            </p>
          </div>
        </div>

        {/* Top Controls: Depth & Research Mode */}
        <div className="flex items-center gap-2">
          {/* Research Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsResearchMode(!isResearchMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              isResearchMode
                ? "bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-xs"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Research Mode {isResearchMode ? "Active" : "Off"}</span>
          </button>

          {/* Reasoning Depth Switcher */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setReasoningDepth("rapid")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                reasoningDepth === "rapid"
                  ? "bg-slate-800 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Rapid
            </button>
            <button
              type="button"
              onClick={() => setReasoningDepth("deep")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                reasoningDepth === "deep"
                  ? "bg-slate-800 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Deep (4K Tokens)
            </button>
            <button
              type="button"
              onClick={() => setReasoningDepth("master")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
                reasoningDepth === "master"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-md font-extrabold"
                  : "text-amber-400 hover:text-amber-300"
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Master Proof</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Stream Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Extended Reasoning Accordion Banner */}
          <div className="px-6 py-2 border-b border-amber-500/10 bg-amber-950/20 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-semibold">
                Test-Time Compute Scaling & Autonomous Verification Active
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsChainOfThoughtExpanded(!isChainOfThoughtExpanded)}
              className="flex items-center gap-1 hover:text-white transition text-[11px]"
            >
              <span>{isChainOfThoughtExpanded ? "Collapse Reasoning Process" : "Expand Thinking Breakdown"}</span>
              {isChainOfThoughtExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Thinking Visualizer (Chain of Thought Breakdown) */}
          {isChainOfThoughtExpanded && (
            <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800/80 text-xs text-slate-300 font-mono space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-amber-400 text-[11px] font-bold">
                <Brain className="w-3.5 h-3.5" />
                <span>ACTIVE REASONING TRACE (DAG EXECUTION PIPELINE):</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-0.5">1. Intent & Variable Isolation</span>
                  <p className="text-slate-400 text-[10px]">
                    Deconstructs boundary constraints and mathematically bounds inputs.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-0.5">2. Multi-Model Verification</span>
                  <p className="text-slate-400 text-[10px]">
                    Validates code & logic against strict unit test specifications.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-0.5">3. Live Search Synthesis</span>
                  <p className="text-slate-400 text-[10px]">
                    Anchors facts against live Google Search & financial telemetry.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 max-w-4xl mx-auto w-full">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 my-auto">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 p-0.5 shadow-xl shadow-amber-500/20 mb-4">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-amber-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Astra Frontier Reasoning Workspace
                </h2>
                <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-6">
                  Engineered for complex software systems, algorithmic proofs, deep academic research, and exhaustive multi-document analysis.
                </p>

                {/* Prompt Starters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-lg w-full text-left text-xs">
                  <button
                    type="button"
                    onClick={() => setInput("Architect a fault-tolerant distributed event bus in TypeScript with backpressure handling.")}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 transition"
                  >
                    <span className="font-semibold text-amber-300 block mb-0.5">⚡ Distributed Event Bus</span>
                    <span>TypeScript with backpressure & exponential retry</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInput("Perform an exhaustive quantitative analysis comparing modern post-quantum cryptography algorithms.")}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 transition"
                  >
                    <span className="font-semibold text-amber-300 block mb-0.5">🛡️ Post-Quantum Cryptography</span>
                    <span>Lattice-based security vs classical RSA</span>
                  </button>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <MessageItem
                  key={m.id}
                  message={m}
                  isStreaming={isStreaming && m.id === messages[messages.length - 1]?.id}
                  onRegenerate={onRegenerate}
                  onOpenArtifact={onOpenArtifact}
                />
              ))
            )}
          </div>

          {/* Floating Composer */}
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onStop={onStopGeneration}
            isStreaming={isStreaming}
            attachments={attachments}
            onAddAttachment={(att) => setAttachments((prev) => [...prev, att])}
            onRemoveAttachment={(i) => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
            enableSearch={isResearchMode}
            onToggleSearch={() => setIsResearchMode(!isResearchMode)}
            isListening={false}
            onToggleVoice={() => {}}
            activeModelName="Astra AI (gpt-6-astra)"
            placeholder="Ask Astra AI anything complex, architectural, or mathematical..."
          />
        </div>
      </div>
    </div>
  );
};
