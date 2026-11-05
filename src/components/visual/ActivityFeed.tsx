import React, { useState } from "react";
import { Activity, ShieldCheck, Zap, Radio, Bell, Clock, Search, Filter } from "lucide-react";

export interface ActivityEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  category: "system" | "model" | "transit" | "security" | "user" | "network";
  severity?: "info" | "success" | "warning" | "error";
  metadata?: Record<string, any>;
}

export interface ActivityFeedProps {
  title?: string;
  events: ActivityEvent[];
  maxItems?: number;
  enableFilter?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  title = "Live Activity & Audit Stream",
  events,
  maxItems = 20,
  enableFilter = true,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["all", "system", "model", "transit", "security", "network"];

  const filteredEvents = events
    .filter((e) => {
      const matchCat = filterCategory === "all" || e.category === filterCategory;
      const matchSearch =
        !searchQuery.trim() ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .slice(0, maxItems);

  const getCategoryIcon = (category: ActivityEvent["category"]) => {
    switch (category) {
      case "security":
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case "model":
        return <Zap className="w-3.5 h-3.5 text-indigo-400" />;
      case "transit":
        return <Radio className="w-3.5 h-3.5 text-sky-400" />;
      case "network":
        return <Activity className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getSeverityBadge = (severity?: ActivityEvent["severity"]) => {
    switch (severity) {
      case "error":
        return "border-rose-500/30 text-rose-400 bg-rose-500/10";
      case "warning":
        return "border-amber-500/30 text-amber-400 bg-amber-500/10";
      case "success":
        return "border-emerald-500/30 text-emerald-400 bg-emerald-500/10";
      case "info":
      default:
        return "border-sky-500/30 text-sky-400 bg-sky-500/10";
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Activity className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-100">{title}</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {filteredEvents.length} events
          </span>
        </div>

        {enableFilter && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 w-36 sm:w-44"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
            </div>
          </div>
        )}
      </div>

      {enableFilter && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3 h-3 text-slate-500 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition capitalize whitespace-nowrap ${
                filterCategory === cat
                  ? "bg-purple-600 text-white font-semibold"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Events Timeline List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No matching events found in this stream.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition"
            >
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                {getCategoryIcon(evt.category)}
              </div>

              <div className="flex-1 text-xs space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-200">{evt.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                    <Clock className="w-2.5 h-2.5" />
                    {evt.timestamp}
                  </span>
                </div>

                {evt.description && (
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {evt.description}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1 text-[10px]">
                  <span
                    className={`font-mono px-1.5 py-0.5 rounded border capitalize ${getSeverityBadge(
                      evt.severity
                    )}`}
                  >
                    {evt.severity || "info"}
                  </span>
                  <span className="text-slate-500 uppercase font-mono tracking-wider">
                    {evt.category}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
