import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  Camera,
  Mic,
  Upload,
  FileText,
  Video,
  Scan,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Layers,
  AlertCircle,
  Play,
  Pause,
  Trash2,
} from "lucide-react";

interface DetectedObject {
  label: string;
  confidence: number;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] (0 - 1000)
}

export const VisionAudioDocLab: React.FC = () => {
  const [activeMode, setActiveMode] = useState<"detection" | "ocr" | "video_summary" | "audio_transcription">("detection");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [fileName, setFileName] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isOptimizingPrompt, setIsOptimizingPrompt] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Results
  const [detectionResults, setDetectionResults] = useState<{ summary: string; objects: DetectedObject[] } | null>(null);
  const [ocrResults, setOcrResults] = useState<{ title: string; fullText: string; entities?: any; tables?: any[] } | null>(null);
  const [videoResults, setVideoResults] = useState<{ summary: string; timeline: Array<{ time: string; action: string; subjects?: string[] }>; keyTakeaways: string[] } | null>(null);
  const [audioResults, setAudioResults] = useState<{ language: string; fullTranscript: string; segments: Array<{ speaker: string; time: string; text: string }>; summary: string } | null>(null);

  const [hoveredBoxIndex, setHoveredBoxIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load sample on mount if empty
  useEffect(() => {
    const saved = localStorage.getItem("sarvagya_vision_lab_cache");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mediaPreview) setMediaPreview(parsed.mediaPreview);
        if (parsed.detectionResults) setDetectionResults(parsed.detectionResults);
        if (parsed.ocrResults) setOcrResults(parsed.ocrResults);
        if (parsed.activeMode) setActiveMode(parsed.activeMode);
      } catch {}
    }
  }, []);

  const saveCache = (update: any) => {
    try {
      const existing = localStorage.getItem("sarvagya_vision_lab_cache");
      const current = existing ? JSON.parse(existing) : {};
      localStorage.setItem("sarvagya_vision_lab_cache", JSON.stringify({ ...current, ...update }));
    } catch {}
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setMimeType(file.type || "image/png");
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setMediaPreview(result);
      saveCache({ mediaPreview: result });
      // Reset prior analysis
      setDetectionResults(null);
      setOcrResults(null);
      setVideoResults(null);
      setAudioResults(null);
    };
    reader.readAsDataURL(file);
  };

  const startWebcam = async () => {
    try {
      setIsWebcamActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      setErrorMsg("Webcam permission denied or camera unavailable: " + err.message);
      setIsWebcamActive(false);
    }
  };

  const captureWebcamSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setMediaPreview(dataUrl);
      setMimeType("image/png");
      setFileName("webcam_snapshot_" + Date.now() + ".png");
      saveCache({ mediaPreview: dataUrl });
      stopWebcam();
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  const handleOptimizePrompt = async () => {
    if (!customPrompt.trim()) return;
    setIsOptimizingPrompt(true);
    try {
      const res = await fetch("/api/ai/optimize-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customPrompt, domain: "computer-vision-multimodal" }),
      });
      const data = await res.json();
      if (data.optimizedPrompt) {
        setCustomPrompt(data.optimizedPrompt);
      }
    } catch {
    } finally {
      setIsOptimizingPrompt(false);
    }
  };

  const runAnalysis = async () => {
    if (!mediaPreview) {
      setErrorMsg("Please upload an image, audio file, or capture from webcam first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/ai/vision-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: mediaPreview,
          audioBase64: mediaPreview,
          mimeType,
          mode: activeMode,
          customPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Analysis failed");
      }

      if (activeMode === "detection") {
        setDetectionResults({ summary: data.summary, objects: data.objects || [] });
        saveCache({ detectionResults: { summary: data.summary, objects: data.objects || [] } });
      } else if (activeMode === "ocr") {
        setOcrResults({
          title: data.title || "Extracted Document",
          fullText: data.fullText || "",
          entities: data.entities,
          tables: data.tables,
        });
        saveCache({ ocrResults: data });
      } else if (activeMode === "video_summary") {
        setVideoResults(data);
        saveCache({ videoResults: data });
      } else if (activeMode === "audio_transcription") {
        setAudioResults(data);
        saveCache({ audioResults: data });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to analyze media via Gemini Vision API.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = (obj: any, name: string) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Palette for bounding box colors
  const boxColors = [
    { stroke: "#06b6d4", fill: "rgba(6, 182, 212, 0.2)", text: "#22d3ee" }, // cyan
    { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.2)", text: "#34d399" }, // emerald
    { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.2)", text: "#fbbf24" }, // amber
    { stroke: "#a855f7", fill: "rgba(168, 85, 247, 0.2)", text: "#c084fc" }, // purple
    { stroke: "#ec4899", fill: "rgba(236, 72, 153, 0.2)", text: "#f472b6" }, // pink
    { stroke: "#3b82f6", fill: "rgba(59, 130, 246, 0.2)", text: "#60a5fa" }, // blue
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Eye className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              Multimodal Vision, Audio & Document Lab
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            2D Object Bounding Boxes • Deep OCR & Document-to-JSON • Video Action Summarization • Speaker Diarization
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveMode("detection")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeMode === "detection"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            Bounding Boxes
          </button>
          <button
            onClick={() => setActiveMode("ocr")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeMode === "ocr"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            OCR to JSON
          </button>
          <button
            onClick={() => setActiveMode("video_summary")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeMode === "video_summary"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Video Timeline
          </button>
          <button
            onClick={() => setActiveMode("audio_transcription")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeMode === "audio_transcription"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            Audio Diarization
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-slate-200">
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Upload / Preview on Left, Analysis Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Media Stage & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                Media Input Stage
              </span>
              {mediaPreview && (
                <button
                  onClick={() => {
                    setMediaPreview(null);
                    setDetectionResults(null);
                    setOcrResults(null);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Webcam Live Stream View */}
            {isWebcamActive ? (
              <div className="relative rounded-lg overflow-hidden border border-cyan-500/40 bg-black aspect-video flex flex-col items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-3 flex items-center gap-2">
                  <button
                    onClick={captureWebcamSnapshot}
                    className="px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/30"
                  >
                    <Camera className="w-3.5 h-3.5" /> Capture Snapshot
                  </button>
                  <button
                    onClick={stopWebcam}
                    className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : mediaPreview ? (
              /* Media Preview Container with SVG Bounding Box Overlay */
              <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 max-h-[460px] flex items-center justify-center">
                {mimeType.startsWith("audio") ? (
                  <div className="w-full p-8 flex flex-col items-center justify-center space-y-3">
                    <Mic className="w-12 h-12 text-purple-400 animate-pulse" />
                    <span className="text-xs font-mono text-slate-300">{fileName || "Audio File"}</span>
                    <audio src={mediaPreview} controls className="w-full mt-2" />
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={mediaPreview}
                      alt="Uploaded media"
                      className="max-w-full max-h-[440px] object-contain select-none block"
                    />

                    {/* SVG Bounding Box Overlay for Object Detection */}
                    {activeMode === "detection" && detectionResults?.objects && (
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox="0 0 1000 1000"
                        preserveAspectRatio="none"
                      >
                        {detectionResults.objects.map((obj, i) => {
                          const [ymin, xmin, ymax, xmax] = obj.box_2d;
                          const width = xmax - xmin;
                          const height = ymax - ymin;
                          const color = boxColors[i % boxColors.length];
                          const isHovered = hoveredBoxIndex === i;

                          return (
                            <g key={i} className="transition-all duration-150">
                              <rect
                                x={xmin}
                                y={ymin}
                                width={width}
                                height={height}
                                fill={isHovered ? color.stroke + "40" : color.fill}
                                stroke={color.stroke}
                                strokeWidth={isHovered ? 4 : 2.5}
                                strokeDasharray={isHovered ? "none" : "none"}
                                rx={4}
                              />
                              {/* Label Badge */}
                              <rect
                                x={xmin}
                                y={Math.max(0, ymin - 24)}
                                width={Math.max(80, obj.label.length * 8 + 36)}
                                height={22}
                                fill={color.stroke}
                                rx={3}
                              />
                              <text
                                x={xmin + 6}
                                y={Math.max(16, ymin - 8)}
                                fill="#0f172a"
                                fontSize={12}
                                fontWeight="bold"
                                fontFamily="sans-serif"
                              >
                                {obj.label} {Math.round(obj.confidence * 100)}%
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Dropzone Placeholder */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition group bg-slate-950/40"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-300 flex items-center justify-center transition mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  Drop image, audio, or document here
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Supports PNG, JPEG, WebP, PDF, CSV, MP3, WAV
                </span>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,audio/*,.pdf,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Capture Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                Browse File
              </button>
              <button
                onClick={startWebcam}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                Webcam Capture
              </button>
            </div>

            {/* Custom Instruction with Prompt Optimizer */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-slate-400">
                  Custom Extraction Prompt (Optional)
                </label>
                <button
                  onClick={handleOptimizePrompt}
                  disabled={!customPrompt.trim() || isOptimizingPrompt}
                  className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 disabled:opacity-40"
                  title="Enhance prompt via Gemini Prompt Optimizer"
                >
                  <Sparkles className={`w-3 h-3 ${isOptimizingPrompt ? "animate-spin" : ""}`} />
                  {isOptimizingPrompt ? "Optimizing..." : "Optimize Prompt"}
                </button>
              </div>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Focus on product pricing, nutritional facts, or car license plates..."
                className="w-full h-16 p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60 resize-none"
              />
            </div>

            {/* Execute Button */}
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing || !mediaPreview}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
              {isAnalyzing ? "Processing through Gemini Vision Matrix..." : "Execute 1-Click Analysis"}
            </button>
          </div>
        </div>

        {/* Right Col: Deep Analysis Viewport (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[480px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Live Analysis Results
              </span>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const data = detectionResults || ocrResults || videoResults || audioResults;
                    if (data) downloadJson(data, activeMode);
                  }}
                  disabled={!detectionResults && !ocrResults && !videoResults && !audioResults}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[11px] text-slate-300 flex items-center gap-1 transition"
                  title="Download JSON Export"
                >
                  <Download className="w-3 h-3" /> JSON
                </button>
                <button
                  onClick={() => {
                    const data = detectionResults || ocrResults || videoResults || audioResults;
                    if (data) copyToClipboard(JSON.stringify(data, null, 2));
                  }}
                  disabled={!detectionResults && !ocrResults && !videoResults && !audioResults}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[11px] text-slate-300 flex items-center gap-1 transition"
                  title="Copy Results"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Analysis Content Based on Active Mode */}
            <div className="flex-1 py-4">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3 py-16">
                  <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                  <span className="text-xs font-medium text-slate-400">
                    Running multimodal tensor extraction...
                  </span>
                </div>
              ) : activeMode === "detection" && detectionResults ? (
                /* Object Detection Breakdown */
                <div className="space-y-4">
                  {detectionResults.summary && (
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                      <span className="font-semibold text-cyan-400 block mb-1">Visual Overview:</span>
                      {detectionResults.summary}
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Detected Entities ({detectionResults.objects.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {detectionResults.objects.map((obj, i) => {
                        const color = boxColors[i % boxColors.length];
                        const isHovered = hoveredBoxIndex === i;

                        return (
                          <div
                            key={i}
                            onMouseEnter={() => setHoveredBoxIndex(i)}
                            onMouseLeave={() => setHoveredBoxIndex(null)}
                            className={`p-2.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-between ${
                              isHovered
                                ? "bg-slate-800 border-cyan-400 shadow-md"
                                : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: color.stroke }}
                              />
                              <span className="font-semibold text-slate-200 capitalize">
                                {obj.label}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                              {Math.round(obj.confidence * 100)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : activeMode === "ocr" && ocrResults ? (
                /* OCR & Document Breakdown */
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-indigo-400 text-sm block mb-1">
                      {ocrResults.title}
                    </span>
                    <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-mono bg-slate-900/60 p-3 rounded border border-slate-800 max-h-60 overflow-y-auto">
                      {ocrResults.fullText}
                    </div>
                  </div>

                  {ocrResults.entities && (
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(ocrResults.entities).map(([key, val]: [string, any]) => (
                        <div key={key} className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                          <span className="font-semibold text-slate-400 uppercase text-[10px] block mb-1">
                            {key}
                          </span>
                          <span className="text-slate-200">
                            {Array.isArray(val) ? val.join(", ") || "None detected" : String(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : activeMode === "video_summary" && videoResults ? (
                /* Video Action Timeline Breakdown */
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-amber-400 text-sm block mb-1">
                      Scene Narrative Summary
                    </span>
                    <p className="text-slate-300">{videoResults.summary}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-semibold text-slate-400">Chronological Action Timeline:</span>
                    <div className="space-y-2">
                      {videoResults.timeline?.map((step, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-start gap-3">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold shrink-0">
                            {step.time}
                          </span>
                          <div>
                            <span className="text-slate-200 block">{step.action}</span>
                            {step.subjects && (
                              <span className="text-[10px] text-slate-500 mt-0.5 block">
                                Subjects: {step.subjects.join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeMode === "audio_transcription" && audioResults ? (
                /* Audio Diarization Breakdown */
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-purple-400 text-sm block">
                        Spoken Discussion Summary
                      </span>
                      <p className="text-slate-300 mt-1">{audioResults.summary}</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase">
                      Lang: {audioResults.language}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="font-semibold text-slate-400">Speaker Dialogue:</span>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {audioResults.segments?.map((seg, idx) => (
                        <div key={idx} className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-cyan-300">{seg.speaker}</span>
                            <span className="font-mono text-slate-500">{seg.time}</span>
                          </div>
                          <p className="text-slate-200 font-serif italic text-sm">"{seg.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty state guide */
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300">Ready for Multimodal Input</h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                      Upload an image, audio clip, or webcam capture on the left and select an analysis mode to run real server-side Gemini intelligence.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
