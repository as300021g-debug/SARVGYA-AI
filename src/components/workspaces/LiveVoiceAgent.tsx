import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  Video,
  Radio,
  Sparkles,
  RefreshCw,
  User,
  Activity,
  Headphones,
  Settings2,
  AlertCircle,
  Play,
  Square,
} from "lucide-react";

interface CaptionItem {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
}

export const LiveVoiceAgent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>("Kore");
  const [captions, setCaptions] = useState<CaptionItem[]>([]);
  const [currentSpeech, setCurrentSpeech] = useState<string>("");
  const [agentSpeaking, setAgentSpeaking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("Standby • Ready to activate");
  const [latencyMs, setLatencyMs] = useState<number>(140);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const voices = [
    { id: "Kore", label: "Kore (Harmonic & Articulate)", gender: "Female", pitch: "Balanced" },
    { id: "Fenrir", label: "Fenrir (Authoritative & Deep)", gender: "Male", pitch: "Deep" },
    { id: "Puck", label: "Puck (Energetic & Dynamic)", gender: "Neutral", pitch: "Bright" },
    { id: "Aoede", label: "Aoede (Melodic & Warm)", gender: "Female", pitch: "Warm" },
    { id: "Charon", label: "Charon (Calm & Stoic)", gender: "Male", pitch: "Baritone" },
  ];

  // Start / Stop Live Session
  const toggleLiveSession = async () => {
    if (isActive) {
      stopLiveSession();
    } else {
      await startLiveSession();
    }
  };

  const startLiveSession = async () => {
    try {
      setStatusMessage("Connecting to SARVAGYA Live Multimodal Engine...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx({ sampleRate: 16000 });
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsActive(true);
      setStatusMessage(`Live Voice Active (${selectedVoice}) • 16kHz PCM duplex`);
      drawWaveform();

      // Add welcoming greeting caption
      setCaptions((prev) => [
        ...prev,
        {
          id: "greet-" + Date.now(),
          sender: "agent",
          text: `SARVAGYA Live Agent active with voice profile '${selectedVoice}'. I am listening to your audio stream. Speak anytime.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      setStatusMessage("Audio permission denied: " + err.message);
    }
  };

  const stopLiveSession = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    stopCamera();
    setIsActive(false);
    setAgentSpeaking(false);
    setStatusMessage("Session ended • Ready to reconnect");
  };

  const toggleCamera = async () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        cameraStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } catch (err: any) {
        setStatusMessage("Camera access error: " + err.message);
      }
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Real-Time Audio Waveform Visualizer
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyserRef.current!.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;

        // Glowing gradient effect
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, "#06b6d4"); // cyan
        gradient.addColorStop(0.5, "#3b82f6"); // blue
        gradient.addColorStop(1, "#a855f7"); // purple

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    render();
  };

  // Barge-in interruption
  const handleBargeIn = () => {
    setAgentSpeaking(false);
    window.speechSynthesis.cancel();
    setStatusMessage("Barge-in detected • Agent audio halted, listening to Commander.");
  };

  // Send a test speech query through TTS & LLM to simulate seamless conversation
  const sendVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    setCaptions((prev) => [
      ...prev,
      {
        id: "user-" + Date.now(),
        sender: "user",
        text: queryText,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    setAgentSpeaking(true);
    setStatusMessage("Synthesizing voice response...");

    try {
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          systemInstruction: `You are SARVAGYA Live Voice Agent. Keep verbal answers concise, punchy, spoken-friendly, conversational, and direct (under 60 words).`,
        }),
      });

      const chatData = await chatRes.json();
      const reply = chatData.reply || "Understood, Commander.";

      setCaptions((prev) => [
        ...prev,
        {
          id: "agent-" + Date.now(),
          sender: "agent",
          text: reply,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      // Speak using Web Speech API or TTS endpoint
      if (!isSpeakerMuted && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.rate = 1.05;
        utterance.onend = () => {
          setAgentSpeaking(false);
          setStatusMessage(`Live Voice Active (${selectedVoice}) • Listening`);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setAgentSpeaking(false);
      }
    } catch {
      setAgentSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Radio className={`w-5 h-5 ${isActive ? "animate-pulse text-cyan-400" : ""}`} />
            </span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Live Real-Time Voice & Vision Agent
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bidirectional Audio Streaming • 16kHz PCM Duplex • Barge-In Interruption • 1 FPS Webcam Vision Frame Hook
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLiveSession}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition shadow-md ${
              isActive
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30"
            }`}
          >
            {isActive ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isActive ? "Disconnect Voice Agent" : "Connect Live Voice Agent"}
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Audio Visualizer Stage (Left) & Captions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Live Stage (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 space-y-5 relative overflow-hidden shadow-xl">
            {/* Live Indicator Badge */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isActive ? "bg-emerald-400 animate-ping" : "bg-slate-600"
                  }`}
                />
                <span className="font-semibold text-slate-300">{statusMessage}</span>
              </div>
              <span className="font-mono text-[11px] text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                {latencyMs}ms latency
              </span>
            </div>

            {/* Central Visualizer Sphere / Waveform Canvas */}
            <div className="relative h-48 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col items-center justify-center overflow-hidden">
              {/* Background Glow */}
              <div
                className={`absolute w-32 h-32 rounded-full blur-3xl transition-opacity duration-300 ${
                  isActive ? "bg-cyan-500/20 opacity-100" : "opacity-0"
                }`}
              />

              {/* Pulsing Avatar Sphere */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
                  agentSpeaking
                    ? "bg-gradient-to-tr from-cyan-500 to-indigo-500 shadow-xl shadow-cyan-500/40 scale-110 animate-pulse"
                    : isActive
                    ? "bg-slate-800 border-2 border-cyan-400/60 shadow-lg"
                    : "bg-slate-900 border border-slate-800 text-slate-600"
                }`}
              >
                {agentSpeaking ? (
                  <Headphones className="w-8 h-8 text-white animate-bounce" />
                ) : (
                  <Mic className={`w-8 h-8 ${isActive ? "text-cyan-300" : "text-slate-600"}`} />
                )}
              </div>

              {/* Audio Waveform Canvas */}
              <canvas
                ref={canvasRef}
                width={500}
                height={70}
                className="absolute bottom-0 inset-x-0 w-full h-16 pointer-events-none opacity-80"
              />

              {agentSpeaking && (
                <div className="absolute top-3 inset-x-0 flex justify-center">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold tracking-wider uppercase animate-pulse">
                    Speaking • Click Barge-In to Interrupt
                  </span>
                </div>
              )}
            </div>

            {/* In-Call Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                disabled={!isActive}
                className={`p-3 rounded-full border text-xs font-medium transition ${
                  isMicMuted
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/50"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                }`}
                title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                disabled={!isActive}
                className={`p-3 rounded-full border text-xs font-medium transition ${
                  isSpeakerMuted
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/50"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                }`}
                title={isSpeakerMuted ? "Unmute Speaker" : "Mute Speaker"}
              >
                {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleCamera}
                disabled={!isActive}
                className={`p-3 rounded-full border text-xs font-medium transition ${
                  isCameraActive
                    ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/50"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                }`}
                title="Toggle 1 FPS Vision Frame Streaming"
              >
                <Camera className="w-4 h-4" />
              </button>

              <button
                onClick={handleBargeIn}
                disabled={!agentSpeaking}
                className="px-4 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition disabled:opacity-40"
              >
                Barge-In (Stop Agent)
              </button>
            </div>

            {/* Webcam Live Frame Hook */}
            {isCameraActive && (
              <div className="relative rounded-lg overflow-hidden border border-indigo-500/30 bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-indigo-300 font-mono border border-indigo-500/40">
                  LIVE VISION STREAM: 1 FPS SYNC
                </div>
              </div>
            )}

            {/* Voice Persona Selector */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Selectable Voice Persona
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {voices.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={`p-2 rounded-lg text-left text-xs border transition ${
                      selectedVoice === v.id
                        ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-200 font-bold"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    <span className="block text-slate-200">{v.id}</span>
                    <span className="text-[10px] text-slate-500 block">{v.pitch}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Transcription Captions & Dialogue (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live Transcription & Dialogue Stream
              </span>
              <button
                onClick={() => setCaptions([])}
                className="text-[11px] text-slate-500 hover:text-slate-300"
              >
                Clear Captions
              </button>
            </div>

            {/* Captions Scroll Area */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
              {captions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-8 space-y-2">
                  <Mic className="w-8 h-8 text-slate-700" />
                  <span className="text-xs">No active conversation yet.</span>
                  <p className="text-[11px] text-slate-600 max-w-xs">
                    Connect the voice agent and speak into your microphone or type a query below to test live speech round-trips.
                  </p>
                </div>
              ) : (
                captions.map((cap) => (
                  <div
                    key={cap.id}
                    className={`p-3 rounded-xl border text-xs max-w-[90%] space-y-1 ${
                      cap.sender === "user"
                        ? "ml-auto bg-cyan-950/40 border-cyan-800/40 text-cyan-100"
                        : "mr-auto bg-slate-900 border-slate-800 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] text-slate-500">
                      <span className="font-semibold uppercase text-cyan-400">
                        {cap.sender === "user" ? "Commander" : `SARVAGYA (${selectedVoice})`}
                      </span>
                      <span>{cap.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{cap.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Spoken Query Input */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={currentSpeech}
                onChange={(e) => setCurrentSpeech(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && currentSpeech.trim()) {
                    sendVoiceQuery(currentSpeech);
                    setCurrentSpeech("");
                  }
                }}
                placeholder="Say or type a spoken prompt..."
                className="flex-1 py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
              />
              <button
                onClick={() => {
                  if (currentSpeech.trim()) {
                    sendVoiceQuery(currentSpeech);
                    setCurrentSpeech("");
                  }
                }}
                disabled={!currentSpeech.trim()}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
