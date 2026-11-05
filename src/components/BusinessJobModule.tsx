import React, { useState } from "react";
import {
  Briefcase,
  FileText,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Award,
  Layers,
  ArrowRight,
  Milestone,
} from "lucide-react";
import { TimelineViewer } from "./visual/TimelineViewer.tsx";
import { MetricCard } from "./visual/MetricCard.tsx";

export const BusinessJobModule: React.FC = () => {
  type BusinessTab = "resume" | "plan" | "swot" | "roadmap";
  const [activeTab, setActiveTab] = useState<BusinessTab>("resume");

  // Resume Generator States
  const [roleTarget, setRoleTarget] = useState("Staff AI Platform Engineer");
  const [experienceYears, setExperienceYears] = useState("5+");
  const [coreSkills, setCoreSkills] = useState("TypeScript, Python, Distributed Systems, Google GenAI SDK, PostgreSQL, Kubernetes");
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [loadingResume, setLoadingResume] = useState(false);

  // Business Plan States
  const [businessIdea, setBusinessIdea] = useState("Autonomous multi-agent customer support orchestration for enterprise logistics.");
  const [targetMarket, setTargetMarket] = useState("B2B Supply Chain & Logistics Operators");
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // SWOT States
  const [companyName, setCompanyName] = useState("SARVAGYA AI");
  const [generatedSwot, setGeneratedSwot] = useState<string | null>(null);
  const [loadingSwot, setLoadingSwot] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleGenerateResume = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!roleTarget || loadingResume) return;

    setLoadingResume(true);
    setGeneratedResume(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a publication-grade, ATS-optimized technical resume summary, key competencies, and high-impact accomplishment bullets for a candidate targeting the role of: "${roleTarget}".
Years of experience: ${experienceYears}
Core skills: ${coreSkills}
Format clearly with:
- Professional Summary
- Core Technical Competencies
- Highlighted Impact Projects (with quantifiable metrics)
- Certifications & Education recommendation`,
          model: "gemini-3.8-flash",
        }),
      });
      const data = await res.json();
      setGeneratedResume(data.reply || "Resume synthesis complete.");
    } catch (err: any) {
      setGeneratedResume("Failed to generate resume.");
    } finally {
      setLoadingResume(false);
    }
  };

  const handleGeneratePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!businessIdea || loadingPlan) return;

    setLoadingPlan(true);
    setGeneratedPlan(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Draft a strategic startup business plan for the following venture idea: "${businessIdea}".
Target Market: ${targetMarket}
Structure with:
1. Executive Summary & Problem-Solution Fit
2. Total Addressable Market (TAM / SAM / SOM) Sizing
3. Revenue Model & Unit Economics (CAC, LTV)
4. Go-To-Market (GTM) Strategy & Distribution Channels
5. Key Execution Risks and Mitigation Tactics`,
          model: "gemini-3.8-flash",
        }),
      });
      const data = await res.json();
      setGeneratedPlan(data.reply || "Business plan generated.");
    } catch (err: any) {
      setGeneratedPlan("Failed to generate plan.");
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleGenerateSwot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!companyName || loadingSwot) return;

    setLoadingSwot(true);
    setGeneratedSwot(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate a comprehensive SWOT Analysis Matrix for: "${companyName}".
Format with 4 clear quadrants:
1. Strengths (Internal competitive advantages)
2. Weaknesses (Internal structural constraints)
3. Opportunities (Market catalysts, macro shifts)
4. Threats (Competitor responses, regulatory headwinds)`,
          model: "gemini-3.8-flash",
        }),
      });
      const data = await res.json();
      setGeneratedSwot(data.reply || "SWOT analysis generated.");
    } catch (err: any) {
      setGeneratedSwot("Failed to generate SWOT.");
    } finally {
      setLoadingSwot(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Job & Business Intelligence</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Created by Aryan Sharma. ATS-optimized career profiles, venture business plans, corporate SWOT analytics, and interactive startup roadmaps.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex flex-wrap items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab("resume")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "resume" ? "bg-amber-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            ATS Resume
          </button>
          <button
            onClick={() => setActiveTab("plan")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "plan" ? "bg-amber-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Business Plan
          </button>
          <button
            onClick={() => setActiveTab("swot")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "swot" ? "bg-amber-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            SWOT Analysis
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "roadmap" ? "bg-amber-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Milestone className="w-3.5 h-3.5" />
            Venture Milestones & Metrics
          </button>
        </div>
      </div>

      {/* 1. RESUME BUILDER */}
      {activeTab === "resume" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              ATS Career Profile Parameters
            </h2>

            <form onSubmit={handleGenerateResume} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Role Title</label>
                <input
                  type="text"
                  value={roleTarget}
                  onChange={(e) => setRoleTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Years of Experience</label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Entry / 0-2">Entry Level (0-2 Years)</option>
                  <option value="Mid / 3-5">Mid Level (3-5 Years)</option>
                  <option value="5+">Senior / Staff (5+ Years)</option>
                  <option value="10+">Principal / Executive (10+ Years)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Core Competencies & Stack</label>
                <textarea
                  rows={3}
                  value={coreSkills}
                  onChange={(e) => setCoreSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingResume || !roleTarget}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-amber-950/40"
              >
                {loadingResume ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Synthesizing ATS-Optimized Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate ATS Technical Resume
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Generated Resume Output
                </h3>
                {generatedResume && (
                  <button
                    onClick={() => copyToClipboard(generatedResume)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Resume"}
                  </button>
                )}
              </div>

              {generatedResume ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto">
                  {generatedResume}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <FileText className="w-10 h-10 stroke-1" />
                  <p>Configure career target parameters to synthesize an ATS-ready resume.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. BUSINESS PLAN */}
      {activeTab === "plan" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Startup Venture Scope
            </h2>

            <form onSubmit={handleGeneratePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Venture Concept</label>
                <textarea
                  rows={3}
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Demographic / Market</label>
                <input
                  type="text"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPlan || !businessIdea}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-amber-950/40"
              >
                {loadingPlan ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Synthesizing Business Model & Unit Economics...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" />
                    Generate Venture Business Plan
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100">Executive Plan Output</h3>
                {generatedPlan && (
                  <button
                    onClick={() => copyToClipboard(generatedPlan)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Plan"}
                  </button>
                )}
              </div>

              {generatedPlan ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto">
                  {generatedPlan}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <TrendingUp className="w-10 h-10 stroke-1" />
                  <p>Describe your venture to synthesize market sizing, revenue model, and GTM strategy.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SWOT MATRIX */}
      {activeTab === "swot" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Corporate SWOT Audit
            </h2>

            <form onSubmit={handleGenerateSwot} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Company or Product Entity</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingSwot || !companyName}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-amber-950/40"
              >
                {loadingSwot ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Auditing 4-Quadrant Matrix...
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5" />
                    Synthesize SWOT Matrix
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-100">SWOT Matrix Output</h3>
              {generatedSwot ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto">
                  {generatedSwot}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <Layers className="w-10 h-10 stroke-1" />
                  <p>Enter an entity name to audit Strengths, Weaknesses, Opportunities, and Threats.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. VENTURE ROADMAP & METRICS */}
      {activeTab === "roadmap" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Annual Recurring Revenue (ARR)"
              value="$2.4M"
              trend="up"
              trendPercent={34.5}
              subValue="vs last quarter"
              sparkline={[1.1, 1.3, 1.6, 1.9, 2.1, 2.4]}
            />
            <MetricCard
              title="Customer Acquisition Cost (CAC)"
              value="$142"
              trend="down"
              trendPercent={-12.8}
              subValue="vs last month"
              sparkline={[180, 172, 165, 155, 148, 142]}
            />
            <MetricCard
              title="Net Retention Rate (NRR)"
              value="128%"
              trend="up"
              trendPercent={4.2}
              subValue="annualized"
              sparkline={[118, 120, 122, 124, 126, 128]}
            />
            <MetricCard
              title="Active Enterprise Seats"
              value="8,420"
              trend="up"
              trendPercent={18.9}
              subValue="30-day gain"
              sparkline={[6200, 6800, 7100, 7600, 8000, 8420]}
            />
          </div>

          <TimelineViewer
            title="Strategic Venture Milestones & GTM Execution DAG"
            events={[
              {
                id: "m1",
                title: "Seed Round & Core AI Engine Prototyping",
                timestamp: "Q1 2026",
                status: "completed",
                description: "Initial seed fund closure and multi-model gateway integration with sub-500ms latency.",
              },
              {
                id: "m2",
                title: "Enterprise Pilot & SOC-2 Type II Compliance",
                timestamp: "Q2 2026",
                status: "completed",
                description: "Deployment across 12 tier-1 enterprise beta clients with automated data isolation.",
              },
              {
                id: "m3",
                title: "Series A Expansion & Sovereign Edge Deployments",
                timestamp: "Q3 2026",
                status: "current",
                description: "Scale to 50 enterprise contracts and deploy on-premise sovereign weights for defense and healthcare.",
              },
              {
                id: "m4",
                title: "Global Autonomous Multi-Agent Marketplace",
                timestamp: "Q4 2026",
                status: "pending",
                description: "Launch public multi-agent DAG ecosystem allowing third-party verifiable tool compilation.",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};
