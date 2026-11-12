import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { ChatModule } from "./components/ChatModule";
import { MatrixModule } from "./components/MatrixModule";
import { CreativeModule } from "./components/CreativeModule";
import { ScienceModule } from "./components/ScienceModule";
import { StudentCreatorModule } from "./components/StudentCreatorModule";
import { StockModule } from "./components/StockModule";
import { BuyHatkeModule } from "./components/BuyHatkeModule";
import { WorkspaceModule } from "./components/WorkspaceModule";
import { MapsModule } from "./components/MapsModule";
import { PluginCenter } from "./components/PluginCenter";
import { EvolutionHUD } from "./components/EvolutionHUD";
import { UniversalHub } from "./components/UniversalHub";
import { CommandCenterModal } from "./components/CommandCenterModal";
import { SpaceTransitModule } from "./components/SpaceTransitModule";
import { InteractiveLabsModule } from "./components/InteractiveLabsModule";
import { BusinessJobModule } from "./components/BusinessJobModule";
import { MemoryKnowledgeModule } from "./components/MemoryKnowledgeModule";
import { MCPSystemWorkspace } from "./components/MCPSystemWorkspace";
import { VisionAudioDocLab } from "./components/workspaces/VisionAudioDocLab";
import { LiveVoiceAgent } from "./components/workspaces/LiveVoiceAgent";
import { AgentWorkbench } from "./components/workspaces/AgentWorkbench";
import { FullStackStudio } from "./components/workspaces/FullStackStudio";
import { SpeechTranslateStudio } from "./components/workspaces/SpeechTranslateStudio";
import { ModelConfigDrawer } from "./components/ModelConfigDrawer";
import { OmniCoreHardwareHub } from "./components/OmniCoreHardwareHub";
import { GoogleKeepModule } from "./components/GoogleKeepModule";
import { ActiveTab, UserProfile, ModelParameters } from "./types";
import { brainwaveSynthesizer } from "./utils/brainwaveSynthesizer";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isModelDrawerOpen, setIsModelDrawerOpen] = useState(false);

  const [modelParams, setModelParams] = useState<ModelParameters>(() => {
    const saved = localStorage.getItem("sarvagya_model_params");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      model: "gemini-3.8-flash",
      temperature: 0.7,
      topP: 0.95,
      thinkingBudget: 2048,
      systemInstruction: "You are SARVAGYA AI, the supreme web-grounded super-intelligence platform.",
      deepThinkingEnabled: true,
      searchGroundingEnabled: true,
      activePersona: "MENTOR",
    };
  });

  const handleUpdateParams = (updates: Partial<ModelParameters>) => {
    setModelParams((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("sarvagya_model_params", JSON.stringify(next));
      return next;
    });
  };

  const handleExportBackup = () => {
    const backup: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        backup[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sarvagya_full_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === "string") {
            localStorage.setItem(k, v);
          }
        }
        window.location.reload();
      } catch (err) {
        console.error("Failed to parse backup JSON file:", err);
      }
    };
    reader.readAsText(file);
  };

  const [profile, setProfile] = useState<UserProfile>({
    name: "Sarvagya Commander",
    avatar: "⚡",
    theme: "dark",
    goal: "Supercharged Intelligence & Multimodal Research",
    interests: "Deep Learning, Quantitative Finance, Bioscience, Spatial Navigation, Deal Intelligence",
    created: new Date().toISOString(),
    learningStyle: "Interactive Multi-Model",
    pacing: "Rapid & Adaptive",
    allowGoogleSearch: true,
    allowOfficeFeed: true,
    allowSelfUpdates: true,
    communicationStyle: "Analytical, Insightful & Direct",
    sentimentLabel: "Optimal Resonance",
    sentimentScore: 0.98,
    rapportLevel: "Empathetic Resonance (Level 5)",
    bondLevel: 100,
    interactionCount: 154,
    brainwaveProfile: "Beta",
    soundscapeEnabled: false,
    soundscapeVolume: 0.35,
    pinnedApps: ["google-drive", "google-sheets", "gmail", "gemini-live", "buyhatke", "stocks"],
  });

  const [workerTicks, setWorkerTicks] = useState(0);
  const [workerFeed, setWorkerFeed] = useState<Array<{ timestamp: number; tickIndex: number; payloadSize: number; source: string }>>([]);
  const [isSoundscapeActive, setIsSoundscapeActive] = useState(false);
  const [cacheStats, setCacheStats] = useState<{
    shellCacheCount: number;
    aiCacheCount: number;
    profileCacheCount: number;
    status: string;
  } | null>(null);

  const workerRef = useRef<Worker | null>(null);

  // Initialize Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[Service Worker] Registered successfully:", reg.scope);
          refreshCacheStats();
        })
        .catch((err) => {
          console.warn("[Service Worker] Registration notice:", err);
        });
    }
  }, []);

  // Initialize Evolution Background Worker
  useEffect(() => {
    try {
      const worker = new Worker("/evolutionWorker.js");
      workerRef.current = worker;

      worker.onmessage = (e) => {
        const data = e.data;
        if (data && data.type === "NEW_DATA_ACQUIRED") {
          setWorkerTicks(data.tickIndex);
          setWorkerFeed((prev) => [data, ...prev.slice(0, 19)]);
        }
      };

      worker.postMessage({ command: "START_STREAM" });

      return () => {
        worker.postMessage({ command: "STOP_STREAM" });
        worker.terminate();
      };
    } catch (err) {
      console.warn("Background Worker initialization note:", err);
    }
  }, []);

  // Fetch initial profile
  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setProfile((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  const refreshCacheStats = () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data) {
          setCacheStats(event.data);
        }
      };
      navigator.serviceWorker.controller.postMessage({ type: "GET_CACHE_STATS" }, [messageChannel.port2]);
    }
  };

  const clearCaches = () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = () => {
        refreshCacheStats();
      };
      navigator.serviceWorker.controller.postMessage({ type: "CLEAR_ALL_CACHES" }, [messageChannel.port2]);
    }
  };

  const toggleSoundscape = () => {
    if (isSoundscapeActive) {
      brainwaveSynthesizer.stop();
      setIsSoundscapeActive(false);
    } else {
      brainwaveSynthesizer.start(profile.brainwaveProfile, profile.soundscapeVolume);
      setIsSoundscapeActive(true);
    }
  };

  const handleUpdateBrainwaveVolume = (vol: number) => {
    setProfile((prev) => ({ ...prev, soundscapeVolume: vol }));
    brainwaveSynthesizer.setVolume(vol);
  };

  const handleSelectBrainwaveProfile = (prof: "Delta" | "Theta" | "Alpha" | "Beta" | "Gamma") => {
    setProfile((prev) => ({ ...prev, brainwaveProfile: prof }));
    if (isSoundscapeActive) {
      brainwaveSynthesizer.start(prof, profile.soundscapeVolume);
    }
  };

  // Keyboard shortcut for Universal Command Center (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandCenterOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar & HUD */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        workerTicks={workerTicks}
        isSoundscapeActive={isSoundscapeActive}
        toggleSoundscape={toggleSoundscape}
        onOpenCommandCenter={() => setIsCommandCenterOpen(true)}
        onOpenModelDrawer={() => setIsModelDrawerOpen(true)}
        selectedModel={modelParams.model}
      />

      {/* Global Model & Parameter Configuration Drawer */}
      <ModelConfigDrawer
        isOpen={isModelDrawerOpen}
        onClose={() => setIsModelDrawerOpen(false)}
        params={modelParams}
        onUpdateParams={handleUpdateParams}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Universal Command Center Modal */}
      <CommandCenterModal
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsCommandCenterOpen(false);
        }}
      />

      {/* Main View Port */}
      <main className="flex-1 min-h-0 flex flex-col overflow-x-hidden">
        {/* Premier Hardware + Software 24/7 Workspace */}
        {activeTab === "omni-core" && (
          <OmniCoreHardwareHub
            onOpenPythonRunner={() => setIsCommandCenterOpen(true)}
          />
        )}

        {/* 7 Core Workspaces */}
        {activeTab === "chat" && <ChatModule onNavigateTab={setActiveTab} />}
        {activeTab === "astra" && <ChatModule onNavigateTab={setActiveTab} initialAstraMode={true} />}
        {activeTab === "vision-lab" && <VisionAudioDocLab />}
        {activeTab === "live-agent" && <LiveVoiceAgent />}
        {activeTab === "creative" && <CreativeModule />}
        {activeTab === "agent-workbench" && <AgentWorkbench />}
        {activeTab === "software-studio" && <FullStackStudio />}
        {activeTab === "speech-translate" && <SpeechTranslateStudio />}

        {/* Specialized Modules */}
        {activeTab === "mcp" && <MCPSystemWorkspace />}
        {activeTab === "universal" && <UniversalHub />}
        {activeTab === "matrix" && <MatrixModule />}
        {activeTab === "science" && <ScienceModule />}
        {activeTab === "student" && <StudentCreatorModule />}
        {activeTab === "space" && <SpaceTransitModule />}
        {activeTab === "labs" && <InteractiveLabsModule />}
        {activeTab === "business" && <BusinessJobModule />}
        {activeTab === "memory" && <MemoryKnowledgeModule />}
        {activeTab === "stocks" && <StockModule />}
        {activeTab === "buyhatke" && <BuyHatkeModule />}
        {activeTab === "workspace" && <WorkspaceModule />}
        {activeTab === "keep" && <GoogleKeepModule />}
        {activeTab === "maps" && <MapsModule />}
        {activeTab === "plugins" && <PluginCenter />}
        {activeTab === "evolution" && (
          <EvolutionHUD
            profile={profile}
            setProfile={setProfile}
            workerTicks={workerTicks}
            workerFeed={workerFeed}
            isSoundscapeActive={isSoundscapeActive}
            toggleSoundscape={toggleSoundscape}
            cacheStats={cacheStats}
            onRefreshCacheStats={refreshCacheStats}
            onClearCaches={clearCaches}
            onUpdateBrainwaveVolume={handleUpdateBrainwaveVolume}
            onSelectBrainwaveProfile={handleSelectBrainwaveProfile}
          />
        )}
      </main>

      {/* Universal Footer */}
      <footer className="py-2.5 px-4 bg-slate-950 border-t border-slate-900 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-400 font-medium">SARVAGYA AI Frontier Engine</span>
          <span>• Zero-Mock Server-Side Execution</span>
        </div>
        <div className="text-slate-500">
          Gemini 4 Argon • Gemini 3.8 Flash • DeepMind Science • Google Workspace Hub • Project Astra
        </div>
      </footer>
    </div>
  );
}
