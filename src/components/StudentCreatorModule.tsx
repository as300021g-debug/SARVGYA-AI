import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Code2,
  Play,
  RotateCcw,
  Video,
  FileText,
  HelpCircle,
  Lightbulb,
  Calendar as CalendarIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { CalendarView } from "./visual/CalendarView.tsx";
import { TimelineViewer } from "./visual/TimelineViewer.tsx";

export const StudentCreatorModule: React.FC = () => {
  const [suiteMode, setSuiteMode] = useState<"student" | "creator">("student");

  // Student states
  const [studentTab, setStudentTab] = useState<"quiz" | "solver" | "summary" | "schedule">("quiz");
  const [quizTopic, setQuizTopic] = useState("Cellular Respiration and ATP Synthase");
  const [quizData, setQuizData] = useState<Array<{ question: string; options: string[]; answer: number; explanation: string }> | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  // Math solver states
  const [mathProblem, setMathProblem] = useState("Find the derivative of f(x) = (3x^2 + 5x) * e^(2x) and evaluate f'(1).");
  const [mathSolution, setMathSolution] = useState<string | null>(null);
  const [solvingMath, setSolvingMath] = useState(false);

  // Creator states
  const [creatorTab, setCreatorTab] = useState<"script" | "studio">("script");
  const [scriptConcept, setScriptConcept] = useState("A 60-second viral breakdown of how CRISPR Cas9 gene editing works.");
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [generatingScript, setGeneratingScript] = useState(false);

  // Studio states
  const [studioCode, setStudioCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: #1e293b; padding: 2rem; border-radius: 1rem; border: 1px solid #334155; text-align: center; }
    button { background: #06b6d4; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: bold; cursor: pointer; }
    button:hover { background: #0891b2; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Interactive SARVAGYA Component</h2>
    <p>Live real-time execution engine active.</p>
    <button onclick="document.getElementById('status').innerText = 'Action verified at ' + new Date().toLocaleTimeString();">Click Action</button>
    <div id="status" style="margin-top: 10px; font-size: 12px; color: #38bdf8;"></div>
  </div>
</body>
</html>`);

  // Generate Interactive Quiz
  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim() || generatingQuiz) return;
    setGeneratingQuiz(true);
    setSelectedAnswers({});

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a 3-question multiple-choice quiz about "${quizTopic}".
Respond ONLY with a valid JSON array of 3 objects with keys:
- "question" (string)
- "options" (array of 4 strings)
- "answer" (zero-indexed number: 0, 1, 2, or 3)
- "explanation" (string)
Do not include markdown blocks or other text.`,
          model: "gemini-3.8-flash",
        }),
      });
      const data = await res.json();
      const rawText = data.reply || "";
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        setQuizData(parsed);
      }
    } catch (e) {
      console.error("Quiz parsing error", e);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
    if (quizData && quizData[qIdx]?.answer === oIdx) {
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    }
  };

  // Solve Math / STEM
  const handleSolveMath = async () => {
    if (!mathProblem.trim() || solvingMath) return;
    setSolvingMath(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Solve the following STEM / Math problem step-by-step with rigorous proof, explicit intermediate steps, and verified final answer:\n\n${mathProblem}`,
          model: "gemini-4-argon",
          highThinking: true,
        }),
      });
      const data = await res.json();
      setMathSolution(data.reply);
    } catch (e) {
      console.error(e);
    } finally {
      setSolvingMath(false);
    }
  };

  // Generate Creator Script
  const handleGenerateScript = async () => {
    if (!scriptConcept.trim() || generatingScript) return;
    setGeneratingScript(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a compelling viral video production script for concept: "${scriptConcept}".
Include:
- Hook (0-5s) with visual direction
- Body pacing with b-roll camera cues
- Call to Action & punchline`,
          model: "gemini-3.8-flash",
        }),
      });
      const data = await res.json();
      setGeneratedScript(data.reply);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingScript(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Suite Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Student & Creator Intelligence</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Created by Aryan Sharma. Personalized academic mastery, step-by-step STEM solver, viral content architect, and study timeline analytics.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setSuiteMode("student")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              suiteMode === "student"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Student Tools</span>
          </button>
          <button
            onClick={() => setSuiteMode("creator")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              suiteMode === "creator"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Creator Suite</span>
          </button>
        </div>
      </div>

      {/* STUDENT TOOLS */}
      {suiteMode === "student" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setStudentTab("quiz")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                studentTab === "quiz" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Flash Quiz & Mastery
            </button>
            <button
              onClick={() => setStudentTab("solver")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                studentTab === "solver" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Step-by-Step STEM Solver
            </button>
            <button
              onClick={() => setStudentTab("schedule")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                studentTab === "schedule" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Academic Agenda & Milestones
            </button>
          </div>

          {studentTab === "quiz" && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    placeholder="Enter study topic (e.g. Photosynthesis, Special Relativity, Discrete Math)..."
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={generatingQuiz || !quizTopic.trim()}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-indigo-950/40"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{generatingQuiz ? "Generating Quiz..." : "Create Interactive Quiz"}</span>
                  </button>
                </div>
              </div>

              {quizData && (
                <div className="space-y-4">
                  {quizData.map((item, qIdx) => {
                    const hasSelected = selectedAnswers[qIdx] !== undefined;
                    return (
                      <div key={qIdx} className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
                        <p className="font-bold text-sm text-slate-100">
                          {qIdx + 1}. {item.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.options.map((opt, oIdx) => {
                            const isChosen = selectedAnswers[qIdx] === oIdx;
                            const isCorrect = item.answer === oIdx;
                            let btnStyle = "bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700";

                            if (hasSelected) {
                              if (isCorrect) {
                                btnStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
                              } else if (isChosen && !isCorrect) {
                                btnStyle = "bg-rose-500/20 text-rose-300 border-rose-500/40";
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(qIdx, oIdx)}
                                disabled={hasSelected}
                                className={`p-3 rounded-xl text-xs font-medium text-left border transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {hasSelected && (
                          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                            <span className="font-semibold text-indigo-400">Explanation: </span>
                            {item.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {studentTab === "solver" && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
                <label className="block text-xs font-medium text-slate-300">
                  STEM Problem or Proof to Solve with Gemini 4 Argon High-Thinking
                </label>
                <textarea
                  rows={3}
                  value={mathProblem}
                  onChange={(e) => setMathProblem(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSolveMath}
                  disabled={solvingMath || !mathProblem.trim()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{solvingMath ? "Computing Rigorous Proof..." : "Solve Step-by-Step"}</span>
                </button>
              </div>

              {mathSolution && (
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-3">
                  <h3 className="font-bold text-sm text-indigo-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Verified Mathematical & STEM Solution:
                  </h3>
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-mono">
                    {mathSolution}
                  </div>
                </div>
              )}
            </div>
          )}

          {studentTab === "schedule" && (
            <div className="space-y-6">
              <CalendarView
                title="Academic Assignment & Lecture Agenda"
                events={[
                  { id: "s-1", title: "Organic Chemistry: Carbonyl Reaction Mechanisms", date: "2026-10-27", time: "09:30", category: "study", description: "Nucleophilic addition to aldehydes and ketones." },
                  { id: "s-2", title: "Multivariable Calculus: Stokes' Theorem Exam", date: "2026-10-28", time: "11:00", category: "study", description: "Surface integrals and curl vector field analysis." },
                  { id: "s-3", title: "Genomics Research Group Presentation", date: "2026-10-29", time: "15:00", category: "study", description: "AlphaFold 3 conformational modeling review." },
                  { id: "s-4", title: "Machine Learning: Attention Heads & Transformer KV Caching", date: "2026-10-31", time: "14:00", category: "study", description: "Scaling laws and inference optimization." },
                ]}
              />

              <TimelineViewer
                title="Semester Syllabus Milestone Tracker"
                description="Deterministic progress towards academic mastery & research milestones"
                events={[
                  { id: "tl-1", timestamp: "Weeks 1 - 4", title: "Foundations & Linear Algebra", status: "completed", description: "Vector spaces, eigenvalues, and SVD decomposition." },
                  { id: "tl-2", timestamp: "Weeks 5 - 8", title: "Differential Equations & Dynamics", status: "completed", description: "Phase portraits, Runge-Kutta numerical methods, and Laplace transforms." },
                  { id: "tl-3", timestamp: "Weeks 9 - 12 (Active)", title: "Deep Generative Modeling & Multimodal Transformers", status: "current", description: "Cross-attention architectures, flow matching, and RLHF alignment." },
                  { id: "tl-4", timestamp: "Weeks 13 - 16", title: "Capstone Synthesis & Autonomous Research Agents", status: "pending", description: "Publishable project defense and peer-reviewed code repository submission." },
                ]}
              />
            </div>
          )}
        </div>
      )}

      {/* CREATOR SUITE */}
      {suiteMode === "creator" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setCreatorTab("script")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                creatorTab === "script" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Content Script Architect
            </button>
            <button
              onClick={() => setCreatorTab("studio")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                creatorTab === "studio" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Interactive Code Studio
            </button>
          </div>

          {creatorTab === "script" && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
                <label className="block text-xs font-medium text-slate-300">
                  Video Concept, Channel Theme or Topic
                </label>
                <textarea
                  rows={3}
                  value={scriptConcept}
                  onChange={(e) => setScriptConcept(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleGenerateScript}
                  disabled={generatingScript || !scriptConcept.trim()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{generatingScript ? "Architecting Script..." : "Generate Viral Script"}</span>
                </button>
              </div>

              {generatedScript && (
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-3">
                  <h3 className="font-bold text-sm text-indigo-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Production-Ready Script Outline:
                  </h3>
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {generatedScript}
                  </div>
                </div>
              )}
            </div>
          )}

          {creatorTab === "studio" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-xs text-slate-300">HTML / CSS / JS Editor</h3>
                <textarea
                  rows={16}
                  value={studioCode}
                  onChange={(e) => setStudioCode(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-xs text-slate-300">Live Component Preview</h3>
                <iframe
                  title="Live Studio Preview"
                  srcDoc={studioCode}
                  sandbox="allow-scripts"
                  className="w-full h-[360px] bg-white rounded-xl border border-slate-800 shadow-inner"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
