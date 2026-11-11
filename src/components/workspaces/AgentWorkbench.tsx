import React, { useState } from "react";
import {
  Bot,
  Calculator,
  Kanban,
  Table as TableIcon,
  Code2,
  Sparkles,
  Download,
  Copy,
  Check,
  Plus,
  Play,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Search,
  Code,
  GraduationCap,
  PenTool,
  BarChart3,
  Calendar,
  Globe,
  Palette,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  Terminal,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  dueDate: string;
}

type SpecialistAgentId =
  | "research"
  | "coding"
  | "education"
  | "writing"
  | "data_analysis"
  | "personal_assistant"
  | "browser"
  | "creative"
  | "planning";

interface SpecialistAgentDef {
  id: SpecialistAgentId;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  defaultGoal: string;
  color: string;
  badge: string;
}

const SPECIALIST_AGENTS: SpecialistAgentDef[] = [
  {
    id: "research",
    name: "Research Agent",
    tagline: "Deep web crawl, multi-source cross-referencing & verifiable citations",
    icon: <Search className="w-4 h-4 text-sky-400" />,
    defaultGoal: "Synthesize latest 2026 developments in quantum computing, qubit coherence times, and post-quantum cryptography.",
    color: "from-sky-500/20 to-blue-600/20",
    badge: "Search Grounded",
  },
  {
    id: "coding",
    name: "Coding Agent",
    tagline: "Autonomous architecture, executable full-stack code & unit test generation",
    icon: <Code className="w-4 h-4 text-amber-400" />,
    defaultGoal: "Build a high-performance LRU cache in TypeScript with O(1) get/put operations, generics, and Jest unit tests.",
    color: "from-amber-500/20 to-orange-600/20",
    badge: "Executable Code",
  },
  {
    id: "education",
    name: "Education Agent",
    tagline: "Socratic pedagogy, step-by-step problem solving & CBSE/JEE exam drills",
    icon: <GraduationCap className="w-4 h-4 text-emerald-400" />,
    defaultGoal: "Explain Faraday's Law of Electromagnetic Induction with Lenz's Law, real-world generator analogy, and 3 practice problems.",
    color: "from-emerald-500/20 to-teal-600/20",
    badge: "Socratic Tutor",
  },
  {
    id: "writing",
    name: "Writing Agent",
    tagline: "Executive summaries, long-form essays, rhetoric & style calibration",
    icon: <PenTool className="w-4 h-4 text-purple-400" />,
    defaultGoal: "Draft an executive briefing on AI operating systems for Fortune 500 leadership, highlighting ROI, security, and edge agents.",
    color: "from-purple-500/20 to-indigo-600/20",
    badge: "Executive Polish",
  },
  {
    id: "data_analysis",
    name: "Data Analysis Agent",
    tagline: "Statistical analysis, trend forecasting, variance decomposition & data tables",
    icon: <BarChart3 className="w-4 h-4 text-cyan-400" />,
    defaultGoal: "Analyze quarterly SaaS metrics with 42% YoY ARR growth, 118% net dollar retention, and 72% gross margins.",
    color: "from-cyan-500/20 to-sky-600/20",
    badge: "Quantitative",
  },
  {
    id: "personal_assistant",
    name: "Personal Assistant Agent",
    tagline: "Schedule planning, routine management, calendar blocking & action items",
    icon: <Calendar className="w-4 h-4 text-pink-400" />,
    defaultGoal: "Plan a highly productive 12-hour Saturday routine balancing deep engineering work, physical exercise, and study sessions.",
    color: "from-pink-500/20 to-rose-600/20",
    badge: "Life Optimizer",
  },
  {
    id: "browser",
    name: "Browser Agent",
    tagline: "Live web extraction, DOM parsing & fact verification in secure sandbox",
    icon: <Globe className="w-4 h-4 text-teal-400" />,
    defaultGoal: "Inspect current flight travel restrictions and electronic visa procedures for international travelers entering India.",
    color: "from-teal-500/20 to-emerald-600/20",
    badge: "Web Extraction",
  },
  {
    id: "creative",
    name: "Creative Studio Agent",
    tagline: "Art direction, world-building narrative & image/video/audio prompt suites",
    icon: <Palette className="w-4 h-4 text-rose-400" />,
    defaultGoal: "Create a visual art direction concept for a cyberpunk observatory overlooking the Himalayas, including Imagen 3 and Veo 2 prompts.",
    color: "from-rose-500/20 to-orange-600/20",
    badge: "Art Direction",
  },
  {
    id: "planning",
    name: "Planning Agent",
    tagline: "Complex multi-step project breakdown, dependency matrix & human approval gates",
    icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
    defaultGoal: "Architect a 6-month product launch plan for a sovereign multi-model AI platform, detailing phases, risks, and required approvals.",
    color: "from-indigo-500/20 to-purple-600/20",
    badge: "Strategic Plan",
  },
];

