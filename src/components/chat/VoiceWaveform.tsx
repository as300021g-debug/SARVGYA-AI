import React, { useEffect, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface VoiceWaveformProps {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListen: () => void;
  onStopSpeaking: () => void;
  lang?: string;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isListening,
  isSpeaking,
  onToggleListen,
  onStopSpeaking,
  lang = "en-US",
}) => {
  const [bars, setBars] = useState<number[]>([12, 24, 38, 54, 42, 28, 16]);

  useEffect(() => {
    if (!isListening && !isSpeaking) return;

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => Math.floor(Math.random() * (isSpeaking ? 50 : 40)) + 8)
      );
    }, 90);

    return () => clearInterval(interval);
  }, [isListening, isSpeaking]);

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-lg backdrop-blur-md">
      {/* Animated bars */}
      <div className="flex items-center gap-1 h-6 px-1">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-100 ${
              isSpeaking
                ? "bg-gradient-to-t from-emerald-500 to-teal-300 shadow-[0_0_8px_rgba(20,184,166,0.5)]"
                : isListening
                ? "bg-gradient-to-t from-blue-500 to-purple-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                : "bg-slate-600"
            }`}
            style={{
              height: `${isListening || isSpeaking ? height : 6}px`,
            }}
          />
        ))}
      </div>

      {/* Status label */}
      <span className="text-xs font-medium text-slate-300">
        {isSpeaking
          ? "Speaking response aloud..."
          : isListening
          ? "Listening (English / Hindi)..."
          : "Voice Assistant"}
      </span>

      {/* Action button */}
      {isSpeaking ? (
        <button
          type="button"
          onClick={onStopSpeaking}
          className="p-1 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition text-xs flex items-center gap-1 px-2"
          title="Stop reading aloud"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Stop</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onToggleListen}
          className={`p-1.5 rounded-full transition ${
            isListening
              ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30"
              : "bg-slate-800 text-slate-300 hover:text-white"
          }`}
          title={isListening ? "Stop listening" : "Start speaking"}
        >
          {isListening ? (
            <MicOff className="w-3.5 h-3.5" />
          ) : (
            <Mic className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </div>
  );
};
