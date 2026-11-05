import React, { useState } from "react";
import { TimelineEvent } from "./types.ts";
import { CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp, Calendar } from "lucide-react";

export interface TimelineViewerProps {
  title?: string;
  description?: string;
  events: TimelineEvent[];
  initialExpandedId?: string;
}

export const TimelineViewer: React.FC<TimelineViewerProps> = ({
  title = "Mission & Execution Timeline",
  description = "Sequential milestones, operational status, and verification metrics",
  events,
  initialExpandedId,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(initialExpandedId || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getStatusNode = (status: TimelineEvent["status"]) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          ring: "border-emerald-500/50 bg-emerald-950",
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "current":
        return {
          icon: <Clock className="w-4 h-4 text-sky-400 animate-spin" />,
          ring: "border-sky-500/60 bg-sky-950 shadow-md shadow-sky-500/20",
          badge: "bg-sky-500/10 text-sky-400 border-sky-500/20 animate-pulse",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          ring: "border-amber-500/50 bg-amber-950",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      case "pending":
      default:
        return {
          icon: <div className="w-2 h-2 rounded-full bg-slate-500" />,
          ring: "border-slate-700 bg-slate-900",
          badge: "bg-slate-800 text-slate-400 border-slate-700",
        };
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Calendar className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-100">{title}</h3>
        </div>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((evt, idx) => {
          const statusConfig = getStatusNode(evt.status);
          const isExpanded = expandedId === evt.id;

          return (
            <div key={evt.id || idx} className="relative group">
              {/* Node Marker */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${statusConfig.ring}`}
              >
                {statusConfig.icon}
              </div>

              {/* Event Card */}
              <div
                onClick={() => toggleExpand(evt.id)}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-100">{evt.title}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${statusConfig.badge}`}
                      >
                        {evt.status}
                      </span>
                      {evt.category && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          • {evt.category}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{evt.timestamp}</div>
                  </div>

                  <button className="text-slate-500 hover:text-slate-300 p-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {evt.description && (
                  <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
                )}

                {/* Expanded Details & Metrics */}
                {isExpanded && evt.metrics && Object.keys(evt.metrics).length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(evt.metrics).map(([mKey, mVal]) => (
                      <div key={mKey} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">{mKey}</div>
                        <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">
                          {String(mVal)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
