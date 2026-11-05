import React from "react";
import { CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";

export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  status: "completed" | "current" | "pending" | "error";
  timestamp?: string;
}

export interface ProgressPanelProps {
  title: string;
  subtitle?: string;
  percent: number;
  steps?: ProgressStep[];
  statusText?: string;
  estimatedRemaining?: string;
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({
  title,
  subtitle,
  percent,
  steps = [],
  statusText,
  estimatedRemaining,
}) => {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {estimatedRemaining && (
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              ETA: {estimatedRemaining}
            </span>
          )}
          <span className="text-sm font-bold text-sky-400 font-mono">
            {Math.round(clampedPercent)}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="space-y-1.5">
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${clampedPercent}%` }}
          />
        </div>
        {statusText && (
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>{statusText}</span>
            <span>{clampedPercent === 100 ? "Task Complete" : "In Progress..."}</span>
          </div>
        )}
      </div>

      {/* Step Breakdown */}
      {steps.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isError = step.status === "error";

            return (
              <div
                key={step.id || idx}
                className="flex items-start gap-3 p-2 rounded-xl bg-slate-950/40 border border-slate-800/50"
              >
                <div className="pt-0.5">
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isCurrent && <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />}
                  {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
                  {!isCompleted && !isCurrent && !isError && (
                    <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-800" />
                  )}
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-semibold ${
                        isCurrent
                          ? "text-sky-300"
                          : isCompleted
                          ? "text-slate-200"
                          : "text-slate-500"
                      }`}
                    >
                      {step.label}
                    </span>
                    {step.timestamp && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {step.timestamp}
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <p className="text-[11px] text-slate-400 mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
