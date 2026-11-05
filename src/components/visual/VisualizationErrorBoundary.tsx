import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class VisualizationErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[VisualizationEngine Error]:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>{this.props.fallbackTitle || "Visualization Render Fault"}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            {this.state.error?.message || "An unexpected error occurred while rendering visual elements."}
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg border border-slate-700 font-medium transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Visual Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
