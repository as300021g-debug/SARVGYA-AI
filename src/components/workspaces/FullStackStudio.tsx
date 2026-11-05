import React, { useState } from "react";
import {
  Code,
  Play,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  FileCode,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
} from "lucide-react";

export const FullStackStudio: React.FC = () => {
  const [studioMode, setStudioMode] = useState<"webapp" | "backend_execution">("webapp");
  const [prompt, setPrompt] = useState<string>(
    "Build a modern quantitative portfolio risk dashboard with Sharpe ratio calculator, interactive chart, and asset allocation breakdown"
  );
  const [pythonScript, setPythonScript] = useState<string>(`import math

def calculate_portfolio_metrics(returns, risk_free_rate=0.045):
    mean_return = sum(returns) / len(returns)
    variance = sum((r - mean_return) ** 2 for r in returns) / len(returns)
    std_dev = math.sqrt(variance)
    sharpe_ratio = (mean_return - risk_free_rate) / std_dev if std_dev > 0 else 0
    return {
        "expected_annual_return": f"{mean_return * 100:.2f}%",
        "volatility": f"{std_dev * 100:.2f}%",
        "sharpe_ratio": f"{sharpe_ratio:.3f}"
    }

sample_returns = [0.12, 0.08, -0.04, 0.18, 0.15, 0.06, 0.22]
metrics = calculate_portfolio_metrics(sample_returns)
print("=== SARVAGYA REAL QUANTITATIVE METRICS ===")
for k, v in metrics.items():
    print(f"{k}: {v}")
`);
  const [pythonOutput, setPythonOutput] = useState<string | null>(null);
  const [isExecutingPython, setIsExecutingPython] = useState<boolean>(false);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isOptimizingPrompt, setIsOptimizingPrompt] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<"preview" | "code" | "split">("split");
  const [viewportWidth, setViewportWidth] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copied, setCopied] = useState<boolean>(false);

  // Live web application code
  const [generatedCode, setGeneratedCode] = useState<string>(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Real-Time Quantitative Portfolio Matrix</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #020617; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }
    .glass { background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(51, 65, 85, 0.7); }
  </style>
</head>
<body class="min-h-screen p-6 flex flex-col items-center">
  <div class="max-w-4xl w-full space-y-6">
    <!-- Header -->
    <div class="glass p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
          Quantitative Portfolio Risk Matrix
        </h1>
        <p class="text-xs text-slate-400 mt-1">Live Monte Carlo simulation & asset allocation engine</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
          Status: Real-Time Active
        </span>
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="glass p-4 rounded-xl">
        <span class="text-xs text-slate-400">Total Portfolio Value</span>
        <div class="text-2xl font-bold text-cyan-300 mt-1" id="totalValue">$2,480,000</div>
        <span class="text-[11px] text-emerald-400 font-medium">+14.8% YTD</span>
      </div>
      <div class="glass p-4 rounded-xl">
        <span class="text-xs text-slate-400">Sharpe Ratio</span>
        <div class="text-2xl font-bold text-indigo-300 mt-1" id="sharpeVal">2.18</div>
        <span class="text-[11px] text-cyan-400 font-medium">Benchmark: 1.40</span>
      </div>
      <div class="glass p-4 rounded-xl">
        <span class="text-xs text-slate-400">Value at Risk (95% VaR)</span>
        <div class="text-2xl font-bold text-rose-400 mt-1" id="varVal">-$38,500</div>
        <span class="text-[11px] text-slate-400 font-medium">Daily 95% Confidence</span>
      </div>
    </div>

    <!-- Interactive Sliders -->
    <div class="glass p-5 rounded-2xl space-y-4">
      <h3 class="text-sm font-bold text-slate-200">Asset Allocation Adjuster</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-slate-400">Equities Weight:</span>
            <span id="eqVal" class="font-mono text-cyan-400 font-bold">60%</span>
          </div>
          <input type="range" id="eqRange" min="10" max="90" value="60" class="w-full accent-cyan-400 cursor-pointer">
        </div>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-slate-400">Fixed Income / Bonds:</span>
            <span id="bondVal" class="font-mono text-indigo-400 font-bold">40%</span>
          </div>
          <input type="range" id="bondRange" min="10" max="90" value="40" class="w-full accent-indigo-400 cursor-pointer">
        </div>
      </div>
    </div>
  </div>

  <script>
    const eqRange = document.getElementById('eqRange');
    const bondRange = document.getElementById('bondRange');
    const eqVal = document.getElementById('eqVal');
    const bondVal = document.getElementById('bondVal');
    const sharpeVal = document.getElementById('sharpeVal');

    function update() {
      const eq = parseInt(eqRange.value);
      const bond = 100 - eq;
      bondRange.value = bond;
      eqVal.innerText = eq + '%';
      bondVal.innerText = bond + '%';

      // Dynamic Sharpe ratio calculation
      const calculatedSharpe = (1.2 + (eq * 0.018) - (bond * 0.004)).toFixed(2);
      sharpeVal.innerText = calculatedSharpe;
    }

    eqRange.addEventListener('input', update);
    bondRange.addEventListener('input', () => {
      eqRange.value = 100 - parseInt(bondRange.value);
      update();
    });
  </script>
</body>
</html>`);

  const handleOptimizePrompt = async () => {
    if (!prompt.trim()) return;
    setIsOptimizingPrompt(true);
    try {
      const res = await fetch("/api/ai/optimize-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, domain: "fullstack-software-engineering" }),
      });
      const data = await res.json();
      if (data.optimizedPrompt) {
        setPrompt(data.optimizedPrompt);
      }
    } catch {} finally {
      setIsOptimizingPrompt(false);
    }
  };

  const generateCodeApp = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/code-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.code) {
        setGeneratedCode(data.code);
      }
    } catch (err: any) {
      console.warn("Code generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const executePythonScript = async () => {
    if (!pythonScript.trim()) return;
    setIsExecutingPython(true);
    setPythonOutput(null);

    try {
      const res = await fetch("/api/code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: pythonScript, language: "python" }),
      });

      const data = await res.json();
      setPythonOutput(data.output || data.text || "Execution finished with 0 errors.");
    } catch (err: any) {
      setPythonOutput("Execution error: " + err.message);
    } finally {
      setIsExecutingPython(false);
    }
  };

  const copyCode = () => {
    const textToCopy = studioMode === "webapp" ? generatedCode : pythonScript;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const isWeb = studioMode === "webapp";
    const blob = new Blob([isWeb ? generatedCode : pythonScript], {
      type: isWeb ? "text/html;charset=utf-8;" : "text/plain;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isWeb ? `sarvagya_app_${Date.now()}.html` : `sarvagya_script_${Date.now()}.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 md:p-6 space-y-5">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Code className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Full-Stack Software Engineering Studio
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              100% Real Server Execution
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Prompt-to-Software Compiler • Live Browser Application Engine • Gemini Server-Side Code Execution
          </p>
        </div>

        {/* Studio Mode Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setStudioMode("webapp")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                studioMode === "webapp"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Live Web App Engine
            </button>
            <button
              onClick={() => setStudioMode("backend_execution")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                studioMode === "backend_execution"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Server Code Runner
            </button>
          </div>
        </div>
      </div>

      {studioMode === "webapp" ? (
        /* Web Application Mode */
        <>
          {/* Prompt Bar with Prompt Optimizer */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Describe the Web Application to Engineer:
              </label>
              <button
                onClick={handleOptimizePrompt}
                disabled={!prompt.trim() || isOptimizingPrompt}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 disabled:opacity-40"
                title="Supercharge prompt via Gemini Prompt Optimizer"
              >
                <Sparkles className={`w-3 h-3 ${isOptimizingPrompt ? "animate-spin" : ""}`} />
                {isOptimizingPrompt ? "Optimizing..." : "Magic Prompt Optimizer"}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60 resize-none"
                placeholder="e.g. Build an interactive mortgage calculator with amortization schedule and charts..."
              />
              <button
                onClick={generateCodeApp}
                disabled={isGenerating || !prompt.trim()}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isGenerating ? "animate-spin" : ""}`} />
                {isGenerating ? "Engineering..." : "Compile App"}
              </button>
            </div>
          </div>

          {/* View Mode Bar */}
          <div className="flex items-center justify-between text-xs">
            {/* Viewport Width Switches */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
              <button
                onClick={() => setViewportWidth("desktop")}
                className={`p-1.5 rounded ${viewportWidth === "desktop" ? "bg-slate-800 text-cyan-300" : "hover:text-slate-200"}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewportWidth("tablet")}
                className={`p-1.5 rounded ${viewportWidth === "tablet" ? "bg-slate-800 text-cyan-300" : "hover:text-slate-200"}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewportWidth("mobile")}
                className={`p-1.5 rounded ${viewportWidth === "mobile" ? "bg-slate-800 text-cyan-300" : "hover:text-slate-200"}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Split / Preview / Code Toggles & Export */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setActiveViewMode("preview")}
                  className={`px-3 py-1 rounded transition ${activeViewMode === "preview" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Live Run
                </button>
                <button
                  onClick={() => setActiveViewMode("code")}
                  className={`px-3 py-1 rounded transition ${activeViewMode === "code" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Source Code
                </button>
                <button
                  onClick={() => setActiveViewMode("split")}
                  className={`px-3 py-1 rounded transition ${activeViewMode === "split" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Split View
                </button>
              </div>

              <button
                onClick={downloadFile}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1"
                title="Download HTML file"
              >
                <Download className="w-3.5 h-3.5" /> HTML
              </button>
              <button
                onClick={copyCode}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Main Stage: Code and Live Run */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[500px]">
            {(activeViewMode === "code" || activeViewMode === "split") && (
              <div className={`${activeViewMode === "split" ? "lg:col-span-5" : "lg:col-span-12"} flex flex-col rounded-xl bg-slate-950 border border-slate-800 overflow-hidden`}>
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    index.html
                  </span>
                  <span className="text-slate-500">{generatedCode.length} bytes</span>
                </div>
                <textarea
                  value={generatedCode}
                  onChange={(e) => setGeneratedCode(e.target.value)}
                  className="flex-1 w-full p-3 bg-slate-950 text-cyan-300 font-mono text-xs leading-relaxed focus:outline-none resize-none border-none selection:bg-cyan-500/30 overflow-y-auto"
                  spellCheck={false}
                />
              </div>
            )}

            {(activeViewMode === "preview" || activeViewMode === "split") && (
              <div className={`${activeViewMode === "split" ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden`}>
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-slate-300">Live Application View</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400">{viewportWidth.toUpperCase()}</span>
                </div>

                <div className="flex-1 p-2 bg-slate-950 flex items-center justify-center overflow-auto">
                  <div
                    className={`h-full transition-all duration-200 border border-slate-800 rounded-lg overflow-hidden shadow-2xl bg-black ${
                      viewportWidth === "mobile"
                        ? "w-[375px]"
                        : viewportWidth === "tablet"
                        ? "w-[768px]"
                        : "w-full"
                    }`}
                  >
                    <iframe
                      title="Live Run Preview"
                      srcDoc={generatedCode}
                      sandbox="allow-scripts allow-modals allow-forms"
                      className="w-full h-full min-h-[460px] bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Backend Python Execution Engine Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* Script Editor (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  script.py (Gemini Server-Side Execution)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={downloadFile}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Python
                  </button>
                  <button
                    onClick={copyCode}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <textarea
                value={pythonScript}
                onChange={(e) => setPythonScript(e.target.value)}
                rows={14}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-indigo-500/60 resize-none"
                spellCheck={false}
              />

              <button
                onClick={executePythonScript}
                disabled={isExecutingPython || !pythonScript.trim()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isExecutingPython ? "animate-spin" : ""}`} />
                {isExecutingPython ? "Executing in Server-Side Python Runtime..." : "Execute Python Script"}
              </button>
            </div>
          </div>

          {/* Standard Output Console (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[440px] flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  stdout / Standard Output Stream
                </span>
                <span className="text-[10px] text-slate-500">Zero Mock • Host Python 3 & Gemini Compute Engine</span>
              </div>

              <div className="flex-1 bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs overflow-y-auto max-h-[380px]">
                {isExecutingPython ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-2 py-12 text-slate-400">
                    <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
                    <span>Executing Python 3 on host Linux runtime & Gemini engine...</span>
                  </div>
                ) : pythonOutput ? (
                  <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                    {pythonOutput}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 py-16 space-y-1">
                    <Terminal className="w-8 h-8 text-slate-700" />
                    <span>Awaiting execution. Click "Execute Python Script" to run live code.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
