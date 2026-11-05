import React, { useState } from "react";
import {
  Volume2,
  Languages,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Globe,
  Radio,
  FileText,
  AlertCircle,
} from "lucide-react";

export const SpeechTranslateStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tts" | "translate">("tts");

  // TTS State
  const [ttsText, setTtsText] = useState<string>(
    "Welcome to SARVAGYA AI, the universal multimodal super-intelligence. All systems are operational with real server-side grounding."
  );
  const [selectedVoice, setSelectedVoice] = useState<string>("Kore");
  const [ttsStyle, setTtsStyle] = useState<string>("Clear, articulate AI companion");
  const [isSynthesizingTts, setIsSynthesizingTts] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Translation State
  const [sourceText, setSourceText] = useState<string>(
    "Knowledge is of no value unless you put it into practice. Through innovation, India leads the global frontier in super-intelligence."
  );
  const [targetLang, setTargetLang] = useState<string>("Hindi");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translatedResult, setTranslatedResult] = useState<{
    translatedText: string;
    phoneticPronunciation?: string;
    culturalNuanceNotes?: string;
    detectedLanguage?: string;
  } | null>(null);

  const [copied, setCopied] = useState<boolean>(false);

  const voices = [
    { id: "Kore", label: "Kore", desc: "Warm, balanced, executive persona" },
    { id: "Fenrir", label: "Fenrir", desc: "Authoritative, resonant baritone" },
    { id: "Puck", label: "Puck", desc: "Enthusiastic, energetic, bright tone" },
    { id: "Aoede", label: "Aoede", desc: "Articulate, expressive, melodic" },
    { id: "Charon", label: "Charon", desc: "Calm, analytical, measured speech" },
  ];

  const popularLanguages = [
    "Hindi",
    "Sanskrit",
    "Spanish",
    "Japanese",
    "French",
    "German",
    "Russian",
    "Arabic",
    "Mandarin Chinese",
    "Bengali",
    "Tamil",
    "Telugu",
  ];

  const handleSynthesizeTts = async () => {
    if (!ttsText.trim()) return;
    setIsSynthesizingTts(true);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: ttsText,
          voice: selectedVoice,
          style: ttsStyle,
        }),
      });

      const data = await res.json();
      if (data.audioBase64) {
        const audioSrc = `data:${data.mimeType || "audio/wav"};base64,${data.audioBase64}`;
        setAudioUrl(audioSrc);
      } else {
        // Fallback to Web Speech API
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(ttsText);
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (err: any) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(ttsText);
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsSynthesizingTts(false);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);

    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          targetLanguage: targetLang,
        }),
      });

      const data = await res.json();
      if (data.translatedText) {
        setTranslatedResult(data);
      }
    } catch (err: any) {
      console.warn("Translation notice:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Volume2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 bg-clip-text text-transparent">
              Speech Synthesis & Multilingual Translator Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gemini Neural Text-to-Speech • WAV Audio Download • 70+ Language Cultural Nuance Translation
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab("tts")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
              activeTab === "tts"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Text-to-Speech (TTS)
          </button>
          <button
            onClick={() => setActiveTab("translate")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
              activeTab === "translate"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            Neural Translator
          </button>
        </div>
      </div>

      {activeTab === "tts" ? (
        /* Text-to-Speech Studio View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls & Voice Selection (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                Select Voice Persona
              </span>

              <div className="grid grid-cols-1 gap-2">
                {voices.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                      selectedVoice === v.id
                        ? "bg-purple-950/40 border-purple-500/60 text-purple-200 shadow-sm"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{v.label}</span>
                      {selectedVoice === v.id && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">{v.desc}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-[11px] font-medium text-slate-400">
                  Voice Delivery Style:
                </label>
                <input
                  type="text"
                  value={ttsStyle}
                  onChange={(e) => setTtsStyle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500/60"
                  placeholder="e.g. Energetic podcast host, calm meditation guide..."
                />
              </div>

              <button
                onClick={handleSynthesizeTts}
                disabled={isSynthesizingTts || !ttsText.trim()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isSynthesizingTts ? "animate-spin" : ""}`} />
                {isSynthesizingTts ? "Synthesizing Speech..." : "Generate Spoken Audio"}
              </button>
            </div>
          </div>

          {/* Script Editor & Audio Player (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                Script / Content to Speak
              </span>

              <textarea
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                rows={6}
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500/60 leading-relaxed resize-none"
                placeholder="Enter text to turn into expressive speech..."
              />

              {/* Spoken Audio Deliverable Player */}
              {audioUrl ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                      Synthesized Audio ({selectedVoice})
                    </span>
                    <a
                      href={audioUrl}
                      download={`sarvagya_speech_${selectedVoice}_${Date.now()}.wav`}
                      className="px-2.5 py-1 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800/60 text-xs font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Download WAV
                    </a>
                  </div>

                  <audio src={audioUrl} controls autoPlay className="w-full" />
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center text-xs text-slate-500 space-y-1">
                  <span>No audio generated yet. Click "Generate Spoken Audio" to render speech.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 70+ Multilingual Neural Translator View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Source Text (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Source Text (Auto-Detect)
              </span>

              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60 leading-relaxed resize-none"
                placeholder="Enter text in any language..."
              />

              {/* Target Language Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-slate-400">Target Language:</span>
                <div className="flex flex-wrap gap-1.5">
                  {popularLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setTargetLang(lang)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                        targetLang === lang
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50"
                          : "bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleTranslate}
                disabled={isTranslating || !sourceText.trim()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition"
              >
                <Languages className={`w-3.5 h-3.5 ${isTranslating ? "animate-spin" : ""}`} />
                {isTranslating ? "Translating with Nuance..." : `Translate to ${targetLang}`}
              </button>
            </div>
          </div>

          {/* Translation Result & Nuance (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[360px] flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-cyan-400" />
                  Neural Translation ({targetLang})
                </span>

                {translatedResult?.translatedText && (
                  <button
                    onClick={() => copyText(translatedResult.translatedText)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>

              {isTranslating ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-16">
                  <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
                  <span className="text-xs text-slate-400">Processing linguistic nuance...</span>
                </div>
              ) : translatedResult ? (
                <div className="space-y-4 text-xs">
                  {/* Translated Text Block */}
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <p className="text-sm font-medium text-slate-100 leading-relaxed font-sans">
                      {translatedResult.translatedText}
                    </p>
                  </div>

                  {/* Phonetic Pronunciation */}
                  {translatedResult.phoneticPronunciation && (
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                        Phonetic Pronunciation Guide
                      </span>
                      <p className="text-slate-300 font-mono italic">
                        {translatedResult.phoneticPronunciation}
                      </p>
                    </div>
                  )}

                  {/* Cultural Nuance Notes */}
                  {translatedResult.culturalNuanceNotes && (
                    <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40">
                      <span className="text-[10px] uppercase font-bold text-indigo-300 block mb-1">
                        Cultural Context & Linguistic Nuance
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {translatedResult.culturalNuanceNotes}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-1">
                  <Globe className="w-8 h-8 text-slate-700" />
                  <span className="text-xs">Translation output will appear here.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
