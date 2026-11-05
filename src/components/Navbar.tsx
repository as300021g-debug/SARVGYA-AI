import React from "react";
import {
  Sparkles,
  Bot,
  Globe,
  Layers,
  Palette,
  FlaskConical,
  GraduationCap,
  TrendingUp,
  Tag,
  Briefcase,
  MapPin,
  Cpu,
  Activity,
  Headphones,
  Zap,
  Terminal,
  Rocket,
  Brain,
  Compass,
  FileText,
  Gamepad2,
  Eye,
  Volume2,
  Code,
  Languages,
  Radio,
  Clock,
  Key,
} from "lucide-react";
import { ActiveTab, UserProfile } from "../types";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: UserProfile;
  workerTicks: number;
  isSoundscapeActive: boolean;
  toggleSoundscape: () => void;
  onOpenCommandCenter?: () => void;
  onOpenModelDrawer?: () => void;
  onOpenPublishModal?: () => void;
  selectedModel?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  workerTicks,
  isSoundscapeActive,
  toggleSoundscape,
  onOpenCommandCenter,
  onOpenModelDrawer,
  onOpenPublishModal,
  selectedModel = "gemini-3.8-flash",
}) => {
  const [quotaCountdown, setQuotaCountdown] = React.useState<string>("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const ptTime = new Date(utcTime - 8 * 3600000);
      const nextMidnightPT = new Date(ptTime);
      nextMidnightPT.setHours(24, 0, 0, 0);
      const diffMs = nextMidnightPT.getTime() - ptTime.getTime();
      const h = Math.floor(diffMs / (1000 * 60 * 60));
      const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diffMs % (1000 * 60)) / 1000);
      setQuotaCountdown(`${h}h ${m}m ${s}s`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; isCore?: boolean }> = [
    // Premier Hardware-Software Synergy
    { id: "omni-core", label: "Omni Core (Hardware + 24/7 AI)", icon: <Radio className="w-4 h-4 text-emerald-400" />, isCore: true },

    // 7 Core AI Workspaces
    { id: "chat", label: "Omni-Chat & Deep Reasoning", icon: <Bot className="w-4 h-4" />, isCore: true },
    { id: "vision-lab", label: "Vision & Document Lab", icon: <Eye className="w-4 h-4" />, isCore: true },
    { id: "live-agent", label: "Live Voice Agent", icon: <Headphones className="w-4 h-4" />, isCore: true },
    { id: "creative", label: "Creative Media Studio", icon: <Palette className="w-4 h-4" />, isCore: true },
    { id: "agent-workbench", label: "Agent Workbench", icon: <Sparkles className="w-4 h-4" />, isCore: true },
    { id: "software-studio", label: "Full-Stack Software Studio", icon: <Code className="w-4 h-4" />, isCore: true },
    { id: "speech-translate", label: "Speech & Translator", icon: <Languages className="w-4 h-4" />, isCore: true },

    // Specialized Modules
    { id: "mcp", label: "MCP AI & Game RPA", icon: <Gamepad2 className="w-4 h-4" /> },
    { id: "universal", label: "Universal Hub", icon: <Globe className="w-4 h-4" /> },
    { id: "matrix", label: "Multi-Model Matrix", icon: <Layers className="w-4 h-4" /> },
    { id: "science", label: "Bioscience Lab", icon: <FlaskConical className="w-4 h-4" /> },
    { id: "student", label: "Student Hub", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "space", label: "Space & Transit", icon: <Rocket className="w-4 h-4" /> },
    { id: "labs", label: "Interactive Labs", icon: <Compass className="w-4 h-4" /> },
    { id: "business", label: "Job & Business", icon: <FileText className="w-4 h-4" /> },
    { id: "memory", label: "AI Entries & Memory", icon: <Brain className="w-4 h-4" /> },
    { id: "stocks", label: "Stocks & Quant", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "buyhatke", label: "BuyHatke Deals", icon: <Tag className="w-4 h-4" /> },
    { id: "workspace", label: "Google Workspace", icon: <Briefcase className="w-4 h-4" /> },
    { id: "maps", label: "Maps Explorer", icon: <MapPin className="w-4 h-4" /> },
    { id: "plugins", label: "AI Plugins", icon: <Cpu className="w-4 h-4" /> },
    { id: "evolution", label: "Evolution HUD", icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80">
      {/* Top Telemetry & Status Bar */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-900 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold tracking-wider text-cyan-400">
            <span className="p-1 rounded bg-cyan-500/20 text-cyan-300">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-black bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              SARVAGYA AI
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
              100% Free Forever
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800 text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              AI MATURITY: 100.0% [MAX LIMIT]
            </span>

            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              BOND LEVEL {profile.bondLevel}%
            </span>

            <span className="hidden lg:inline-flex items-center gap-1 text-slate-400">
              TICK #{workerTicks}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 100% Free Publish & Share Button */}
          {onOpenPublishModal && (
            <button
              onClick={onOpenPublishModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/50 text-xs font-bold transition shadow-md shadow-emerald-950/40"
              title="Publish & Share App 100% Free (Zero Setup, No Billing, No Forms)"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Publish 100% Free</span>
            </button>
          )}

          {/* Daily Quota Renewal Countdown Button */}
          <button
            onClick={() => setActiveTab("omni-core")}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition shadow-sm"
            title="Daily Google AI Studio Quota resets at 00:00 Pacific Time. Click to open Omni Core Quota Monitor."
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline text-slate-400">Quota Reset:</span>
            <span className="font-bold text-white">{quotaCountdown || "Syncing..."}</span>
          </button>

          {/* Universal Command Center Button */}
          {onOpenCommandCenter && (
            <button
              onClick={onOpenCommandCenter}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 hover:from-cyan-900/80 hover:to-indigo-900/80 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition shadow-sm"
              title="Open Universal Command Center (Cmd+K)"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Command Center</span>
              <kbd className="hidden md:inline px-1 py-0.2 rounded bg-slate-800/80 text-[10px] font-mono border border-slate-700/80 text-slate-400">⌘K</kbd>
            </button>
          )}

          {/* Global Model & Parameter Drawer Button */}
          {onOpenModelDrawer && (
            <button
              onClick={onOpenModelDrawer}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 text-xs font-medium transition shadow-sm"
              title="Global Model & Parameter Configuration Drawer"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-mono">{selectedModel}</span>
              <span className="text-[10px] text-slate-400">⚙</span>
            </button>
          )}

          {/* Binaural Brainwave Audio Toggle */}
          <button
            onClick={toggleSoundscape}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              isSoundscapeActive
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20"
                : "bg-slate-800/60 hover:bg-slate-800 text-slate-400 border border-slate-700/60"
            }`}
            title="Toggle Web Audio API Binaural Frequency Synthesizer"
          >
            <Headphones className={`w-3.5 h-3.5 ${isSoundscapeActive ? "animate-pulse text-cyan-400" : ""}`} />
            <span className="hidden sm:inline">Brainwave Audio</span>
            <span className="text-[10px] uppercase font-bold text-slate-300">{profile.brainwaveProfile}</span>
          </button>

          {/* User Profile Chip */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200">
            <span>{profile.avatar}</span>
            <span className="font-medium hidden sm:inline">{profile.name}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
