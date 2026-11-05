// ============================================================================
// SARVAGYA AI — MEDIA SUITE (IMAGE, GALLERY, VIDEO & AUDIO WAVEFORM)
// Universal high-fidelity media presentation components with clean dark aesthetic
// ============================================================================

import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  Video,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
} from "lucide-react";

// --- 1. Dedicated Image Viewer ---
export interface ImageViewerProps {
  src: string;
  alt?: string;
  title?: string;
  prompt?: string;
  aspectRatio?: string;
  modelUsed?: string;
  sources?: Array<{ title: string; uri: string }>;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt = "Synthesized Visual",
  title,
  prompt,
  aspectRatio,
  modelUsed,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full border border-slate-800 bg-[#060810] text-slate-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 p-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center bg-purple-950/60 border border-purple-500/40 text-purple-400">
            <Image className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-100">
              {title || "Visual Synthesis Asset"}
            </h4>
            <div className="text-[10px] font-mono text-slate-500">
              {modelUsed || "Neural Image Generation Engine"} {aspectRatio && `• ${aspectRatio}`}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {prompt && (
            <button
              onClick={handleCopyPrompt}
              className="flex items-center space-x-1 border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Copied" : "Prompt"}</span>
            </button>
          )}
          <a
            href={src}
            download="sarvagya-visual.png"
            className="flex items-center space-x-1 border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white"
          >
            <Download className="h-3 w-3" />
            <span>Save</span>
          </a>
        </div>
      </div>

      {/* Image Preview */}
      <div className="relative flex items-center justify-center p-4 bg-black/40 min-h-[300px]">
        <img
          src={src}
          alt={alt}
          className="max-h-[500px] w-auto max-w-full object-contain border border-slate-800 shadow-2xl"
        />
      </div>

      {/* Prompt Footer */}
      {prompt && (
        <div className="border-t border-slate-800 p-3 font-mono text-xs bg-slate-950/40">
          <span className="text-slate-500 uppercase text-[10px] mr-2">PROMPT:</span>
          <span className="text-slate-300">{prompt}</span>
        </div>
      )}
    </div>
  );
};

// --- 2. Image Gallery ---
export interface ImageGalleryItem {
  id: string;
  src: string;
  title: string;
  category?: string;
  prompt?: string;
}

export interface ImageGalleryProps {
  items: ImageGalleryItem[];
  title?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  items,
  title = "Synthesized Visual Gallery",
}) => {
  const [selectedItem, setSelectedItem] = useState<ImageGalleryItem>(items[0]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["all", ...Array.from(set)];
  }, [items]);

  const filteredItems = React.useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full border border-slate-800 bg-[#060810] text-slate-200">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 p-3 gap-2">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-purple-400" />
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-100">
            {title} ({items.length})
          </h4>
        </div>

        {/* Filter categories */}
        {categories.length > 2 && (
          <div className="flex items-center space-x-1 font-mono text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 border uppercase text-[10px] ${
                  activeCategory === cat
                    ? "border-purple-500 bg-purple-950/40 text-purple-300 font-bold"
                    : "border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Preview */}
      {selectedItem && (
        <div className="border-b border-slate-800 p-4 bg-black/60 flex flex-col items-center">
          <img
            src={selectedItem.src}
            alt={selectedItem.title}
            className="max-h-[380px] w-auto max-w-full object-contain border border-slate-800"
          />
          <div className="mt-2 text-center">
            <div className="font-mono text-xs font-bold text-slate-200">{selectedItem.title}</div>
            {selectedItem.prompt && (
              <div className="font-mono text-[10px] text-slate-400 max-w-xl truncate mt-0.5">
                {selectedItem.prompt}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thumbnails */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-3">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className={`relative aspect-square border overflow-hidden transition-all ${
              selectedItem?.id === item.id
                ? "border-purple-500 ring-2 ring-purple-500/30"
                : "border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100"
            }`}
          >
            <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- 3. Dedicated Video Player ---
export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  duration?: string;
  aspectRatio?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title = "Synthesized Video Clip",
  duration = "0:05",
  aspectRatio = "16:9",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full border border-slate-800 bg-[#060810] text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 p-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Video className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-100">
              {title}
            </h4>
            <div className="text-[10px] font-mono text-slate-500">
              Omni Video Synthesis Engine • {aspectRatio}
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-black flex items-center justify-center overflow-hidden">
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            loop
            className="w-full max-h-[460px] object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <div className="w-full aspect-video flex flex-col items-center justify-center p-8 bg-slate-950/60">
            {poster ? (
              <img src={poster} alt="Poster" className="max-h-[300px] object-contain mb-3" />
            ) : (
              <Video className="h-12 w-12 text-slate-600 mb-3" />
            )}
            <span className="font-mono text-xs text-slate-400">Video Synthesis Stream Active</span>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between border-t border-slate-800 p-3 font-mono text-xs">
        <button
          onClick={togglePlay}
          className="flex items-center space-x-1.5 border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-300 hover:text-white"
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
        </button>

        <span className="text-[11px] text-slate-500">{duration}</span>
      </div>
    </div>
  );
};

// --- 4. Audio Player with Animated Procedural Waveform ---
export interface AudioPlayerProps {
  src?: string;
  title?: string;
  subtitle?: string;
  bpm?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = "Lyria Neural Audio Synthesis",
  subtitle = "Dynamic Harmonic Acoustic Track",
  bpm = 120,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current && src) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // Toggle waveform simulation
      setIsPlaying(!isPlaying);
    }
  };

  // Animated Waveform loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const renderWave = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "#05070d";
      ctx.fillRect(0, 0, w, h);

      const bars = 48;
      const barWidth = w / bars - 2;

      for (let i = 0; i < bars; i++) {
        let barHeight = 8;
        if (isPlaying) {
          phase += 0.002;
          const sinVal = Math.sin(phase * 4 + i * 0.3);
          const cosVal = Math.cos(phase * 2 + i * 0.5);
          barHeight = 10 + Math.abs(sinVal * cosVal) * (h * 0.7);
        } else {
          barHeight = 6 + Math.sin(i * 0.2) * 6;
        }

        const x = i * (barWidth + 2);
        const y = (h - barHeight) / 2;

        ctx.fillStyle = isPlaying
          ? i % 2 === 0
            ? "#38bdf8"
            : "#818cf8"
          : "#334155";
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animId = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <div className="w-full border border-slate-800 bg-[#060810] text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 p-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center bg-indigo-950/60 border border-indigo-500/40 text-indigo-400">
            <Music className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-100">
              {title}
            </h4>
            <div className="text-[10px] font-mono text-slate-500">
              {subtitle} • {bpm} BPM
            </div>
          </div>
        </div>

        {src && <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />}

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:text-white"
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Waveform Canvas */}
      <div className="p-4 bg-black/60 border-b border-slate-800 flex items-center justify-center">
        <canvas ref={canvasRef} width={500} height={90} className="w-full max-w-xl h-[80px]" />
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between p-3 font-mono text-xs">
        <button
          onClick={togglePlay}
          className="flex items-center space-x-1.5 border border-indigo-500/50 bg-indigo-950/30 px-3 py-1.5 text-indigo-300 hover:text-white"
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span>{isPlaying ? "PAUSE AUDIO" : "SYNTHESIZE / PLAY"}</span>
        </button>

        <span className="text-[11px] text-slate-500">PROCEEDING REAL AUDIO SYNTHESIS</span>
      </div>
    </div>
  );
};
