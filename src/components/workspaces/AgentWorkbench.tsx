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

export const AgentWorkbench: React.FC = () => {
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
      addLog(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = (taskId: string, nextStatus: "todo" | "in_progress" | "done") => {
    setKanbanTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
  };

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = (csvText: string, filename: string) => {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Autonomous Agent & Tool-Calling Workbench
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic Function Calling • Mathematical Recharts Plotting • Live Kanban Task Decomposition • Tabular Schema Extraction
          </p>
        </div>

        {/* Tool Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
          <button
            onClick={() => {
              setActiveTool("math");
              setInputVal("f(x) = 3*x^2 - 4*x + 5 over x in [-6, 6]");
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTool === "math"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Math & Plotting
          </button>
          <button
            onClick={() => {
              setActiveTool("kanban");
              setInputVal("Build an autonomous multi-agent ticket booking & flight price tracker web app in 2 weeks");
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTool === "kanban"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Kanban Decomposer
          </button>
          <button
            onClick={() => {
              setActiveTool("table");
              setInputVal("Apple Q4 Revenue was $94.9B with EPS $1.64. Microsoft posted $65.6B revenue with Azure up 33%. Alphabet hit $88.3B with Cloud at $11.4B. Tesla reached $25.2B with 462K deliveries.");
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTool === "table"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Table & CSV
          </button>
          <button
            onClick={() => {
              setActiveTool("schema");
              setInputVal("ISRO was founded on August 15, 1969. Headquartered in Bengaluru, Karnataka, India. Key achievements include Chandrayaan-3 landing on lunar south pole and Aditya-L1 solar observation. Annual budget is approx $1.5B.");
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTool === "schema"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Custom Schema
          </button>
        </div>
      </div>

      {/* Main Grid: Input Form & Agent Execution Log on Left, Interactive Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Prompt & Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-emerald-400" />
                Agent Input & Parameters
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-mono">
                Tool: {activeTool}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400">
                {activeTool === "math"
                  ? "Mathematical Formula or Function:"
                  : activeTool === "kanban"
                  ? "Project Goal to Decompose:"
                  : activeTool === "table"
                  ? "Unstructured Text Data:"
                  : "Unstructured Source Text:"}
              </label>
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                rows={4}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60 resize-none font-mono"
              />
            </div>

            {activeTool === "schema" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-400">
                  Target Schema Fields (comma-separated):
                </label>
                <input
                  type="text"
                  value={schemaFields}
                  onChange={(e) => setSchemaFields(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60 font-mono"
                />
              </div>
            )}

            <button
              onClick={handleToolExecute}
              disabled={isLoading || !inputVal.trim()}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Executing Agent Dynamic Tool..." : "Run Autonomous Agent Tool"}
            </button>
          </div>

          {/* Execution Telemetry Log */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-xs">
            <span className="font-semibold text-slate-400 text-[11px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Agent Tool Call Timeline
            </span>
            <div className="space-y-1.5 font-mono text-[11px] max-h-36 overflow-y-auto">
              {executionLog.length === 0 ? (
                <span className="text-slate-600 block">Awaiting execution commands...</span>
              ) : (
                executionLog.map((log, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-400">
                    <span className="text-slate-600">{log.timestamp}</span>
                    <span className="text-emerald-300">›</span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Live Output & Interactive Canvas (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Live Tool Execution Deliverable
              </span>

              {/* Download / Copy Actions */}
              <div className="flex items-center gap-2">
                {activeTool === "table" && tableResult?.csvString && (
                  <button
                    onClick={() => downloadCsv(tableResult.csvString, "data_table")}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 transition"
                  >
                    <Download className="w-3 h-3 text-cyan-400" /> Download CSV
                  </button>
                )}
                <button
                  onClick={() => {
                    const data = mathResult || kanbanTasks || tableResult || schemaResult;
                    if (data) copyResult(JSON.stringify(data, null, 2));
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy JSON"}
                </button>
              </div>
            </div>

            {/* Tool Specific Views */}
            <div className="flex-1 py-4">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3 py-20">
                  <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                  <span className="text-xs font-medium text-slate-400">
                    Agent evaluating dynamic tool call...
                  </span>
                </div>
              ) : activeTool === "math" && mathResult ? (
                /* Math Solution + Interactive Recharts Curve */
                <div className="space-y-5">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-emerald-400 block">
                        Evaluated Solution
                      </span>
                      <span className="text-sm font-bold text-slate-100">{mathResult.solution}</span>
                    </div>
                    {mathResult.formulaType && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {mathResult.formulaType}
                      </span>
                    )}
                  </div>

                  {/* Recharts Curve Visualization */}
                  {mathResult.dataPoints && mathResult.dataPoints.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-xs font-semibold text-slate-300 block">
                        Interactive Function Curve
                      </span>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={mathResult.dataPoints} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="x" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                            />
                            <Line
                              type="monotone"
                              dataKey="y"
                              stroke="#10b981"
                              strokeWidth={3}
                              dot={{ fill: "#06b6d4", r: 4 }}
                              activeDot={{ r: 6, fill: "#34d399" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Step by step derivation */}
                  {mathResult.steps && mathResult.steps.length > 0 && (
                    <div className="space-y-2 text-xs">
                      <span className="font-semibold text-slate-400">Step-by-Step Derivation:</span>
                      <div className="space-y-1.5">
                        {mathResult.steps.map((step, idx) => (
                          <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="text-slate-300 pt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTool === "kanban" && kanbanTasks.length > 0 ? (
                /* Interactive Kanban Board */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-teal-400">{projectTitle}</span>
                    <span className="text-xs text-slate-500">{kanbanTasks.length} Actionable Tasks</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column: To Do */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-400" />
                          To Do
                        </span>
                        <span>{kanbanTasks.filter((t) => t.status === "todo").length}</span>
                      </div>
                      <div className="space-y-2.5">
                        {kanbanTasks
                          .filter((t) => t.status === "todo")
                          .map((t) => (
                            <div key={t.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  t.priority === "urgent" || t.priority === "high"
                                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                    : "bg-slate-800 text-slate-400"
                                }`}>
                                  {t.priority}
                                </span>
                                <span className="text-[10px] text-slate-500">{t.dueDate}</span>
                              </div>
                              <h4 className="font-semibold text-slate-200">{t.title}</h4>
                              <p className="text-[11px] text-slate-400">{t.description}</p>
                              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                                <span className="text-[10px] text-slate-500">{t.assignee}</span>
                                <button
                                  onClick={() => updateTaskStatus(t.id, "in_progress")}
                                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                                >
                                  Start ›
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Column: In Progress */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 pb-2 border-b border-slate-800">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          In Progress
                        </span>
                        <span>{kanbanTasks.filter((t) => t.status === "in_progress").length}</span>
                      </div>
                      <div className="space-y-2.5">
                        {kanbanTasks
                          .filter((t) => t.status === "in_progress")
                          .map((t) => (
                            <div key={t.id} className="p-3 rounded-lg bg-slate-900 border border-cyan-900/50 space-y-2 text-xs shadow-sm">
                              <div className="flex items-center justify-between">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  t.priority === "urgent" || t.priority === "high"
                                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                    : "bg-slate-800 text-slate-400"
                                }`}>
                                  {t.priority}
                                </span>
                                <span className="text-[10px] text-cyan-400">{t.dueDate}</span>
                              </div>
                              <h4 className="font-semibold text-slate-200">{t.title}</h4>
                              <p className="text-[11px] text-slate-400">{t.description}</p>
                              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                                <span className="text-[10px] text-slate-500">{t.assignee}</span>
                                <button
                                  onClick={() => updateTaskStatus(t.id, "done")}
                                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                                >
                                  Complete ✓
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Column: Done */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 pb-2 border-b border-slate-800">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          Done
                        </span>
                        <span>{kanbanTasks.filter((t) => t.status === "done").length}</span>
                      </div>
                      <div className="space-y-2.5">
                        {kanbanTasks
                          .filter((t) => t.status === "done")
                          .map((t) => (
                            <div key={t.id} className="p-3 rounded-lg bg-slate-900/60 border border-emerald-950/80 space-y-2 text-xs opacity-85">
                              <div className="flex items-center justify-between">
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                                  Done
                                </span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              </div>
                              <h4 className="font-semibold text-slate-300 line-through">{t.title}</h4>
                              <p className="text-[11px] text-slate-500">{t.description}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTool === "table" && tableResult ? (
                /* Tabular Schema View with Sorting & CSV Export */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400">{tableResult.tableName}</span>
                    <span className="text-xs text-slate-500">{tableResult.rows.length} rows</span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-mono border-b border-slate-800">
                        <tr>
                          {tableResult.columns.map((col, idx) => (
                            <th key={idx} className="py-2.5 px-3 font-semibold">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-950">
                        {tableResult.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/40 transition">
                            {tableResult.columns.map((col, cIdx) => (
                              <td key={cIdx} className="py-2.5 px-3 text-slate-300 font-mono">
                                {String(row[col] ?? "")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeTool === "schema" && schemaResult ? (
                /* Custom Schema Output */
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-indigo-400 block">
                    Strict JSON Schema Extraction
                  </span>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                    {JSON.stringify(schemaResult, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-2">
                  <Bot className="w-8 h-8 text-slate-700" />
                  <span className="text-xs font-semibold text-slate-300">Tool Idle</span>
                  <p className="text-[11px] text-slate-600 max-w-sm">
                    Enter your parameters on the left and run the tool to dynamically execute formulas, plot charts, generate tasks, or extract tabular schemas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
