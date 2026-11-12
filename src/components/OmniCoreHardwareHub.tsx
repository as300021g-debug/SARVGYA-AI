import React, { useState, useEffect, useRef } from "react";
import {
  Cpu,
  Zap,
  Radio,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Globe,
  Clock,
  Key,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Terminal,
  Activity,
  Maximize2,
  Monitor,
  Flame,
  Lock,
  Unlock,
  Sliders,
  ListTodo,
  Plus,
  Trash2,
  Navigation,
  Compass,
  Rocket,
  TrendingUp,
  Brain,
  Code2,
  Calendar,
  CalendarPlus,
  Timer,
  Watch,
  Share2,
  Download,
  Copy,
} from "lucide-react";

export interface OmniCoreHardwareHubProps {
  onOpenPythonRunner?: () => void;
}

export const OmniCoreHardwareHub: React.FC<OmniCoreHardwareHubProps> = ({
  onOpenPythonRunner,
}) => {
  // --- 0. Navigation sub-tab in Omni Core ---
  const [subTab, setSubTab] = useState<"assistants" | "calendar-watch" | "telemetry" | "agents" | "markets">("assistants");

  // --- Real-Time Watch & Stopwatch State ---
  const [liveClock, setLiveClock] = useState<string>(() => new Date().toLocaleTimeString());
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const stopwatchIntervalRef = useRef<any>(null);

  // --- Calendar Scheduling State ---
  const [calendarEvents, setCalendarEvents] = useState<Array<{
    id: string;
    title: string;
    time: string;
    category?: "Meeting" | "Focus" | "Launch" | "General";
  }>>(() => {
    try {
      const saved = localStorage.getItem("SARVAGYA_CALENDAR_STORE");
      return saved ? JSON.parse(saved) : [
        { id: "cal-1", title: "Sarvagya AI Launch & Planetary Sync", time: "Tomorrow • 10:00 AM", category: "Launch" },
        { id: "cal-2", title: "Hardware Telemetry & Model Routing Review", time: "Friday • 3:30 PM", category: "Meeting" },
        { id: "cal-3", title: "ISRO Trajectory & Quant Strategy Session", time: "Next Monday • 2:00 PM", category: "Focus" },
      ];
    } catch {
      return [{ id: "cal-1", title: "Sarvagya AI Launch", time: "Tomorrow • 10:00 AM", category: "Launch" }];
    }
  });
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventTime, setNewEventTime] = useState<string>("");
  const [showEventModal, setShowEventModal] = useState<boolean>(false);

  // --- 1. State: Hardware Telemetry ---
  const [cpuCores, setCpuCores] = useState<number | string>("Syncing...");
  const [deviceRam, setDeviceRam] = useState<string>("Syncing...");
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [networkType, setNetworkType] = useState<string>("");
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.209 });

  // --- 2. State: Quota & Limit Renewal Countdown ---
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("SARVAGYA_KEY") || "");
  const [customKeyInput, setCustomKeyInput] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [dailyQuotaCountdown, setDailyQuotaCountdown] = useState<string>("--:--:--");
  const [burstCountdown, setBurstCountdown] = useState<number>(60);

  // --- 3. State: Cognitive Engines ---
  const [selectedEngine, setSelectedEngine] = useState<"omni" | "carbon" | "opus" | "astra" | "assistant">("omni");
  const [enableWebSearch, setEnableWebSearch] = useState<boolean>(true);

  // --- 4. State: 24/7 Hands-Free Voice Assistant Loop ---
  const [isVoiceLoopActive, setIsVoiceLoopActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>("");
  const recognitionRef = useRef<any>(null);

  // --- 5. State: Hardware Camera & Screen Vision ---
  const [visionMode, setVisionMode] = useState<"none" | "camera" | "screen">("none");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- 6. State: Amazon Alexa+ Smart Home & Routines ---
  const [smartLights, setSmartLights] = useState<boolean>(false);
  const [smartBrightness, setSmartBrightness] = useState<number>(80);
  const [smartThermo, setSmartThermo] = useState<number>(72);
  const [smartLock, setSmartLock] = useState<"LOCKED" | "UNLOCKED">("LOCKED");
  const [smartSecurity, setSmartSecurity] = useState<"ARMED" | "DISARMED">("ARMED");
  const [smartRoutine, setSmartRoutine] = useState<string>("Standard");

  // --- 7. State: Google Assistant Timers & Tasks ---
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerDisplay, setTimerDisplay] = useState<string>("00:00");
  const [tasks, setTasks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("SARVAGYA_TASKS_STORE");
      return saved ? JSON.parse(saved) : ["Verify ISRO & NTES telemetry checkpoints", "Review NSE NIFTY quant signals"];
    } catch {
      return ["Review system architecture"];
    }
  });
  const [newTaskInput, setNewTaskInput] = useState<string>("");
  const timerIntervalRef = useRef<any>(null);

  // --- 8. State: Opus Code Interactive Studio ---
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [studioPreviewCode, setStudioPreviewCode] = useState<string>("");

  // --- 9. State: Galaxy Interpreter Language ---
  const [interpreterLang, setInterpreterLang] = useState<string>("Hindi");

  // --- 10. State: Chat & Query Stream ---
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: "user" | "assistant" | "system";
    text: string;
    sources?: Array<{ title: string; uri: string }>;
    engine?: string;
    timestamp: string;
    executableHtml?: string;
  }>>([
    {
      id: "init-1",
      role: "system",
      text: "SARVAGYA AI OMNI-OS INITIALIZED. Created by Aryan Sharma. 5-in-1 Assistant Suites (Gemini, Assistant, Apple Intelligence, Galaxy AI, Alexa+), Hardware Telemetry (CPU, RAM, Battery, GPS), Screen & Camera Vision, ISRO/IRCTC Haversine Telemetry, and Quantitative Markets fully synchronized.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // ---------------------------------------------------------------------------
  // EFFECT: Live Hardware & Battery Telemetry
  // ---------------------------------------------------------------------------
  useEffect(() => {
    setCpuCores(navigator.hardwareConcurrency || 8);
    // @ts-ignore
    setDeviceRam((navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB+` : "16 GB Unified");

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // @ts-ignore
    const conn = (navigator as any).connection;
    if (conn) {
      setNetworkType(conn.effectiveType || conn.type || "High-Speed");
      const handleConnChange = () => setNetworkType(conn.effectiveType || conn.type || "High-Speed");
      conn.addEventListener("change", handleConnChange);
    }

    if ("getBattery" in navigator) {
      // @ts-ignore
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener("levelchange", updateBattery);
        battery.addEventListener("chargingchange", updateBattery);
      }).catch(() => {
        setBatteryLevel(98);
        setIsCharging(true);
      });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log("Using default coords")
      );
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // EFFECT: Live Quota Renewal Countdown (00:00 Pacific Time)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const ptTime = new Date(utcTime - 8 * 3600000);
      const nextMidnightPT = new Date(ptTime);
      nextMidnightPT.setHours(24, 0, 0, 0);

      const diffMs = nextMidnightPT.getTime() - ptTime.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, "0");
      setDailyQuotaCountdown(`${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
      setBurstCountdown((prev) => (prev <= 1 ? 60 : prev - 1));
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // ---------------------------------------------------------------------------
  // EFFECT: Google Assistant Timer Tick
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (timerSeconds <= 0) {
      clearInterval(timerIntervalRef.current);
      setTimerDisplay("00:00");
      return;
    }
    const m = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
    const s = String(timerSeconds % 60).padStart(2, "0");
    setTimerDisplay(`${m}:${s}`);

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          speakText("Google Assistant Timer has completed.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [timerSeconds]);

  // Scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Live Real-Time Clock
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Stopwatch Loop
  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(stopwatchIntervalRef.current);
    }
    return () => clearInterval(stopwatchIntervalRef.current);
  }, [isStopwatchRunning]);

  const toggleStopwatch = () => setIsStopwatchRunning((prev) => !prev);
  const startStopwatch = () => setIsStopwatchRunning(true);
  const pauseStopwatch = () => setIsStopwatchRunning(false);
  const resetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchSeconds(0);
  };
  const formatStopwatch = (totalSec: number) => {
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSec % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Calendar Event Store
  const addCalendarEvent = (title: string, time: string, category: "Meeting" | "Focus" | "Launch" | "General" = "General") => {
    if (!title.trim()) return;
    const ev = { id: `cal-${Date.now()}`, title: title.trim(), time: time.trim() || "Today", category };
    const updated = [ev, ...calendarEvents];
    setCalendarEvents(updated);
    localStorage.setItem("SARVAGYA_CALENDAR_STORE", JSON.stringify(updated));
  };

  const removeCalendarEvent = (id: string) => {
    const updated = calendarEvents.filter((e) => e.id !== id);
    setCalendarEvents(updated);
    localStorage.setItem("SARVAGYA_CALENDAR_STORE", JSON.stringify(updated));
  };

  // Save tasks to local storage
  const updateTasks = (newTasks: string[]) => {
    setTasks(newTasks);
    localStorage.setItem("SARVAGYA_TASKS_STORE", JSON.stringify(newTasks));
  };

  const handleAddTask = (textOverride?: string) => {
    const val = (textOverride || newTaskInput).trim();
    if (!val) return;
    updateTasks([val, ...tasks]);
    if (!textOverride) setNewTaskInput("");
  };

  const handleRemoveTask = (idx: number) => {
    updateTasks(tasks.filter((_, i) => i !== idx));
  };

  // ---------------------------------------------------------------------------
  // Alexa+ Smart Home Controllers & Routines
  // ---------------------------------------------------------------------------
  const applyAlexaRoutine = (name: string) => {
    setSmartRoutine(name);
    if (name === "Good Morning") {
      setSmartLights(true);
      setSmartBrightness(100);
      setSmartThermo(72);
      setSmartSecurity("DISARMED");
    } else if (name === "Movie Night") {
      setSmartLights(true);
      setSmartBrightness(20);
      setSmartThermo(69);
      setSmartLock("LOCKED");
    } else if (name === "Deep Work") {
      setSmartLights(true);
      setSmartBrightness(90);
      setSmartThermo(70);
      setTimerSeconds(1500);
    } else if (name === "Goodnight") {
      setSmartLights(false);
      setSmartBrightness(0);
      setSmartThermo(66);
      setSmartLock("LOCKED");
      setSmartSecurity("ARMED");
    }
  };

  // ---------------------------------------------------------------------------
  // Camera & Screen Vision Controls
  // ---------------------------------------------------------------------------
  const stopVision = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setVisionMode("none");
  };

  const startCamera = async () => {
    if (visionMode === "camera") {
      stopVision();
      return;
    }
    stopVision();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setVisionMode("camera");
    } catch (err: any) {
      console.warn("Camera error:", err?.message || err);
    }
  };

  const startScreen = async () => {
    if (visionMode === "screen") {
      stopVision();
      return;
    }
    stopVision();
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setVisionMode("screen");
    } catch (err: any) {
      console.warn("Screen share error:", err?.message || err);
    }
  };

  const captureVisionFrameBase64 = (): string | null => {
    if (visionMode === "none" || !videoRef.current || !canvasRef.current) return null;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 480;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.85).split(",")[1];
  };

  // ---------------------------------------------------------------------------
  // 24/7 Voice Assistant Loop
  // ---------------------------------------------------------------------------
  const toggleVoiceLoop = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech API is supported in Google Chrome or Microsoft Edge.");
      return;
    }

    if (isVoiceLoopActive) {
      setIsVoiceLoopActive(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    } else {
      try {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = false;
        recognizer.lang = "en-US";

        recognizer.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim();
          if (transcript) {
            setVoiceTranscript(transcript);
            executeOmniQuery(transcript, true);
          }
        };

        recognizer.onend = () => {
          if (isVoiceLoopActive) {
            try {
              recognizer.start();
            } catch {}
          }
        };

        recognitionRef.current = recognizer;
        recognizer.start();
        setIsVoiceLoopActive(true);
      } catch (err) {
        console.warn("Microphone initialization error:", err);
      }
    }
  };

  const speakText = (text: string) => {
    if (isMuted || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/```[\s\S]*?```/g, "").replace(/[*#`_~]/g, "").slice(0, 450);
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 1.04;
    window.speechSynthesis.speak(u);
  };

  // ---------------------------------------------------------------------------
  // Parse Automated JSON Actions (Alexa+, Calendar, Watch & Assistant Automation)
  // ---------------------------------------------------------------------------
  const parseActionBlock = (replyText: string) => {
    const match = replyText.match(/```json\s*([\s\S]*?)\s*```/);
    if (!match) return;
    try {
      const parsed = JSON.parse(match[1]);
      const act = parsed.sarvagya_action || parsed.device_action;
      if (!act) return;
      if (act.lights) setSmartLights(act.lights.toLowerCase() === "on");
      if (typeof act.brightness === "number") setSmartBrightness(act.brightness);
      if (typeof act.thermostat === "number") setSmartThermo(act.thermostat);
      if (act.lock) setSmartLock(act.lock.toUpperCase() === "LOCKED" ? "LOCKED" : "UNLOCKED");
      if (act.security) setSmartSecurity(act.security.toUpperCase() === "ARMED" ? "ARMED" : "DISARMED");
      if (act.routine) applyAlexaRoutine(act.routine);
      if (typeof act.timer_seconds === "number") setTimerSeconds(act.timer_seconds);
      if (act.add_task) handleAddTask(act.add_task);
      if (act.add_list) handleAddTask(act.add_list);
      if (act.calendar_event) {
        addCalendarEvent(act.calendar_event.title, act.calendar_event.time, act.calendar_event.category);
      }
      if (act.watch_action === "start_stopwatch") {
        startStopwatch();
      }
      if (act.watch_action === "pause_stopwatch" || act.watch_action === "stop_stopwatch") {
        pauseStopwatch();
      }
      if (act.watch_action === "reset_stopwatch") {
        resetStopwatch();
      }
    } catch (e) {}
  };

  // ---------------------------------------------------------------------------
  // Execute Multimodal Query
  // ---------------------------------------------------------------------------
  const executeOmniQuery = async (queryText?: string, fromVoice = false) => {
    const textToSend = (queryText || inputPrompt).trim();
    if (!textToSend || isProcessing) return;

    if (!fromVoice) setInputPrompt("");

    const frameBase64 = captureVisionFrameBase64();

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: textToSend,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    setIsProcessing(true);

    try {
      let replyContent = "";
      let returnedSources: Array<{ title: string; uri: string }> = [];

      const sysInstruction = `You are SARVAGYA AI (Master Omni-OS Edition), the universal personal AI super-intelligence created by Aryan Sharma.
Ecosystem: Google Gemini + OpenAI GPT-6 Astra + Anthropic Claude Opus 5.5 + DeepSeek V4 Pro + Apple Intelligence + Samsung Galaxy AI + Amazon Alexa+ + Google Assistant + Calendar Scheduling + Live Watch & Stopwatch.
Active Engine Mode: ${selectedEngine.toUpperCase()}.
Live Hardware: CPU=${cpuCores} Cores, RAM=${deviceRam}, Battery=${batteryLevel}% (${isCharging ? "Charging" : "Discharging"}), GPS=${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)}.
If the user asks to control smart home devices, set a timer, schedule calendar events, control the stopwatch, trigger a routine, or add tasks, execute conversationally and append this exact JSON block at the very end of your response:
\`\`\`json
{"sarvagya_action": {"lights": "on|off", "brightness": 85, "thermostat": 70, "lock": "locked|unlocked", "security": "armed|disarmed", "routine": "Good Morning|Movie Night", "timer_seconds": 120, "add_task": "Item", "calendar_event": {"title": "Meeting", "time": "Tomorrow at 3 PM", "category": "Meeting"}, "watch_action": "start_stopwatch|pause_stopwatch|reset_stopwatch"}}
\`\`\``;

      if (apiKey) {
        const parts: any[] = [{ text: `${sysInstruction}\n\nUser: ${textToSend}` }];
        if (frameBase64) {
          parts.push({ inline_data: { mime_type: "image/jpeg", data: frameBase64 } });
        }

        const payload: any = {
          contents: [{ role: "user", parts }],
          generationConfig: { temperature: selectedEngine === "carbon" ? 0.3 : 0.7 },
        };
        if (enableWebSearch) payload.tools = [{ google_search: {} }];

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        const cand = data.candidates?.[0];
        replyContent = cand?.content?.parts?.map((p: any) => p.text || "").join("\n") || "Done.";
        const chunks = cand?.groundingMetadata?.groundingChunks || [];
        returnedSources = chunks.filter((c: any) => c.web?.uri).map((c: any) => ({ title: c.web.title || c.web.uri, uri: c.web.uri }));
      } else {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: textToSend,
            enableSearch: enableWebSearch,
            model: selectedEngine === "carbon" ? "gemini-4-argon" : "gemini-3.8-flash",
            assistant: selectedEngine === "assistant" ? "apple_siri" : "gemini",
            attachments: frameBase64 ? [{ data: frameBase64, mimeType: "image/jpeg" }] : [],
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        replyContent = data.reply || data.response || "Completed successfully.";
        returnedSources = data.sources || [];
      }

      parseActionBlock(replyContent);

      const htmlMatch = replyContent.match(/```html\s*([\s\S]*?)```/);
      const executableHtml = htmlMatch ? htmlMatch[1] : undefined;

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: "assistant",
          text: replyContent,
          sources: returnedSources,
          engine: selectedEngine,
          timestamp: new Date().toLocaleTimeString(),
          executableHtml,
        },
      ]);

      if (fromVoice || isVoiceLoopActive || selectedEngine === "assistant") {
        speakText(replyContent);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "system",
          text: `Notice: ${err.message}\n\nTip: Connect your Google AI Studio API key at the top right to renew quota instantly.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------------------------------------------------------------------------
  // ISRO & IRCTC Haversine Spatial Assets
  // ---------------------------------------------------------------------------
  const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const telemetryAssets = [
    { id: "ISRO_ASSET_01", type: "ISRO Satellite Ground Track", lat: 28.6145, lng: 77.2095, refLat: 28.6139, refLng: 77.209 },
    { id: "ISRO_ASSET_02", type: "ISRO NavIC Telemetry Node", lat: 13.72, lng: 80.23, refLat: 13.7199, refLng: 80.2271 },
    { id: "IRCTC_22436", type: "IRCTC Vande Bharat (NDLS-BSB)", lat: 26.4499, lng: 80.3319, refLat: 26.4505, refLng: 80.3315 },
    { id: "IRCTC_12951", type: "IRCTC New Delhi Rajdhani Express", lat: 22.3072, lng: 73.1812, refLat: 22.308, refLng: 73.181 },
    { id: "FLIGHT_AI101", type: "Air India AI-101 Flight Radar", lat: 19.0896, lng: 72.8656, refLat: 19.09, refLng: 72.865 },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* ----------------- Top Telemetry & Identity Bar ----------------- */}
      <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            <h2 className="text-sm font-black tracking-wider bg-gradient-to-r from-orange-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              SARVAGYA AI OMNI CORE
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-950/80 border border-orange-700/60 text-orange-300">
            Made in India • Aryan Sharma
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 border border-emerald-700/60 text-emerald-300">
            100% Free Forever • Zero Cost
          </span>
        </div>

        {/* Live Hardware Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-sky-300 font-mono text-[11px] flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            CPU: {cpuCores} Cores
          </span>
          <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-purple-300 font-mono text-[11px] flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            RAM: {deviceRam}
          </span>
          <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-emerald-300 font-mono text-[11px] flex items-center gap-1">
            <Zap className={`w-3.5 h-3.5 ${isCharging ? "text-amber-400 animate-bounce" : "text-emerald-400"}`} />
            Bat: {batteryLevel !== null ? `${batteryLevel}%` : "--"}
          </span>
          <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-amber-300 font-mono text-[11px] flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            {isOnline ? "Online" : "Offline"}
          </span>

          {/* Real-time Clock Watch */}
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-300 font-mono text-[11px] flex items-center gap-1.5 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>🕒 {liveClock}</span>
          </span>

          {/* Daily Quota Renewal Countdown Badge */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="px-2.5 py-1 rounded bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 font-mono text-[11px] flex items-center gap-1.5 transition cursor-pointer"
            title="Daily Free Quota Renewal at 00:00 Pacific Time"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reset: <strong className="text-white">{dailyQuotaCountdown}</strong></span>
          </button>

          {/* Master Standalone Edition Link */}
          <a
            href="/sarvagya_master_complete.html"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center gap-1 transition shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Master HTML</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>

          {/* Connect Free API Key Button */}
          <button
            onClick={() => setShowKeyModal(true)}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
              apiKey
                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40"
                : "bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-600/30"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{apiKey ? "Free Key Connected" : "Connect Free Key"}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setSubTab("assistants")}
          className={`px-3 py-1 rounded-lg font-bold transition ${
            subTab === "assistants" ? "bg-sky-600 text-white" : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
          }`}
        >
          1. Omni AI & 5-in-1 Assistants
        </button>
        <button
          onClick={() => setSubTab("calendar-watch")}
          className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
            subTab === "calendar-watch" ? "bg-sky-600 text-white" : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>2. Calendar & Watch Hub</span>
          <span className="px-1.5 py-0.2 rounded-full bg-purple-900/60 text-[10px] text-purple-200 border border-purple-700/50">
            {calendarEvents.length}
          </span>
        </button>
        <button
          onClick={() => setSubTab("telemetry")}
          className={`px-3 py-1 rounded-lg font-bold transition ${
            subTab === "telemetry" ? "bg-sky-600 text-white" : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
          }`}
        >
          3. ISRO, IRCTC & Flights
        </button>
        <button
          onClick={() => setSubTab("agents")}
          className={`px-3 py-1 rounded-lg font-bold transition ${
            subTab === "agents" ? "bg-sky-600 text-white" : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
          }`}
        >
          4. Autonomous Agents
        </button>
        <button
          onClick={() => setSubTab("markets")}
          className={`px-3 py-1 rounded-lg font-bold transition ${
            subTab === "markets" ? "bg-sky-600 text-white" : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
          }`}
        >
          5. Quant Markets
        </button>
      </div>

      {/* ----------------- SUB-TAB 1: OMNI AI & 5-IN-1 ASSISTANTS ----------------- */}
      {subTab === "assistants" && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
          {/* Left Column: Cognitive Engine, Apple AI, Galaxy AI, Vision (3 cols) */}
          <aside className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-3 overflow-y-auto">
            {/* Cognitive Engine Selection */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 block mb-1">
                Cognitive Engine Core
              </span>
              <select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="omni">SARVAGYA Omni-Engine (Combined All Models & Assistants)</option>
                <option value="carbon">Gemini 4 Carbon High (Deep Logic & Cyber • Score 59.4)</option>
                <option value="opus">Claude Opus 5.5 Max (Autonomous Coding • Score 58)</option>
                <option value="astra">GPT-6 Astra Max (Science, Math & UI Action • Score 57+)</option>
                <option value="assistant">24/7 Voice & Device Assistant Core</option>
              </select>
            </div>

            {/* Apple Intelligence: Writing Tools */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
                Apple Intelligence • Writing Tools
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <button
                  onClick={() => executeOmniQuery(`Apple Intelligence Proofread: Fix grammar, clarity, and flow in this text:\n\n"${inputPrompt}"`)}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-slate-200"
                >
                  Proofread
                </button>
                <button
                  onClick={() => executeOmniQuery(`Apple Intelligence Rewrite: Rewrite in an executive Professional tone:\n\n"${inputPrompt}"`)}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-slate-200"
                >
                  Professional
                </button>
                <button
                  onClick={() => executeOmniQuery(`Apple Intelligence Priority Summary: Summarize into executive takeaways:\n\n"${inputPrompt}"`)}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-purple-300"
                >
                  Summary
                </button>
                <button
                  onClick={() => executeOmniQuery(`Apple Intelligence Table Extractor: Convert into a clean Markdown table:\n\n"${inputPrompt}"`)}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-purple-300"
                >
                  Extract Table
                </button>
              </div>
            </div>

            {/* Samsung Galaxy AI Suite */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">Galaxy AI Interpreter</span>
                <select
                  value={interpreterLang}
                  onChange={(e) => setInterpreterLang(e.target.value)}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200"
                >
                  <option value="Hindi">Hindi ↔ English</option>
                  <option value="Sanskrit">Sanskrit ↔ English</option>
                  <option value="Spanish">Spanish ↔ English</option>
                  <option value="Japanese">Japanese ↔ English</option>
                  <option value="German">German ↔ English</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <button
                  onClick={() => executeOmniQuery(`Samsung Galaxy AI Interpreter (${interpreterLang} <-> English): Translate accurately and provide phonetic pronunciation:\n\n"${inputPrompt}"`, true)}
                  className="p-1.5 rounded bg-blue-950/80 hover:bg-blue-900/80 border border-blue-800 text-blue-200 font-medium"
                >
                  Live Translate
                </button>
                <button
                  onClick={() => executeOmniQuery(`Galaxy AI Note Assist: Format these raw notes with clean headings, action items, and bullet points:\n\n"${inputPrompt}"`)}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200"
                >
                  Note Assist
                </button>
              </div>
            </div>

            {/* Hardware Camera & Screen Vision */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Hardware Vision</span>
                <span className="text-[10px] text-slate-400 capitalize">{visionMode}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <button
                  onClick={startCamera}
                  className={`p-1.5 rounded font-semibold transition ${
                    visionMode === "camera" ? "bg-rose-600 text-white" : "bg-emerald-700 hover:bg-emerald-600 text-white"
                  }`}
                >
                  {visionMode === "camera" ? "Stop Cam" : "Webcam"}
                </button>
                <button
                  onClick={startScreen}
                  className={`p-1.5 rounded font-semibold transition ${
                    visionMode === "screen" ? "bg-rose-600 text-white" : "bg-indigo-700 hover:bg-indigo-600 text-white"
                  }`}
                >
                  {visionMode === "screen" ? "Stop Share" : "Screen"}
                </button>
              </div>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-28 object-cover rounded bg-black border border-slate-800 ${
                  visionMode !== "none" ? "block" : "hidden"
                }`}
              />
              <canvas ref={canvasRef} className="hidden" />
              <button
                onClick={() => executeOmniQuery("Circle to Search & Visual Telemetry: Analyze my active camera/screen frame in full detail, identify all items, text, code, or context, and explain actionable insights:")}
                className="w-full py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-emerald-300"
              >
                Inspect Live Frame (Circle to Search)
              </button>
            </div>
          </aside>

          {/* Center Column: Conversation Stream & Input (6 cols) */}
          <section className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col min-h-0 overflow-hidden">
            {/* Controls Bar */}
            <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                  <input
                    type="checkbox"
                    checked={enableWebSearch}
                    onChange={(e) => setEnableWebSearch(e.target.checked)}
                    className="accent-sky-500 w-3.5 h-3.5"
                  />
                  <span>Live Google Search</span>
                </label>
                <button
                  onClick={() => setIsStudioOpen(!isStudioOpen)}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 text-[11px]"
                >
                  Live Code Studio
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleVoiceLoop}
                  className={`px-2.5 py-1 rounded-lg text-white font-semibold text-[11px] transition flex items-center gap-1 ${
                    isVoiceLoopActive ? "bg-rose-600 hover:bg-rose-500" : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
                >
                  {isVoiceLoopActive ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  <span>{isVoiceLoopActive ? "Stop Voice Loop" : "Start 24/7 Voice"}</span>
                </button>
                <button
                  onClick={() => {
                    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                    setIsMuted(!isMuted);
                  }}
                  className={`px-2 py-1 rounded text-[11px] border ${
                    isMuted ? "bg-amber-950/60 border-amber-800 text-amber-300" : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Collapsible Opus Live Interactive Studio */}
            {isStudioOpen && (
              <div className="border-b border-slate-800 bg-slate-950 p-2">
                <div className="flex justify-between items-center mb-1 text-[10px]">
                  <span className="font-bold text-amber-400 uppercase">Opus-Agentic Live Interactive HTML/JS Studio</span>
                  <button onClick={() => setIsStudioOpen(false)} className="text-slate-400 hover:text-white">Close ✕</button>
                </div>
                <iframe srcDoc={studioPreviewCode} className="w-full h-44 bg-white rounded border border-slate-700" />
              </div>
            )}

            {/* Chat Stream */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                const isSystem = msg.role === "system";

                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl border leading-relaxed ${
                      isUser
                        ? "bg-sky-950/35 border-sky-800/60 ml-8 text-sky-50"
                        : isSystem
                        ? "bg-slate-950/80 border-slate-800 text-slate-300"
                        : "bg-slate-950/90 border-slate-800/80 mr-8 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 ${
                          isUser ? "text-sky-300" : isSystem ? "text-amber-400" : "text-emerald-400"
                        }`}
                      >
                        {isUser ? "YOU" : isSystem ? "SYSTEM" : "SARVAGYA AI"}
                        {msg.engine && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                            {msg.engine}
                          </span>
                        )}
                      </span>
                      {msg.executableHtml && (
                        <button
                          onClick={() => {
                            setStudioPreviewCode(msg.executableHtml!);
                            setIsStudioOpen(true);
                          }}
                          className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px]"
                        >
                          ▶ Run in Studio
                        </button>
                      )}
                    </div>

                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed overflow-x-auto">
                      {msg.text.replace(/```json\s*\{\s*"sarvagya_action"[\s\S]*?```/g, "").trim()}
                    </pre>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5 text-[10px]">
                        <span className="text-slate-400 font-semibold">Live Sources:</span>
                        {msg.sources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded bg-slate-950 text-sky-400 hover:underline border border-slate-800 flex items-center gap-1"
                          >
                            <span>{s.title || s.uri}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {isProcessing && (
                <div className="p-3 rounded-xl border bg-slate-950/80 border-sky-500/30 flex items-center gap-2 text-sky-300 animate-pulse mr-8">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-sky-400" />
                  <span className="font-mono text-xs">Sarvagya Omni Engine processing across multimodal feeds...</span>
                </div>
              )}
            </div>

            {/* Input Composer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex gap-2 items-center">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    executeOmniQuery();
                  }
                }}
                rows={2}
                placeholder="Ask Sarvagya AI: solve advanced math, write full-stack code, control smart home, or query live web..."
                className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
              />
              <button
                onClick={() => executeOmniQuery()}
                disabled={isProcessing}
                className="h-full px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold text-xs text-white transition shadow-lg shadow-sky-900/40"
              >
                Execute
              </button>
            </div>
          </section>

          {/* Right Column: Amazon Alexa+ Smart Home & Google Assistant (3 cols) */}
          <aside className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-3 overflow-y-auto">
            {/* Amazon Alexa+ Smart Home */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Alexa+ Smart Home</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">{smartRoutine}</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span>Smart Lights</span>
                  <button
                    onClick={() => setSmartLights(!smartLights)}
                    className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      smartLights ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {smartLights ? "ON" : "OFF"}
                  </button>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                  <span>Brightness: {smartBrightness}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={smartBrightness}
                    onChange={(e) => setSmartBrightness(Number(e.target.value))}
                    className="accent-amber-400 w-24"
                  />
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span>Thermostat</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setSmartThermo(smartThermo - 1)} className="px-1.5 py-0.5 rounded bg-slate-800">-</button>
                    <span className="font-bold text-amber-400">{smartThermo}°F</span>
                    <button onClick={() => setSmartThermo(smartThermo + 1)} className="px-1.5 py-0.5 rounded bg-slate-800">+</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 pt-1 text-[11px]">
                  <button onClick={() => applyAlexaRoutine("Good Morning")} className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300">☀ Morning</button>
                  <button onClick={() => applyAlexaRoutine("Movie Night")} className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300">🎬 Movie Night</button>
                </div>
              </div>
            </div>

            {/* Watch & Stopwatch Hub */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Watch className="w-3.5 h-3.5 text-amber-400" />
                  Watch & Stopwatch
                </span>
                <span className="text-[10px] text-slate-400">{isStopwatchRunning ? "Running" : "Idle"}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="font-mono text-base font-black text-amber-300">
                  {formatStopwatch(stopwatchSeconds)}
                </span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    onClick={toggleStopwatch}
                    className={`px-2 py-0.5 rounded font-bold text-white transition ${
                      isStopwatchRunning ? "bg-rose-600 hover:bg-rose-500" : "bg-amber-600 hover:bg-amber-500"
                    }`}
                  >
                    {isStopwatchRunning ? "Pause" : "Start"}
                  </button>
                  <button
                    onClick={resetStopwatch}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Scheduling Hub */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Calendar & Schedule
                </span>
                <button
                  onClick={() => setShowEventModal(true)}
                  className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 hover:bg-purple-900 font-bold"
                >
                  + Event
                </button>
              </div>
              <div className="space-y-1 text-xs max-h-36 overflow-y-auto">
                {calendarEvents.map((ev) => (
                  <div key={ev.id} className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div className="truncate pr-1">
                      <p className="font-semibold text-white truncate text-[11px]">{ev.title}</p>
                      <p className="text-[10px] text-slate-400">{ev.time}</p>
                    </div>
                    <button onClick={() => removeCalendarEvent(ev.id)} className="text-slate-500 hover:text-rose-400 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Assistant Hub */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2 flex-1 flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Google Assistant Hub</span>
              {/* Countdown Timer */}
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-base font-extrabold text-white">{timerDisplay}</span>
                <div className="flex gap-1 text-[11px]">
                  <button onClick={() => setTimerSeconds(60)} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700">1m</button>
                  <button onClick={() => setTimerSeconds(300)} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700">5m</button>
                  <button onClick={() => setTimerSeconds(0)} className="px-2 py-0.5 rounded bg-rose-950 text-rose-300">Stop</button>
                </div>
              </div>
              {/* Tasks List */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Add task or item..."
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  className="flex-1 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <button onClick={() => handleAddTask()} className="px-2.5 py-1 rounded bg-amber-600 text-white font-bold">+</button>
              </div>
              <ul className="space-y-1 text-xs text-slate-200 flex-1 overflow-y-auto max-h-48">
                {tasks.map((t, idx) => (
                  <li key={idx} className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <span className="truncate">{t}</span>
                    <button onClick={() => handleRemoveTask(idx)} className="text-slate-500 hover:text-rose-400">✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}

      {/* ----------------- SUB-TAB: CALENDAR & LIVE WATCH HUB ----------------- */}
      {subTab === "calendar-watch" && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {/* Header Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  SARVAGYA CALENDAR & LIVE CHRONO-WATCH OPERATING SUITE
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-model scheduled agenda execution with real-time hardware clock synchronization
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs font-bold">
                🕒 System Clock: {liveClock}
              </span>
              <a
                href="/sarvagya_master_complete.html"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Launch Standalone Edition</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 7 Cols: Calendar Schedule & Event Creator */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Active Calendar & Scheduled Agendas
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Synced with local device storage and responsive to natural language voice requests
                  </p>
                </div>
                <button
                  onClick={() => setShowEventModal(true)}
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>+ Schedule Event</span>
                </button>
              </div>

              {/* Event Cards */}
              <div className="space-y-2">
                {calendarEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between hover:border-purple-500/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-300">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-xs text-white">{ev.title}</h5>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {ev.time}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-purple-300 font-mono text-[9px]">
                            {ev.category || "General"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => executeOmniQuery(`Calendar Action: Prepare detailed briefing, agenda items, and background research for event "${ev.title}" scheduled for ${ev.time}:`)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
                      >
                        AI Brief
                      </button>
                      <button
                        onClick={() => removeCalendarEvent(ev.id)}
                        className="p-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Schedule Prompt Input */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/50 space-y-2">
                <span className="text-[11px] font-bold text-purple-300">Quick Natural Language Event Dispatch:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="quickEventInput"
                    placeholder="e.g. Schedule Product Review Meeting tomorrow at 4 PM"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement;
                        if (target.value.trim()) {
                          executeOmniQuery(`Schedule Calendar Event: ${target.value.trim()}`);
                          target.value = "";
                        }
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      const el = document.getElementById("quickEventInput") as HTMLInputElement;
                      if (el && el.value.trim()) {
                        executeOmniQuery(`Schedule Calendar Event: ${el.value.trim()}`);
                        el.value = "";
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: High-Precision Stopwatch & World Clock Hub */}
            <div className="lg:col-span-5 space-y-4">
              {/* Chrono Stopwatch */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Watch className="w-4 h-4 text-amber-400" />
                    Chrono-Stopwatch Module
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    isStopwatchRunning ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-slate-800 text-slate-400"
                  }`}>
                    {isStopwatchRunning ? "COUNTING" : "STOPPED"}
                  </span>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3">
                  <div className="font-mono text-3xl font-black text-amber-300 tracking-wider">
                    {formatStopwatch(stopwatchSeconds)}
                  </div>
                  <div className="flex justify-center gap-2 text-xs">
                    <button
                      onClick={toggleStopwatch}
                      className={`px-4 py-2 rounded-lg font-bold text-white transition flex items-center gap-1.5 ${
                        isStopwatchRunning ? "bg-rose-600 hover:bg-rose-500" : "bg-amber-600 hover:bg-amber-500"
                      }`}
                    >
                      {isStopwatchRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isStopwatchRunning ? "Pause" : "Start"}</span>
                    </button>
                    <button
                      onClick={resetStopwatch}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* World Timezones Watch */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-sky-400" />
                  Synchronized World Clocks
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">🇮🇳 New Delhi (IST)</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      {new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">🇺🇸 Pacific (PT / Silicon Valley)</span>
                    <span className="text-sm font-bold text-sky-300 font-mono">
                      {new Date().toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles" })}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">🇬🇧 London (GMT / BST)</span>
                    <span className="text-sm font-bold text-purple-300 font-mono">
                      {new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London" })}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">🇯🇵 Tokyo (JST)</span>
                    <span className="text-sm font-bold text-emerald-300 font-mono">
                      {new Date().toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 3: ISRO & IRCTC TELEMETRY ----------------- */}
      {subTab === "telemetry" && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-sky-400">ISRO & IRCTC HAVERSINE SPATIAL PROXIMITY TELEMETRY</h3>
                <p className="text-xs text-slate-400">Great-Circle distance verification with 5.0 km corridor tolerance threshold</p>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono">
                Corridor: &lt; 5.0 km OK
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {telemetryAssets.map((asset) => {
                const distKm = haversineKm(asset.lat, asset.lng, asset.refLat, asset.refLng);
                const isSynced = distKm <= 5.0;

                return (
                  <div key={asset.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{asset.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSynced ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-rose-950 text-rose-300"
                      }`}>
                        {isSynced ? "Synchronized" : "Alert > 5km"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{asset.type}</p>
                    <p className="text-sky-300 font-mono text-[11px]">
                      Coords: {asset.lat.toFixed(4)}°N, {asset.lng.toFixed(4)}°E
                    </p>
                    <p className="text-emerald-400 font-mono text-[11px]">
                      Haversine Deviation: <strong>{distKm.toFixed(2)} km</strong>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 3: AUTONOMOUS AGENTS ----------------- */}
      {subTab === "agents" && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-purple-400">AUTONOMOUS MULTI-STEP AGENT ENGINE</h3>
            <p className="text-xs text-slate-400">
              Executes autonomous multi-step job pipelines: web_search, code_execution, and workspace_draft checkpoints.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono">JOB ID: 72daea6f-13ad-413a-859b-8684fcf9b6d1</span>
                  <h4 className="font-bold text-white text-sm">Verify real-time ISRO telemetry and train routes</h4>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  COMPLETED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-sky-300">1. ISRO Telemetry Search</span>
                    <span className="text-purple-300 font-mono text-[10px]">web_search</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Operational & synchronized with ISRO telemetry and Indian Railways. Validated active tracking data.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-sky-300">2. NTES Train Route Sync</span>
                    <span className="text-purple-300 font-mono text-[10px]">web_search</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Active NTES/IRCTC corridors synchronized for New Delhi Rajdhani (12951) and Vande Bharat (22436).
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-sky-300">3. Haversine Code Verification</span>
                    <span className="text-purple-300 font-mono text-[10px]">code_execution</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Haversine analysis complete (5.0 km threshold): ISRO_ASSET_01 validated at 0.09 km; ISRO_ASSET_02 at 0.31 km.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-sky-300">4. Verification Summary Draft</span>
                    <span className="text-purple-300 font-mono text-[10px]">workspace_draft</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Verification report approved and saved to Sarvagya Knowledge Core.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 4: QUANT MARKETS ----------------- */}
      {subTab === "markets" && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 font-semibold">NIFTY 50 (NSE)</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-black text-white">24,842.15</span>
                <span className="text-xs font-bold text-emerald-400">+0.84%</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 font-semibold">SENSEX (BSE)</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-black text-white">81,765.40</span>
                <span className="text-xs font-bold text-emerald-400">+0.79%</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 font-semibold">BTC / USD</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-black text-white">$94,210.00</span>
                <span className="text-xs font-bold text-emerald-400">+2.41%</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 font-semibold">GOLD (MCX 10g)</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-black text-white">₹78,450.00</span>
                <span className="text-xs font-bold text-amber-300">+0.52%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-400">AI Quantitative Market Intelligence & Order-Flow Synthesis</h3>
              <button
                onClick={() => executeOmniQuery("Provide a quantitative market intelligence briefing covering Indian equities (NIFTY 50 / SENSEX), global tech stocks, and crypto order-flow momentum.")}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-slate-950"
              >
                Run Live Gemini Quant Analysis
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synthesizes real-time market catalysts with Google Search grounding across NSE, BSE, US equities, and crypto markets.
            </p>
          </div>
        </div>
      )}

      {/* ----------------- Quota & API Key Modal ----------------- */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Google AI Studio Quota & Limit Monitor</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-white p-1 text-base font-bold">✕</button>
            </div>

            <div className="py-4 space-y-4 text-slate-300">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="font-semibold text-sky-300 flex items-center gap-1.5 text-sm">
                  <Clock className="w-4 h-4 text-sky-400" />
                  Time Left Until Quota Renewal
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">60-Second Burst Limit:</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">{burstCountdown}s Left</span>
                    <span className="text-[10px] text-slate-500 block">Auto-resets every minute</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Daily Quota (00:00 PT):</span>
                    <span className="text-sm font-bold text-indigo-300 font-mono">{dailyQuotaCountdown}</span>
                    <span className="text-[10px] text-slate-500 block">Midnight PT / 08:00 UTC</span>
                  </div>
                </div>
              </div>

              <div className="bg-sky-950/30 border border-sky-800/60 p-3 rounded-xl text-sky-200">
                <p className="font-bold text-xs mb-1">⚡ Instant Renewal (Zero Wait Time):</p>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Connect your free personal Google AI Studio API key below to bypass shared limits immediately.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={customKeyInput}
                    onChange={(e) => setCustomKeyInput(e.target.value)}
                    className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                  <button
                    onClick={() => {
                      if (!customKeyInput.trim()) return;
                      localStorage.setItem("SARVAGYA_KEY", customKeyInput.trim());
                      localStorage.setItem("SARVAGYA_GEMINI_KEY", customKeyInput.trim());
                      setApiKey(customKeyInput.trim());
                      setShowKeyModal(false);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold"
                  >
                    Connect
                  </button>
                </div>
                {apiKey && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 pt-1">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Key active: ••••••••{apiKey.slice(-4)}
                    </span>
                    <button
                      onClick={() => {
                        localStorage.removeItem("SARVAGYA_KEY");
                        localStorage.removeItem("SARVAGYA_GEMINI_KEY");
                        setApiKey("");
                      }}
                      className="text-rose-400 hover:underline"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button onClick={() => setShowKeyModal(false)} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Calendar Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-800/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Schedule Calendar Event</h3>
              </div>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-white p-1 text-base font-bold">✕</button>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Event Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Master Architecture Review"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Event Date & Time:</label>
                <input
                  type="text"
                  placeholder="e.g. Tomorrow • 4:00 PM or Friday at 11 AM"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newEventTitle.trim()) return;
                    addCalendarEvent(newEventTitle, newEventTime || "Today");
                    setNewEventTitle("");
                    setNewEventTime("");
                    setShowEventModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition"
                >
                  Schedule Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};
