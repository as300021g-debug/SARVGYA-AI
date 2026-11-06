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

export interface DateGroupedEntry {
  dateKey: string;
  dateLabel: string;
  entryCount: number;
  entries: AITextEntry[];
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
  // Default to 'asc' (Earliest First) to honor user request: "starting with the earliest entry"
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("asc");
  const [groupingMode, setGroupingMode] = useState<"chronological_dates" | "status_buckets">("chronological_dates");

  // Data States
  const [dateGroups, setDateGroups] = useState<DateGroupedEntry[]>([]);
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

  // Tag Management States
  const [activeTagInputId, setActiveTagInputId] = useState<string | null>(null);
  const [customTagInput, setCustomTagInput] = useState<string>("");
  const [tagSuggestions, setTagSuggestions] = useState<Record<string, string[]>>({});
  const [loadingSuggestionsFor, setLoadingSuggestionsFor] = useState<string | null>(null);

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

      // Fetch date-grouped chronological stream
      const dateParams = new URLSearchParams({
        query: searchQuery,
        exactPhrase: String(exactPhraseMode),
        sourceFilter: sourceTypeFilter,
        categoryFilter,
        sortBy: sortOrder,
        groupByDate: "true",
      });

      const dateRes = await fetch(`/api/ai-entries?${dateParams.toString()}`);
      const dateData = await dateRes.json();
      if (dateData.success && Array.isArray(dateData.dateGroups)) {
        setDateGroups(dateData.dateGroups);
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

  // Update local entry tags smoothly across all views
  const updateLocalEntryTags = (id: string, newTags: string[]) => {
    setDateGroups((prev) =>
      prev.map((group) => ({
        ...group,
        entries: group.entries.map((e) => (e.id === id ? { ...e, tags: newTags } : e)),
      }))
    );
    setGroupedData((prev) => ({
      ...prev,
      liveAndCurrentToday: prev.liveAndCurrentToday.map((e) => (e.id === id ? { ...e, tags: newTags } : e)),
      past24To48Hours: prev.past24To48Hours.map((e) => (e.id === id ? { ...e, tags: newTags } : e)),
      historicalEntries: prev.historicalEntries.map((e) => (e.id === id ? { ...e, tags: newTags } : e)),
    }));
  };

  // Add Tag to Entry Handler
  const handleAddTag = async (entry: AITextEntry, tagToAdd: string) => {
    const clean = tagToAdd.trim().toLowerCase().replace(/^#+/, "").replace(/\s+/g, "-");
    if (!clean) return;
    const currentTags = entry.tags || [];
    if (currentTags.map((t) => t.toLowerCase()).includes(clean)) return;

    const newTags = [...currentTags, clean];
    try {
      const res = await fetch(`/api/ai-entries/${encodeURIComponent(entry.id)}/tags`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: newTags }),
      });
      const data = await res.json();
      if (data.success) {
        updateLocalEntryTags(entry.id, newTags);
        setTagSuggestions((prev) => ({
          ...prev,
          [entry.id]: (prev[entry.id] || []).filter((t) => t.toLowerCase() !== clean),
        }));
      }
    } catch (err) {
      console.warn("Failed to add tag:", err);
    }
  };

  // Remove Tag from Entry Handler
  const handleRemoveTag = async (entry: AITextEntry, tagToRemove: string) => {
    const newTags = (entry.tags || []).filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase());
    try {
      const res = await fetch(`/api/ai-entries/${encodeURIComponent(entry.id)}/tags`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: newTags }),
      });
      const data = await res.json();
      if (data.success) {
        updateLocalEntryTags(entry.id, newTags);
      }
    } catch (err) {
      console.warn("Failed to remove tag:", err);
    }
  };

  // Suggest Tags for Entry Handler
  const handleSuggestTags = async (entry: AITextEntry) => {
    setLoadingSuggestionsFor(entry.id);
    try {
      const res = await fetch("/api/ai-entries/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: entry.content,
          title: entry.title,
          existingTags: entry.tags || [],
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.suggestedTags)) {
        setTagSuggestions((prev) => ({
          ...prev,
          [entry.id]: data.suggestedTags,
        }));
      }
    } catch (err) {
      console.warn("Failed to suggest tags:", err);
    } finally {
      setLoadingSuggestionsFor(null);
    }
  };

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

  // Format full date label helper
  const formatDateFull = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const renderEntryCard = (entry: AITextEntry) => {
    const isLiveToday = entry.timestamp.startsWith("2026-11-02");
    const suggestions = tagSuggestions[entry.id] || [];
    const isSuggesting = loadingSuggestionsFor === entry.id;
    const isAddingTag = activeTagInputId === entry.id;

    return (
      <div
        key={entry.id}
        className={`p-4 rounded-xl border transition-all duration-200 space-y-3 flex flex-col justify-between ${
          isLiveToday
            ? "bg-slate-900/95 border-cyan-500/30 hover:border-cyan-400/60 shadow-lg shadow-cyan-950/20"
            : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
        }`}
      >
        <div className="space-y-3">
          {/* Top Explicit Date & Time Header */}
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-slate-400 text-[11px]">Date:</span>
              <span className="font-semibold text-slate-100">{formatDateFull(entry.timestamp)}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
              <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="text-slate-400 text-[10px]">Time:</span>
              <span className="font-bold">{formatTime(entry.timestamp)}</span>
            </div>
          </div>

          {/* Source & Category Badges */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
            <div className="flex items-center gap-1.5 flex-wrap">
              {isLiveToday && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  LIVE
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
          </div>

          {/* Title with search highlighting */}
          <h3 className="text-sm font-bold text-slate-100 leading-snug">
            {highlightMatches(entry.title, searchQuery, exactPhraseMode)}
          </h3>

          {/* Content with search highlighting */}
          <p className="text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
            {highlightMatches(entry.content, searchQuery, exactPhraseMode)}
          </p>

          {/* TAG CATEGORIZATION & SUGGESTIONS */}
          <div className="pt-2 border-t border-slate-800/60 space-y-2">
            <div className="flex items-center justify-between gap-1 text-[11px]">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Tag className="w-3 h-3 text-cyan-400" /> Tags ({entry.tags?.length || 0}):
              </span>

              {/* Suggest Relevant Tags */}
              <button
                type="button"
                onClick={() => handleSuggestTags(entry)}
                disabled={isSuggesting}
                className="text-[10px] font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1 transition"
                title="Suggest relevant tags based on entry content"
              >
                <Sparkles className={`w-3 h-3 ${isSuggesting ? "animate-spin text-amber-400" : ""}`} />
                <span>{isSuggesting ? "Analyzing..." : "Suggest Tags"}</span>
              </button>
            </div>

            {/* Active Tags with Removal */}
            <div className="flex flex-wrap items-center gap-1.5">
              {entry.tags && entry.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition"
                >
                  <span>#{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(entry, t)}
                    className="text-slate-400 hover:text-rose-400 ml-0.5 transition font-bold"
                    title={`Remove tag #${t}`}
                  >
                    ✕
                  </button>
                </span>
              ))}

              {/* Add Tag Inline Form */}
              {isAddingTag ? (
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (customTagInput.trim()) {
                          handleAddTag(entry, customTagInput.trim());
                          setCustomTagInput("");
                          setActiveTagInputId(null);
                        }
                      } else if (e.key === "Escape") {
                        setActiveTagInputId(null);
                        setCustomTagInput("");
                      }
                    }}
                    placeholder="tag + Enter"
                    className="w-24 px-1.5 py-0.5 text-[10px] bg-slate-950 border border-cyan-500 rounded text-slate-100 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTagInput.trim()) {
                        handleAddTag(entry, customTagInput.trim());
                        setCustomTagInput("");
                      }
                      setActiveTagInputId(null);
                    }}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold px-1"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTagInputId(null);
                      setCustomTagInput("");
                    }}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTagInputId(entry.id);
                    setCustomTagInput("");
                  }}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-900/40 transition"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>Tag</span>
                </button>
              )}
            </div>

            {/* AI Suggested Tags Options */}
            {suggestions.length > 0 && (
              <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 space-y-1">
                <span className="text-[10px] text-amber-300 font-medium flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Click to add suggested tag:
                </span>
                <div className="flex flex-wrap gap-1">
                  {suggestions.map((st, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddTag(entry, st)}
                      className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/30 font-mono transition flex items-center gap-0.5"
                    >
                      <span>+</span>
                      <span>#{st}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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

  const totalFilteredEntries = useMemo(() => {
    return dateGroups.reduce((acc, g) => acc + g.entries.length, 0);
  }, [dateGroups]);

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
              Chronological Stream • Organized by Date & Time
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Unified index of all AI-generated text entries, autonomous agent reports, and real-time world intelligence.
            Chronologically grouped starting from the earliest entry, with real-time keyword search, explicit date/time labels, and smart tag categorization.
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
          <span>Timeline: Oct 29 – Nov 2, 2026</span>
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
          {/* Main Search Row */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keywords across text entries (e.g. ISRO, Sensex, Gemini, Aviation)..."
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
                {exactPhraseMode ? "✓ Exact Phrase" : '"Exact"'}
              </button>
            </div>

            {/* View Grouping Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setGroupingMode("chronological_dates")}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium flex items-center gap-1 ${
                  groupingMode === "chronological_dates"
                    ? "bg-cyan-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>By Calendar Date</span>
              </button>
              <button
                onClick={() => setGroupingMode("status_buckets")}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium flex items-center gap-1 ${
                  groupingMode === "status_buckets"
                    ? "bg-cyan-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>By Priority / Live</span>
              </button>
            </div>
          </div>

          {/* Secondary Controls: Filters & Sort Order */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filters:
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

            {/* Chronological Sort Toggle: Earliest vs Latest */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-cyan-500/30 hover:border-cyan-500/60 rounded-lg text-cyan-300 text-[11px] font-semibold transition"
                title="Toggle chronological sorting"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {sortOrder === "asc"
                    ? "📅 Chronological: Earliest First (Ascending)"
                    : "📅 Chronological: Latest First (Descending)"}
                </span>
              </button>
            </div>
          </div>

          {/* Search Query Feedback Banner */}
          {searchQuery.trim() && (
            <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-cyan-200">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  Showing text entries containing:{" "}
                  <strong className="text-white">"{searchQuery}"</strong> ({totalFilteredEntries} entries found)
                </span>
              </div>
              <button
                onClick={() => setSearchQuery("")}
                className="text-[11px] text-cyan-400 hover:text-cyan-200 underline font-medium"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 1: CHRONOLOGICAL STREAM */}
      {activeView === "stream" && (
        <div className="space-y-8">
          {/* MODE A: CHRONOLOGICAL GROUPING BY CALENDAR DATE (Starting with earliest entry) */}
          {groupingMode === "chronological_dates" && (
            <div className="space-y-8">
              {dateGroups.length === 0 ? (
                <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
                  No text entries found matching your search and filter criteria.
                </div>
              ) : (
                dateGroups.map((group, groupIdx) => {
                  const isTodayGroup = group.dateKey === "2026-11-02";
                  return (
                    <div key={group.dateKey} className="space-y-4">
                      {/* Date Group Header */}
                      <div
                        className={`flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b gap-2 ${
                          isTodayGroup ? "border-cyan-500/40" : "border-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className={`p-1.5 rounded-lg border flex items-center justify-center ${
                              isTodayGroup
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                : "bg-slate-800 text-cyan-400 border-slate-700"
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                          </span>

                          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                            <span>{group.dateLabel}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              {group.entryCount} {group.entryCount === 1 ? "entry" : "entries"}
                            </span>
                            {isTodayGroup && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                                LIVE TODAY
                              </span>
                            )}
                          </h2>
                        </div>

                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                          <span>Group #{groupIdx + 1}</span>
                          <span>•</span>
                          <span>
                            {sortOrder === "asc" ? "Sorted Earliest → Latest" : "Sorted Latest → Earliest"}
                          </span>
                        </div>
                      </div>

                      {/* Entries Grid for this Date */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.entries.map(renderEntryCard)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* MODE B: STATUS BUCKETS (Live Today / Past 24-48h / Historical) */}
          {groupingMode === "status_buckets" && (
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
                    {sortOrder === "asc" ? "Ascending (Earliest first)" : "Descending (Latest first)"}
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
