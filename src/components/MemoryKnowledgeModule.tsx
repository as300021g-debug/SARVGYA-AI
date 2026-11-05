import React, { useState, useEffect, useMemo } from "react";
import {
  Brain,
  Search,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  FolderOpen,
  Tag,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  Layers,
  FileText,
  ExternalLink,
  ChevronRight,
  Filter,
  Flame,
  ArrowUpDown,
  BookOpen,
  Copy,
  Check,
  TrendingUp,
  AlertTriangle,
  Globe2,
  Bot,
  Zap,
} from "lucide-react";

export interface AITextEntry {
  id: string;
  title: string;
  content: string;
  source: string;
  sourceType: "model_output" | "agent_report" | "live_intelligence" | "memory_directive" | "cloudsql";
  modelUsed?: string;
  category: "general" | "world" | "science" | "ai" | "market" | "telemetry" | "governance";
  tags: string[];
  timestamp: string;
  sources?: Array<{ title: string; uri: string }>;
  verified: boolean;
}

export interface GroupedAIEntries {
  liveAndCurrentToday: AITextEntry[];
  past24To48Hours: AITextEntry[];
  historicalEntries: AITextEntry[];
  totalCount: number;
  liveCount: number;
  currentSystemTime: string;
}

export interface LiveEntriesSummary {
  date: string;
  generatedAt: string;
  totalEntriesAnalyzed: number;
  liveCurrentEntriesCount: number;
  executiveBrief: string;
  keyPillars: Array<{
    domain: string;
    headline: string;
    details: string;
    sources: string[];
    importance: "CRITICAL" | "HIGH" | "ELEVATED";
  }>;
  crucialFacts: string[];
  trendingKeywords: string[];
}

