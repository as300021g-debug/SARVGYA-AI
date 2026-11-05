import React, { useState } from "react";
import {
  Share2,
  Copy,
  CheckCircle2,
  Download,
  ExternalLink,
  ShieldAlert,
  Globe,
  Sparkles,
  FileCode,
  Layers,
  X,
  AlertTriangle,
  FolderArchive,
  Check,
} from "lucide-react";

interface FreePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreePublishModal: React.FC<FreePublishModalProps> = ({ isOpen, onClose }) => {
  const publishedUrl = "https://sarvagya-ai-2-550183508006.asia-southeast1.run.app";
  const sharedUrl = "https://ais-pre-hhrhiyv2nqsguvdfyejhei-758083307178.asia-southeast1.run.app";
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                  Publish SARVAGYA AI — 100% Free
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
                  Zero Cost • No Credit Card
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Created by Aryan Sharma • Made in India
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CRITICAL BILLING WARNING EXPLANATION */}
        <div className="my-3.5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Did you see: &quot;Step 1: Confirm project and billing - No billing setup&quot;?</span>
          </div>
          <p className="text-[11px] text-red-200/90 leading-relaxed">
            <strong className="text-white uppercase">DO NOT WORRY! DO NOT PAY! DO NOT ADD A CREDIT CARD!</strong>
          </p>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            That AI Studio popup appears because clicking the AI Studio top toolbar &quot;Publish&quot; button tries to create a paid Google Cloud Run container in your GCP account. <strong className="text-emerald-300">Close or Cancel that popup!</strong> Your app is ALREADY live for free via Google without needing any billing account, or you can host it free forever on GitHub Pages.
          </p>
        </div>

        {/* Free Publishing Options */}
        <div className="space-y-3.5 text-xs">
          {/* Option 1: Direct Live Links */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-sky-500/40 shadow-inner space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-300 text-xs sm:text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-400" />
                Option 1: Your App is ALREADY LIVE &amp; Published (Zero Cost)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                100% Free
              </span>
            </div>
            
            {/* Published Production URL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-200">Production Published URL:</span>
                <span className="text-[10px] text-emerald-400 font-mono">Cloud Run • 24/7 Active</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <input
                  type="text"
                  readOnly
                  value={publishedUrl}
                  className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-sky-300 font-mono text-[11px] select-all truncate"
                />
                <button
                  onClick={() => copyToClipboard(publishedUrl, "pub")}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  {copied === "pub" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === "pub" ? "Copied!" : "Copy Link"}</span>
                </button>
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center gap-1 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open</span>
                </a>
              </div>
            </div>

            {/* Shared Preview URL */}
            <div className="space-y-1 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-300">Shared Preview URL:</span>
                <span className="text-[10px] text-sky-400 font-mono">AI Studio CDN</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <input
                  type="text"
                  readOnly
                  value={sharedUrl}
                  className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 font-mono text-[11px] select-all truncate"
                />
                <button
                  onClick={() => copyToClipboard(sharedUrl, "shared")}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  {copied === "shared" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === "shared" ? "Copied!" : "Copy"}</span>
                </button>
                <a
                  href={sharedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center gap-1 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open</span>
                </a>
              </div>
            </div>
          </div>

          {/* Option 2: 1-Click GitHub Pages ZIP Package */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 text-xs sm:text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                Option 2: Deploy Free Forever on GitHub Pages (Zero Billing)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                100% Free
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Want your own permanent URL (like <code className="text-emerald-300">username.github.io/sarvagya-ai</code>) with zero credit cards?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-200">1. Download ZIP</span>
                <p className="text-slate-400 text-[10px]">Contains <code className="text-amber-300">index.html</code> ready to host.</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-200">2. Free GitHub Repo</span>
                <p className="text-slate-400 text-[10px]">Create repo on github.com &amp; upload <code className="text-amber-300">index.html</code>.</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-200">3. Turn on Pages</span>
                <p className="text-slate-400 text-[10px]">Settings &gt; Pages &gt; Branch: main ➔ Live in 30s!</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="/sarvagya_free_publish_package.zip"
                download="sarvagya_free_publish_package.zip"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>Download Free GitHub ZIP Package</span>
              </a>
              <a
                href="/sarvagya_master_complete.html"
                download="sarvagya_master_complete.html"
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Single HTML File (.html)</span>
              </a>
            </div>
          </div>

          {/* Option 3: Offline / Local Run */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Option 3: Run Directly on Your Phone or PC (No Server Needed)
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Just double-click the downloaded <code className="text-amber-300">index.html</code> file. It works completely inside your browser with microphone voice recognition, live stopwatch, and dual camera vision!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>SARVAGYA AI • Made in India • Aryan Sharma</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
