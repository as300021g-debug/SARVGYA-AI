// ============================================================================
// SARVAGYA AI — CALENDAR & SCHEDULE VISUALIZER
// Interactive monthly/weekly agenda and task dispatch grid
// ============================================================================

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Tag } from "lucide-react";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  category?: "study" | "orbit" | "market" | "workspace" | "general";
  description?: string;
  location?: string;
}

export interface CalendarViewProps {
  title?: string;
  events?: CalendarEvent[];
  initialDate?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  title = "Universal Agenda & Schedule",
  events = [
    { id: "ev-1", title: "JWST Deep Field L2 Telemetry Sync", date: "2026-10-27", time: "14:00", category: "orbit", description: "Receives spectrographic downlink via Deep Space Network." },
    { id: "ev-2", title: "NVDA & Big Tech Earnings Call", date: "2026-10-28", time: "16:30", category: "market", description: "Q3 earnings release and guidance conference." },
    { id: "ev-3", title: "Quantum Computing Seminar", date: "2026-10-29", time: "10:00", category: "study", description: "Superconducting qubits & error mitigation protocols." },
    { id: "ev-4", title: "Executive Workspace Sync", date: "2026-10-31", time: "11:00", category: "workspace", description: "Quarterly roadmap review in Google Docs and Drive." },
  ],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1)); // Oct 2026
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-27");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const selectedEvents = events.filter((e) => e.date === selectedDate);

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case "orbit":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      case "market":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "study":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "workspace":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default:
        return "bg-slate-700/30 text-slate-300 border-slate-600";
    }
  };

  return (
    <div className="w-full border border-slate-800 bg-[#060810] text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <CalendarIcon className="h-3.5 w-3.5" />
          </div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-100">
            {title}
          </h4>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={handlePrevMonth}
            className="p-1 border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="font-bold text-slate-200">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Calendar Grid */}
        <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-slate-800 p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-slate-500 mb-2">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12 border border-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const dayEvents = events.filter((e) => e.date === dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-12 p-1 border text-left flex flex-col justify-between font-mono text-xs transition-colors ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold"
                      : "border-slate-800/80 bg-slate-950 hover:bg-slate-900/60 text-slate-300"
                  }`}
                >
                  <span className="text-[11px]">{dayNum}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex space-x-0.5 overflow-hidden">
                      {dayEvents.map((e, idx) => (
                        <span
                          key={idx}
                          className="h-1.5 w-1.5 bg-cyan-400 block"
                          title={e.title}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda */}
        <div className="p-4 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-3 border-b border-slate-800 pb-1">
              AGENDA FOR {selectedDate}
            </div>

            {selectedEvents.length > 0 ? (
              <div className="space-y-2.5">
                {selectedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 border border-slate-800 bg-slate-950/60 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{ev.title}</span>
                      {ev.category && (
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 border ${getCategoryColor(
                            ev.category
                          )}`}
                        >
                          {ev.category}
                        </span>
                      )}
                    </div>
                    {ev.time && (
                      <div className="flex items-center space-x-1 text-[10px] text-cyan-400">
                        <Clock className="h-3 w-3" />
                        <span>{ev.time}</span>
                      </div>
                    )}
                    {ev.description && (
                      <div className="text-[11px] text-slate-400 pt-1">
                        {ev.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-slate-800 text-slate-500 text-center text-[11px]">
                No scheduled operations or lectures for this date.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500">
            Real-time synchronization with Google Workspace & orbital calendar telemetry.
          </div>
        </div>
      </div>
    </div>
  );
};