export const MemoryKnowledgeModule: React.FC = () => {
  // Navigation & View Mode
  const [activeView, setActiveView] = useState<"stream" | "summary" | "directives">("stream");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [exactPhraseMode, setExactPhraseMode] = useState(false);
  const [dateFilter, setDateFilter] = useState<"all" | "live" | "24h">("all");
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Data States
  const [groupedData, setGroupedData] = useState<GroupedAIEntries>({
    liveAndCurrentToday: [],
    past24To48Hours: [],
    historicalEntries: [],
    totalCount: 0,
    liveCount: 0,
    currentSystemTime: new Date().toISOString(),
  });
  const [liveSummary, setLiveSummary] = useState<LiveEntriesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Manual Memory Creation
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState<"preference" | "project" | "knowledge" | "fact">("project");
  const [saving, setSaving] = useState(false);

  // Fetch entries
  const fetchEntries = async () => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams({
        query: searchQuery,
        exactPhrase: String(exactPhraseMode),
        dateFilter,
        sourceFilter: sourceTypeFilter,
        categoryFilter,
        sortBy: sortOrder,
        grouped: "true",
      });

      const res = await fetch(`/api/ai-entries?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setGroupedData({
          liveAndCurrentToday: data.liveAndCurrentToday || [],
          past24To48Hours: data.past24To48Hours || [],
          historicalEntries: data.historicalEntries || [],
          totalCount: data.totalCount || 0,
          liveCount: data.liveCount || 0,
          currentSystemTime: data.currentSystemTime || new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn("Error fetching AI entries:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch live summary
  const fetchSummary = async () => {
    try {
      const res = await fetch("/api/ai-entries/summary");
      const data = await res.json();
      if (data.success && data.summary) {
        setLiveSummary(data.summary);
      }
    } catch (err) {
      console.warn("Error fetching live summary:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchSummary();
  }, [searchQuery, exactPhraseMode, dateFilter, sourceTypeFilter, categoryFilter, sortOrder]);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || saving) return;

    setSaving(true);
    try {
      await fetch("/api/ai-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          source: "User Authorized Directive",
          sourceType: "memory_directive",
          modelUsed: "User Manual Input",
          category: "governance",
          tags: ["user-directive", newType],
        }),
      });

      setNewTitle("");
      setNewContent("");
      setShowAddForm(false);
      await fetchEntries();
      await fetchSummary();
    } catch (err) {
      console.warn("Failed to add entry:", err);
    } finally {
      setSaving(false);
    }
  };

  const copySummaryToClipboard = () => {
    if (!liveSummary) return;
    const textToCopy = `### SARVAGYA AI — LIVE SUMMARY OF AI-GENERATED ENTRIES\nDate: ${liveSummary.date}\nGenerated: ${liveSummary.generatedAt}\n\n${liveSummary.executiveBrief}\n\nKEY DOMAINS & CRITICAL DETAILS:\n${liveSummary.keyPillars
      .map(
        (p, i) =>
          `${i + 1}. [${p.importance}] ${p.domain}: ${p.headline}\n   - ${p.details}\n   - Sources: ${p.sources.join(", ")}`
      )
      .join("\n\n")}\n\nCRUCIAL FACTS:\n${liveSummary.crucialFacts.map((f) => `• ${f}`).join("\n")}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // Text highlighting utility for exact phrases & keywords
  const highlightMatches = (text: string, query: string, exact: boolean) => {
    const trimmed = query.trim();
    if (!trimmed) return text;

    if (exact || /^"(.+)"$/.test(trimmed)) {
      const target = trimmed.replace(/^"|"$/g, "");
      if (!target) return text;
      const regex = new RegExp(`(${target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-amber-400/30 text-amber-200 px-1 py-0.5 rounded font-semibold border-b border-amber-400">
            {part}
          </mark>
        ) : (
          part
        )
      );
    }

    const words = trimmed.split(/\s+/).filter((w) => w.length > 1);
    if (words.length === 0) return text;

    const pattern = `(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`;
    const regex = new RegExp(pattern, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-cyan-400/25 text-cyan-200 px-0.5 py-0.2 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Format timestamp helper
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return isoString;
    }
  };

  const formatDateLabel = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return isoString;
    }
  };

  const renderEntryCard = (entry: AITextEntry) => {
    const isLiveToday = entry.timestamp.startsWith("2026-11-02");

    return (
      <div
        key={entry.id}
        className={`p-4 rounded-xl border transition-all duration-200 space-y-3 flex flex-col justify-between ${
          isLiveToday
            ? "bg-slate-900/90 border-cyan-500/30 hover:border-cyan-400/60 shadow-lg shadow-cyan-950/20"
            : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
        }`}
      >
        <div className="space-y-2">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
            <div className="flex items-center gap-1.5 flex-wrap">
              {isLiveToday ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  LIVE • TODAY
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded font-medium bg-slate-800 text-slate-400 border border-slate-700">
                  {formatDateLabel(entry.timestamp)}
                </span>
              )}

              <span
                className={`px-2 py-0.5 rounded font-semibold border ${
                  entry.sourceType === "model_output"
                    ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                    : entry.sourceType === "agent_report"
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                    : entry.sourceType === "live_intelligence"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                    : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                }`}
              >
                {entry.sourceType.replace("_", " ").toUpperCase()}
              </span>

              {entry.category && (
                <span className="px-2 py-0.5 rounded font-mono bg-slate-800/80 text-slate-300 border border-slate-700/60">
                  #{entry.category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{formatTime(entry.timestamp)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-100 leading-snug">
            {highlightMatches(entry.title, searchQuery, exactPhraseMode)}
          </h3>

          {/* Content */}
          <p className="text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
            {highlightMatches(entry.content, searchQuery, exactPhraseMode)}
          </p>

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {entry.tags.slice(0, 4).map((t, idx) => (
                <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800/60 text-slate-400 border border-slate-700/40">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between gap-2">
          <div className="truncate max-w-[220px]">
            <span className="text-slate-500">Source:</span>{" "}
            <span className="text-slate-300 font-medium">{entry.source}</span>
            {entry.modelUsed && <span className="text-slate-500 text-[9px]"> ({entry.modelUsed})</span>}
          </div>

          {entry.sources && entry.sources.length > 0 && (
            <a
              href={entry.sources[0].uri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium shrink-0"
            >
              <span>{entry.sources[0].title ? entry.sources[0].title.slice(0, 18) + "..." : "Link"}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Status Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm">
              <Brain className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">AI-Generated Text Entries & Intelligence Repository</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Live Chronological Stream • Nov 2, 2026
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Unified index of all AI-generated text entries, autonomous agent reports, and real-time world intelligence.
            Chronologically organized by date and time, grouped around live/current information with exact phrase and keyword search.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              fetchEntries();
              fetchSummary();
            }}
            disabled={refreshing}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-cyan-400" : ""}`} />
            Refresh Feeds
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-950/40 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add AI Directive
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("stream")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeView === "stream"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Chronological Stream</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
              {groupedData.totalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView("summary")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeView === "summary"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Live Summary & Key Facts</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Nov 2, 2026
            </span>
          </button>

          <button
            onClick={() => setActiveView("directives")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeView === "directives"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>System Directives & Memory</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>Current Anchor: Nov 2, 2026</span>
        </div>
      </div>

      {/* Manual Directive Modal */}
      {showAddForm && (
        <form onSubmit={handleAddMemory} className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
            <span>Store New Authorized AI Generation / Directive</span>
            <span className="text-[10px] text-slate-500">Persistent Storage • Zero Mock</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Gemini 4 Argon Verified Model Synthesis"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Layer / Classification</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="project">Project Context</option>
                <option value="preference">User Preference</option>
                <option value="knowledge">Knowledge Base</option>
                <option value="fact">Verified Fact</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Entry Text Content</label>
            <textarea
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="State the detailed AI-generated text or verified information..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !newTitle.trim() || !newContent.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              Save to Persistent Repository
            </button>
          </div>
        </form>
      )}

      {/* SEARCH AND FILTER BAR (Active on Stream view) */}
      {activeView === "stream" && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  exactPhraseMode
                    ? 'Exact phrase search (e.g. "Sean Duffy" or "Sensex Jumps 650")...'
                    : "Search keywords or exact phrases (use quotes for exact match)..."
                }
                className="w-full pl-9 pr-24 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />

              {/* Exact Phrase Mode Button */}
              <button
                onClick={() => setExactPhraseMode(!exactPhraseMode)}
                className={`absolute right-2 top-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                  exactPhraseMode
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
                }`}
                title="Toggle exact phrase matching"
              >
                {exactPhraseMode ? '✓ Exact Phrase' : '"Exact"'}
              </button>
            </div>

            {/* Date Scope Filter */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setDateFilter("all")}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium ${
                  dateFilter === "all" ? "bg-cyan-600 text-white font-semibold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All Dates
              </button>
              <button
                onClick={() => setDateFilter("live")}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium flex items-center gap-1 ${
                  dateFilter === "live" ? "bg-rose-600 text-white font-semibold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Live Today (Nov 2)
              </button>
              <button
                onClick={() => setDateFilter("24h")}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium ${
                  dateFilter === "24h" ? "bg-cyan-600 text-white font-semibold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Past 24h
              </button>
            </div>
          </div>

          {/* Secondary Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter by:
              </span>

              {/* Source Type */}
              <select
                value={sourceTypeFilter}
                onChange={(e) => setSourceTypeFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-[11px] focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Sources</option>
                <option value="model_output">AI Model Output (Gemini / Astra)</option>
                <option value="agent_report">Autonomous Agent OS Reports</option>
                <option value="live_intelligence">Live Ingested Telemetry</option>
                <option value="memory_directive">System Memory Directives</option>
              </select>

              {/* Category */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-[11px] focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="world">World Affairs</option>
                <option value="market">Markets & Economy</option>
                <option value="science">Science & Health</option>
                <option value="ai">AI & Systems</option>
                <option value="telemetry">Telemetry</option>
              </select>
            </div>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-[11px] hover:text-white"
            >
              <ArrowUpDown className="w-3 h-3 text-cyan-400" />
              <span>{sortOrder === "desc" ? "Newest First (Chronological)" : "Oldest First"}</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: CHRONOLOGICAL STREAM */}
      {activeView === "stream" && (
        <div className="space-y-8">
          {/* GROUP 1: LIVE & CURRENT TODAY (Nov 2, 2026) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>Live & Current: Today — November 2, 2026</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                    {groupedData.liveAndCurrentToday.length} verified entries
                  </span>
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Chronological order maintained (latest first)
              </span>
            </div>

            {groupedData.liveAndCurrentToday.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
                No entries matching your filter criteria in today's live feed.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedData.liveAndCurrentToday.map(renderEntryCard)}
              </div>
            )}
          </div>

          {/* GROUP 2: PAST 24 TO 48 HOURS */}
          {dateFilter !== "live" && groupedData.past24To48Hours.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <span>Recent Sessions: Past 24–48 Hours</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {groupedData.past24To48Hours.length} entries
                    </span>
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  Nov 1, 2026 & Oct 31, 2026
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedData.past24To48Hours.map(renderEntryCard)}
              </div>
            </div>
          )}

          {/* GROUP 3: HISTORICAL ARCHIVES */}
          {dateFilter === "all" && groupedData.historicalEntries.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <span>Historical Archive Entries</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                      {groupedData.historicalEntries.length} entries
                    </span>
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                  Oct 29–30, 2026 & prior sessions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedData.historicalEntries.map(renderEntryCard)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: EXECUTIVE LIVE SUMMARY (Summarizing key information dated live & current) */}
      {activeView === "summary" && liveSummary && (
        <div className="space-y-6">
          {/* Summary Hero Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Executive Briefing
                </span>
                <h2 className="text-lg font-bold text-slate-100 mt-1">
                  Key Information Summary: {liveSummary.date}
                </h2>
                <p className="text-xs text-slate-400">
                  Synthesized across {liveSummary.totalEntriesAnalyzed} verified entries with special emphasis on {liveSummary.liveCurrentEntriesCount} live entries timestamped today.
                </p>
              </div>

              <button
                onClick={copySummaryToClipboard}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-950/40 transition shrink-0"
              >
                {copiedSummary ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSummary ? "Copied!" : "Copy Briefing"}</span>
              </button>
            </div>

            {/* High-Level Brief */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-indigo-500/20 text-slate-200 text-xs leading-relaxed font-sans">
              <span className="font-bold text-amber-300">Executive Summary: </span>
              {liveSummary.executiveBrief}
            </div>

            {/* Trending Keywords Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Trending Topics:
              </span>
              {liveSummary.trendingKeywords.map((kw, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSearchQuery(kw);
                    setActiveView("stream");
                  }}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveSummary.keyPillars.map((pillar, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {pillar.domain}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                      pillar.importance === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : pillar.importance === "HIGH"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                    }`}
                  >
                    {pillar.importance}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100">{pillar.headline}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{pillar.details}</p>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex flex-wrap gap-2">
                  <span className="text-slate-400">Sources:</span>
                  {pillar.sources.map((s, idx) => (
                    <span key={idx} className="font-mono text-cyan-400/90">
                      • {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Crucial Facts & Specific Details Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Crucial Verified Data Points & Exact Metrics (Nov 2, 2026)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {liveSummary.crucialFacts.map((fact, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <span className="text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SYSTEM DIRECTIVES & SHARED MEMORY */}
      {activeView === "directives" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-300">
            <strong>Permission-Governed Directives:</strong> Memory records dictate system persona parameters,
            governance constraints, and multi-model failover logic across Astra and Gemini.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedData.historicalEntries
              .filter((e) => e.sourceType === "memory_directive")
              .concat(groupedData.liveAndCurrentToday.filter((e) => e.sourceType === "memory_directive"))
              .map(renderEntryCard)}
          </div>
        </div>
      )}
    </div>
  );
};