export const AgentWorkbench: React.FC = () => {
  const [workbenchView, setWorkbenchView] = useState<"specialist_agents" | "deterministic_tools">("specialist_agents");

  // Autonomous Specialist Agents State
  const [selectedAgent, setSelectedAgent] = useState<SpecialistAgentId>("research");
  const [agentGoal, setAgentGoal] = useState<string>(SPECIALIST_AGENTS[0].defaultGoal);
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [agentResult, setAgentResult] = useState<any>(null);
  const [humanApproved, setHumanApproved] = useState<boolean>(false);

  // Deterministic Tools State
  const [activeTool, setActiveTool] = useState<"math" | "kanban" | "table" | "schema">("math");
  const [inputVal, setInputVal] = useState<string>("f(x) = 3*x^2 - 4*x + 5 over x in [-6, 6]");
  const [schemaFields, setSchemaFields] = useState<string>("companyName, revenue2025, growthPercentage, ceoName, headquarters");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [executionLog, setExecutionLog] = useState<Array<{ timestamp: string; message: string }>>([]);

  // Results State
  const [mathResult, setMathResult] = useState<{
    solution: string;
    steps: string[];
    dataPoints: Array<{ x: number; y: number; label?: string }>;
    formulaType?: string;
  } | null>(null);

  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>([]);
  const [projectTitle, setProjectTitle] = useState<string>("");

  const [tableResult, setTableResult] = useState<{
    tableName: string;
    columns: string[];
    rows: Record<string, any>[];
    csvString: string;
  } | null>(null);

  const [schemaResult, setSchemaResult] = useState<any>(null);

  const addLog = (msg: string) => {
    setExecutionLog((prev) => [{ timestamp: new Date().toLocaleTimeString(), message: msg }, ...prev.slice(0, 15)]);
  };

  const handleSelectAgent = (agent: SpecialistAgentDef) => {
    setSelectedAgent(agent.id);
    setAgentGoal(agent.defaultGoal);
    setAgentResult(null);
    setHumanApproved(false);
  };

  const handleExecuteAgent = async () => {
    if (!agentGoal.trim() || isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentResult(null);
    setHumanApproved(false);
    addLog(`Launching Autonomous Specialist Agent: ${selectedAgent}`);

    try {
      const res = await fetch("/api/agent/execute-specialist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentType: selectedAgent,
          goal: agentGoal.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setAgentResult(data.result);
        addLog(`Specialist Agent ${selectedAgent} completed in ${data.result.latencyMs}ms`);
      } else {
        throw new Error(data.error || "Agent execution failed");
      }
    } catch (err: any) {
      addLog(`Agent execution error: ${err.message}`);
    } finally {
      setIsAgentRunning(false);
    }
  };

  const handleToolExecute = async () => {
    if (!inputVal.trim()) return;
    setIsLoading(true);
    addLog(`Invoking agent tool: ${activeTool}`);

    try {
      let payload: any = {};
      if (activeTool === "math") {
        payload = { tool: "calculate_math_expression", input: inputVal };
      } else if (activeTool === "kanban") {
        payload = { tool: "create_kanban_tasks", input: inputVal };
      } else if (activeTool === "table") {
        payload = { tool: "generate_data_table", input: inputVal };
      } else if (activeTool === "schema") {
        payload = {
          tool: "custom_schema_extract",
          input: {
            text: inputVal,
            schemaFields: schemaFields.split(",").map((s) => s.trim()).filter(Boolean),
          },
        };
      }

      const res = await fetch("/api/ai/agent-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Execution failed");

      addLog(`Tool call ${activeTool} executed successfully`);

      if (activeTool === "math") {
        setMathResult({
          solution: data.solution || "Evaluated",
          steps: data.steps || [],
          dataPoints: data.dataPoints || [],
          formulaType: data.formulaType,
        });
      } else if (activeTool === "kanban") {
        setProjectTitle(data.projectTitle || "Project Plan");
        setKanbanTasks(data.tasks || []);
      } else if (activeTool === "table") {
        setTableResult(data);
      } else if (activeTool === "schema") {
        setSchemaResult(data.data);
      }
    } catch (err: any) {
      addLog(`Fault: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const currentAgentDef = SPECIALIST_AGENTS.find((a) => a.id === selectedAgent) || SPECIALIST_AGENTS[0];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-100 flex flex-col space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                SARVAGYA Autonomous Agent Workbench
              </h1>
              <p className="text-xs text-slate-400">
                9 Specialist Autonomous Agents • Step-by-Step Task Graph Planning • Human Approval Safeguards
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setWorkbenchView("specialist_agents")}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              workbenchView === "specialist_agents"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>9 Autonomous Agents</span>
          </button>
          <button
            onClick={() => setWorkbenchView("deterministic_tools")}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              workbenchView === "deterministic_tools"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Deterministic Tools</span>
          </button>
        </div>
      </div>

      {workbenchView === "specialist_agents" ? (
        /* ====================================================================== */
        /* 9 SPECIALIST AUTONOMOUS AGENTS VIEW                                   */
        /* ====================================================================== */
        <div className="space-y-6">
          {/* Agent Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SPECIALIST_AGENTS.map((agent) => (
              <div
                key={agent.id}
                onClick={() => handleSelectAgent(agent)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition relative group ${
                  selectedAgent === agent.id
                    ? "bg-cyan-950/40 border-cyan-500/80 shadow-lg ring-1 ring-cyan-500/40"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2 font-bold text-slate-100">
                    <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                      {agent.icon}
                    </span>
                    <span>{agent.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                    {agent.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{agent.tagline}</p>
              </div>
            ))}
          </div>

          {/* Active Agent Launcher Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Objective Input & Launch */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {currentAgentDef.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{currentAgentDef.name}</h3>
                      <span className="text-[10px] text-slate-400">Autonomous Objective Execution</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                    Step-by-Step
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Agent Objective / Natural Language Task</label>
                  <textarea
                    rows={5}
                    value={agentGoal}
                    onChange={(e) => setAgentGoal(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 leading-relaxed font-mono resize-none"
                    placeholder="Enter what you want this autonomous agent to achieve..."
                  />
                </div>

                <button
                  onClick={handleExecuteAgent}
                  disabled={isAgentRunning || !agentGoal.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50"
                >
                  {isAgentRunning ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Planning & Executing Subtasks...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Launch {currentAgentDef.name}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Execution Activity Feed */}
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Agent Telemetry Log
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px] text-slate-400">
                  {executionLog.length === 0 ? (
                    <p className="text-slate-600 italic">No agent actions recorded yet.</p>
                  ) : (
                    executionLog.map((log, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                        <span className="text-cyan-400">›</span>
                        <span className="text-slate-300">{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Plan Graph, Approval Gate & Final Output */}
            <div className="lg:col-span-7 space-y-4">
              {agentResult ? (
                <div className="space-y-4">
                  {/* Task Graph Plan */}
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        Autonomous Task Graph Execution
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800 font-mono">
                        {agentResult.plan?.length || 0} Steps Executed • {agentResult.latencyMs}ms
                      </span>
                    </div>

                    <div className="space-y-2">
                      {agentResult.plan?.map((step: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200">Step {step.stepNumber}: {step.title}</span>
                              <span className="text-[10px] text-emerald-400 uppercase font-mono">Completed</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{step.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Human Guardian Approval Gate (if triggered) */}
                  {agentResult.requiresApproval && (
                    <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/60 space-y-3">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Human-in-the-Loop Safeguard Checkpoint</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {agentResult.approvalDetails || "Explicit confirmation required before executing irreversible external actions."}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setHumanApproved(true)}
                          disabled={humanApproved}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            humanApproved
                              ? "bg-emerald-600 text-white"
                              : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{humanApproved ? "Approved by Commander" : "Authorize & Proceed"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Final Output Display */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">{agentResult.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">Synthesized by {agentResult.modelUsed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(agentResult.finalOutput);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 transition"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copied ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                      {agentResult.finalOutput}
                    </div>

                    {/* Sources (if Research Agent) */}
                    {agentResult.sources && agentResult.sources.length > 0 && (
                      <div className="pt-3 border-t border-slate-800 space-y-2">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Verified External Sources:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {agentResult.sources.map((s: any, idx: number) => (
                            <a
                              key={idx}
                              href={s.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-sky-400 text-[11px] flex items-center gap-1 transition border border-slate-700"
                            >
                              <span>{s.title}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-center space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
                    <Bot className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-300">Agent Idle & Primed</h4>
                    <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                      Select any of the 9 specialist agents, enter your objective, and click Launch to execute multi-step task planning with real search grounding and zero mock latency.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ====================================================================== */
        /* DETERMINISTIC AGENT TOOLS VIEW                                         */
        /* ====================================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tool Navigation & Form */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col space-y-1 text-xs">
              <button
                onClick={() => {
                  setActiveTool("math");
                  setInputVal("f(x) = 3*x^2 - 4*x + 5 over x in [-6, 6]");
                }}
                className={`p-2.5 rounded-lg flex items-center gap-2.5 font-semibold text-left transition ${
                  activeTool === "math" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Math Evaluator & Plotter</span>
              </button>
              <button
                onClick={() => {
                  setActiveTool("kanban");
                  setInputVal("Launch SARVAGYA Sovereign Super AI on Google Cloud Run");
                }}
                className={`p-2.5 rounded-lg flex items-center gap-2.5 font-semibold text-left transition ${
                  activeTool === "kanban" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Kanban className="w-4 h-4" />
                <span>Kanban Task Generator</span>
              </button>
              <button
                onClick={() => {
                  setActiveTool("table");
                  setInputVal("Indian Aerospace Startups with valuation, headquarters, and launch vehicles");
                }}
                className={`p-2.5 rounded-lg flex items-center gap-2.5 font-semibold text-left transition ${
                  activeTool === "table" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <TableIcon className="w-4 h-4" />
                <span>Data Table Generator</span>
              </button>
              <button
                onClick={() => {
                  setActiveTool("schema");
                  setInputVal("ISRO successfully placed Aditya-L1 in halo orbit around Sun-Earth L1 point.");
                }}
                className={`p-2.5 rounded-lg flex items-center gap-2.5 font-semibold text-left transition ${
                  activeTool === "schema" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Custom Schema Extractor</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">Input Parameters</span>
              <textarea
                rows={4}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono resize-none focus:outline-none focus:border-cyan-500/80"
              />
              {activeTool === "schema" && (
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Target Schema Fields (comma-separated):</span>
                  <input
                    type="text"
                    value={schemaFields}
                    onChange={(e) => setSchemaFields(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
                  />
                </div>
              )}
              <button
                onClick={handleToolExecute}
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                <span>Execute Tool</span>
              </button>
            </div>
          </div>

          {/* Results Canvas */}
          <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            {activeTool === "math" && mathResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-cyan-400">Mathematical Solution: {mathResult.solution}</h4>
                  <span className="text-xs text-slate-500">{mathResult.dataPoints.length} points plotted</span>
                </div>
                {mathResult.dataPoints.length > 0 && (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mathResult.dataPoints}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="x" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", fontSize: 11 }} />
                        <Line type="monotone" dataKey="y" stroke="#06b6d4" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ) : activeTool === "kanban" && kanbanTasks.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-200">{projectTitle}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {["todo", "in_progress", "done"].map((colStatus) => (
                    <div key={colStatus} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold uppercase text-slate-400">{colStatus.replace("_", " ")}</span>
                      {kanbanTasks
                        .filter((t) => t.status === colStatus)
                        .map((t) => (
                          <div key={t.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                            <span className="font-semibold text-slate-200 block">{t.title}</span>
                            <p className="text-[11px] text-slate-400">{t.description}</p>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTool === "table" && tableResult ? (
              <div className="space-y-4 overflow-x-auto">
                <h4 className="text-sm font-bold text-cyan-400">{tableResult.tableName}</h4>
                <table className="w-full text-xs text-left border border-slate-800">
                  <thead className="bg-slate-950 uppercase text-[10px] text-slate-400">
                    <tr>
                      {tableResult.columns.map((c, i) => (
                        <th key={i} className="p-2.5">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {tableResult.rows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        {tableResult.columns.map((c, ci) => (
                          <td key={ci} className="p-2.5 font-mono">{String(r[c] ?? "")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : activeTool === "schema" && schemaResult ? (
              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-cyan-300 overflow-x-auto">
                {JSON.stringify(schemaResult, null, 2)}
              </pre>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <Bot className="w-8 h-8 text-slate-700" />
                <span className="text-xs font-semibold text-slate-300">Tool Idle</span>
                <p className="text-[11px] text-slate-600 max-w-sm">
                  Select a tool on the left and click Execute to generate live mathematical plots, tasks, tables, or schema data.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
