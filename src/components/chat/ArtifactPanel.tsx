import React, { useState } from "react";
import { X, Copy, Check, Download, ExternalLink, Code2, Eye, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
import { ArtifactItem } from "../../types";

interface ArtifactPanelProps {
  artifact: ArtifactItem | null;
  onClose: () => void;
  isDark?: boolean;
}

export const ArtifactPanel: React.FC<ArtifactPanelProps> = ({
  artifact,
  onClose,
  isDark = true,
}) => {
  if (!artifact) return null;

  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = artifact.type === "html" ? "html" : artifact.type === "svg" ? "svg" : artifact.language || "txt";
    const filename = `${artifact.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${ext}`;
    const blob = new Blob([artifact.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Build sandboxed HTML payload for iframe preview
  const generatePreviewDoc = () => {
    const content = artifact.content;

    if (artifact.type === "svg") {
      return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: ${isDark ? "#121214" : "#f8fafc"}; }
    svg { max-width: 90%; max-height: 90vh; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
    }

    if (content.includes("<!DOCTYPE") || content.includes("<html")) {
      return content;
    }

    // Embed in an HTML wrapper with Tailwind CSS loaded via CDN for instant high-fidelity styling
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background-color: ${isDark ? "#09090b" : "#ffffff"}; color: ${isDark ? "#f4f4f5" : "#18181b"}; margin: 0; padding: 1.5rem; }
  </style>
</head>
<body>
  <div id="root">
    ${content}
  </div>
</body>
</html>`;
  };

  return (
    <div
      className={`flex flex-col border-l border-slate-700/50 bg-slate-950/95 backdrop-blur-xl shadow-2xl transition-all duration-300 z-30 ${
        isFullscreen
          ? "fixed inset-0 w-full h-full border-none"
          : "w-full lg:w-[480px] xl:w-[560px] h-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {activeTab === "preview" ? <Eye className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
          </div>
          <div className="truncate">
            <h3 className="text-sm font-semibold text-slate-200 truncate">{artifact.title}</h3>
            <span className="text-[10px] uppercase font-mono text-indigo-400 tracking-wider">
              {artifact.type} • {artifact.language}
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition ${
              activeTab === "preview"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition ${
              activeTab === "code"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {activeTab === "preview" && (
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Refresh Preview"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Download File"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition ml-1"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === "preview" ? (
          <iframe
            key={refreshKey}
            title={artifact.title}
            srcDoc={generatePreviewDoc()}
            sandbox="allow-scripts allow-modals"
            className="w-full h-full border-none bg-white dark:bg-zinc-950"
          />
        ) : (
          <div className="h-full overflow-auto p-4 font-mono text-xs text-slate-200 bg-slate-950/90 leading-relaxed selection:bg-indigo-500/30">
            <pre className="whitespace-pre-wrap break-all">
              {artifact.content}
            </pre>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between bg-slate-900/40">
        <span>Sandboxed Isolated Environment</span>
        <span>{artifact.content.length.toLocaleString()} characters</span>
      </div>
    </div>
  );
};
