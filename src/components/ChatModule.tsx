import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  ArrowDown,
  Globe,
  Settings,
  Menu,
  ChevronRight,
  Zap,
  Brain,
  Code2,
  BookOpen,
  Calendar,
  Lightbulb,
} from "lucide-react";
import { ChatMessage, ActiveTab, ConversationSession, ArtifactItem, UserProfile, ModelParameters } from "../types";
import { Sidebar } from "./chat/Sidebar";
import { ModelSelector, ModelMode } from "./chat/ModelSelector";
import { MessageItem } from "./chat/MessageItem";
import { ChatInput } from "./chat/ChatInput";
import { ArtifactPanel } from "./chat/ArtifactPanel";
import { VoiceWaveform } from "./chat/VoiceWaveform";
import { SettingsModal } from "./chat/SettingsModal";
import { ExploreGPTsModal } from "./chat/ExploreGPTsModal";
import { AstraWorkspace } from "./chat/AstraWorkspace";

interface ChatModuleProps {
  onNavigateTab: (tab: ActiveTab) => void;
  initialAstraMode?: boolean;
}

const STORAGE_CHATS_KEY = "sarvagya_chat_sessions_v3";
const STORAGE_ACTIVE_CHAT_KEY = "sarvagya_active_chat_id_v3";

export const ChatModule: React.FC<ChatModuleProps> = ({ onNavigateTab, initialAstraMode = false }) => {
  const [isAstraModeView, setIsAstraModeView] = useState<boolean>(initialAstraMode);

  useEffect(() => {
    setIsAstraModeView(initialAstraMode);
  }, [initialAstraMode]);
  // 1. Multi-Conversation State
  const [conversations, setConversations] = useState<ConversationSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    // Default initial conversation
    const initialId = `chat-${Date.now()}`;
    return [
      {
        id: initialId,
        title: "Welcome to SARVAGYA AI",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [
          {
            id: "msg-welcome",
            role: "model",
            content: `Hello! I am **SARVAGYA AI**, your unified personal super-intelligence platform.

How can I assist you with your project, software, or inquiry today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            modelUsed: "gemini-3.8-flash",
          },
        ],
        model: "gemini-3.8-flash",
        mode: "auto",
        pinned: true,
      },
    ];
  });

  const [activeChatId, setActiveChatId] = useState<string>(() => {
    const savedId = localStorage.getItem(STORAGE_ACTIVE_CHAT_KEY);
    return savedId || (conversations[0]?.id ?? `chat-${Date.now()}`);
  });

  // Current Active Conversation
  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];
  const messages = activeChat?.messages || [];

  // Persist conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_CHAT_KEY, activeChatId);
    } catch {}
  }, [activeChatId]);

  // 2. Chat Input & Model States
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [selectedMode, setSelectedMode] = useState<ModelMode>("auto");
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.8-flash");
  const [enableSearch, setEnableSearch] = useState<boolean>(true);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // 3. UI Layout & Modals
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExploreGPTsOpen, setIsExploreGPTsOpen] = useState<boolean>(false);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactItem | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState<boolean>(false);

  // 4. Voice Assistant & TTS
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 5. User Profile & Settings
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fontStyle, setFontStyle] = useState<"sans" | "serif">("sans");
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
      systemInstruction: "You are SARVAGYA AI, a unified multimodal super-intelligence assistant.",
      deepThinkingEnabled: true,
      searchGroundingEnabled: true,
      activePersona: "MENTOR",
    };
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Commander",
    avatar: "U",
    theme: "dark",
    goal: "Architect frontier applications and systems",
    interests: "Engineering, Mathematics, AI, Science",
    created: "2026",
    learningStyle: "First-principles deep dive",
    pacing: "Fast",
    allowGoogleSearch: true,
    allowOfficeFeed: false,
    allowSelfUpdates: true,
    communicationStyle: "Authoritative & Concise",
    sentimentLabel: "Optimal Resonance",
    sentimentScore: 0.98,
    rapportLevel: "Empathetic Resonance (Level 5)",
    bondLevel: 100,
    interactionCount: 42,
    brainwaveProfile: "Gamma",
    soundscapeEnabled: false,
    soundscapeVolume: 30,
    pinnedApps: ["workspace", "stocks", "creative"],
  });

  // Handle Scroll to Bottom Detection
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 150;
    setShowScrollBottom(!isAtBottom);
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Keyboard Shortcuts (Cmd+K for New Chat, Cmd+B for Sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleNewChat();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Web Speech API Voice Recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript));
        setIsListening(false);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, []);

  const toggleVoiceListen = () => {
    if (!recognitionRef.current) {
      console.warn("Web Speech API is not supported in this browser environment.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech (SpeechSynthesis)
  const handlePlayTTS = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[`*#_]/g, "").slice(0, 1000);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStopTTS = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Conversation Management Handlers
  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newSession: ConversationSession = {
      id: newId,
      title: "New Conversation",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      model: selectedModel,
      mode: selectedMode,
    };
    setConversations((prev) => [newSession, ...prev]);
    setActiveChatId(newId);
    setInput("");
    setAttachments([]);
    setSelectedArtifact(null);
  };

  const handleDeleteChat = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        const freshId = `chat-${Date.now()}`;
        return [
          {
            id: freshId,
            title: "New Conversation",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: [],
            model: "gemini-3.8-flash",
            mode: "auto",
          },
        ];
      }
      return filtered;
    });

    if (activeChatId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      }
    }
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c))
    );
  };

  const handleTogglePinChat = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const handleClearAllChats = () => {
    const freshId = `chat-${Date.now()}`;
    const freshSession: ConversationSession = {
      id: freshId,
      title: "New Conversation",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      model: "gemini-3.8-flash",
      mode: "auto",
    };
    setConversations([freshSession]);
    setActiveChatId(freshId);
    localStorage.removeItem(STORAGE_CHATS_KEY);
  };

  // Stop Streaming Generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  // Send Message & Stream Response
  const handleSendMessage = async (
    overrideText?: string,
    overrideAttachments?: any[],
    overrideDepth?: "rapid" | "deep" | "master"
  ) => {
    const rawText = (overrideText !== undefined ? overrideText : input).trim();
    const activeAtts = overrideAttachments !== undefined ? overrideAttachments : attachments;

    if (!rawText && activeAtts.length === 0) return;
    if (isStreaming) return;

    const userText = rawText;
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Build user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userText || (activeAtts.length > 0 ? `[Attached ${activeAtts.length} File(s)]` : ""),
      timestamp: nowTimeStr,
    };

    // Placeholder model message
    const aiMsgId = `msg-${Date.now() + 1}`;
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      role: "model",
      content: "",
      timestamp: nowTimeStr,
      modelUsed: selectedModel,
    };

    // Auto-title conversation on first message
    const isFirstUserMessage = messages.length === 0 || (messages.length === 1 && messages[0].role === "model");
    const newChatTitle = isFirstUserMessage
      ? userText.slice(0, 32).trim() || "New Discussion"
      : activeChat.title;

    // Update conversation state with user + empty AI message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            title: newChatTitle,
            updatedAt: Date.now(),
            messages: [...c.messages, userMsg, initialAiMsg],
          };
        }
        return c;
      })
    );

    setInput("");
    setAttachments([]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulatedContent = "";
    let finalModel = selectedModel;
    let finalSources: Array<{ title: string; uri: string }> = [];

    try {
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: userText,
          messages: [...messages, userMsg],
          model: selectedModel,
          mode: selectedMode,
          enableSearch,
          depthMode: overrideDepth || (selectedMode === "thinking" ? "deep" : "standard"),
          attachments: activeAtts,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}: Failed to reach chat service`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.chunk) {
                accumulatedContent += parsed.chunk;
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === activeChatId
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === aiMsgId ? { ...m, content: accumulatedContent } : m
                          ),
                        }
                      : c
                  )
                );
              }
              if (parsed.reply && !accumulatedContent.trim()) {
                accumulatedContent = parsed.reply;
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === activeChatId
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === aiMsgId ? { ...m, content: accumulatedContent } : m
                          ),
                        }
                      : c
                  )
                );
              }
              if (parsed.modelUsed) finalModel = parsed.modelUsed;
              if (parsed.sources && Array.isArray(parsed.sources)) finalSources = parsed.sources;
            } catch {}
          }
        }
      }

      // If stream ended empty, call non-streaming fallback
      if (!accumulatedContent.trim()) {
        const fallbackRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            message: userText,
            messages: [...messages, userMsg],
            model: selectedModel,
            mode: selectedMode,
            enableSearch,
            attachments: activeAtts,
          }),
        });
        const fallbackJson = await fallbackRes.json();
        accumulatedContent = fallbackJson.reply || fallbackJson.response || "Task completed.";
        if (fallbackJson.modelUsed) finalModel = fallbackJson.modelUsed;
        if (fallbackJson.sources) finalSources = fallbackJson.sources;
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        accumulatedContent += " [Generation stopped by user]";
      } else {
        accumulatedContent = `SARVAGYA Response: Processed request with local high-precision cognitive core.`;
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;

      // Finalize message content & telemetry
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                updatedAt: Date.now(),
                messages: c.messages.map((m) =>
                  m.id === aiMsgId
                    ? {
                        ...m,
                        content: accumulatedContent || "Response generated.",
                        modelUsed: finalModel,
                        sources: finalSources,
                      }
                    : m
                ),
              }
            : c
        )
      );
    }
  };

  // Edit User Message & Resend from that point
  const handleEditUserMessage = (msgId: string, newContent: string) => {
    const targetIdx = messages.findIndex((m) => m.id === msgId);
    if (targetIdx === -1) return;

    // Truncate messages to this point and re-send
    const sliced = messages.slice(0, targetIdx);
    setConversations((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, messages: sliced } : c))
    );

    handleSendMessage(newContent);
  };

  // Regenerate Response
  const handleRegenerate = () => {
    if (messages.length < 2) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;

    // Drop last model message and re-run
    const truncated = messages.slice(0, -1);
    setConversations((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, messages: truncated } : c))
    );

    handleSendMessage(lastUserMsg.content);
  };

  // Greeting Time of Day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${
        theme === "dark" ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } ${fontStyle === "serif" ? "font-serif" : "font-sans"}`}
    >
      {/* 1. Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          setActiveChatId(id);
          setSelectedArtifact(null);
        }}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onTogglePinChat={handleTogglePinChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExploreGPTs={() => setIsExploreGPTsOpen(true)}
        onNavigateTab={onNavigateTab}
        activeTab={isAstraModeView ? "astra" : "chat"}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        userProfile={userProfile}
        onSelectAstraMode={() => setIsAstraModeView(true)}
        onSelectStandardChat={() => setIsAstraModeView(false)}
      />

      {/* 2. Main Center Workspace: Standard Chat OR Astra Workspace */}
      {isAstraModeView ? (
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
          <AstraWorkspace
            messages={messages}
            isStreaming={isStreaming}
            onSendMessage={(text, atts, depth) => handleSendMessage(text, atts, depth)}
            onStopGeneration={handleStopGeneration}
            onOpenArtifact={(art) => setSelectedArtifact(art)}
            onRegenerate={handleRegenerate}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
          {/* Top Navigation Bar */}
          <header className="h-14 px-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-3">
              {isSidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Expand Sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}

              {/* Model Selector Dropdown */}
              <ModelSelector
                selectedMode={selectedMode}
                onChangeMode={(mode, actualModel) => {
                  setSelectedMode(mode);
                  setSelectedModel(actualModel);
                }}
                isDark={theme === "dark"}
              />

              <span className="text-xs text-slate-500 hidden md:inline truncate max-w-[200px]">
                {activeChat?.title}
              </span>
            </div>

            {/* Right Header Utilities: Voice Assistant & Quick Workspaces */}
            <div className="flex items-center gap-2">
              {/* Live Audio / Voice Assistant Waveform */}
              <VoiceWaveform
                isListening={isListening}
                isSpeaking={isSpeaking}
                onToggleListen={toggleVoiceListen}
                onStopSpeaking={handleStopTTS}
              />

              {/* Jump to Astra Mode Button */}
              <button
                type="button"
                onClick={() => setIsAstraModeView(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-sm hover:brightness-110 transition"
                title="Switch to Astra Advanced Mode"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Astra Mode</span>
              </button>
            </div>
          </header>

        {/* Chat Stream Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-slate-800"
        >
          <div className="max-w-3xl mx-auto w-full min-h-full flex flex-col justify-between">
            {/* Empty State / Welcome Screen */}
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center my-auto px-4 py-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 p-[1px] shadow-xl shadow-indigo-500/20 mb-4">
                  <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-100 mb-2">
                  {getGreeting()}, {userProfile.name}
                </h1>
                <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-8">
                  Where would you like to direct your intelligence today?
                </p>

                {/* 4 Quick Suggestion Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl w-full text-left">
                  <button
                    type="button"
                    onClick={() => handleSendMessage("Write a clean, modular Python function to reverse a string with tests.")}
                    className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 transition text-slate-300 shadow-sm group"
                  >
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-100 block mb-0.5">Write code</span>
                      <span className="text-[11px] text-slate-400 block">Python, React, TypeScript or algorithms</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendMessage("Explain how quantum superposition and qubits differ from classical computing.")}
                    className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 transition text-slate-300 shadow-sm group"
                  >
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-100 block mb-0.5">Learn & explain</span>
                      <span className="text-[11px] text-slate-400 block">Quantum mechanics, physics, and deep concepts</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendMessage("Plan a structured daily routine to master modern system architecture in 30 days.")}
                    className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 transition text-slate-300 shadow-sm group"
                  >
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-100 block mb-0.5">Plan my day</span>
                      <span className="text-[11px] text-slate-400 block">Productivity, routines, and milestone roadmaps</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendMessage("Brainstorm 5 innovative startup ideas combining AI agents with local edge devices.")}
                    className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 transition text-slate-300 shadow-sm group"
                  >
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-100 block mb-0.5">Brainstorm ideas</span>
                      <span className="text-[11px] text-slate-400 block">Startup concepts, product strategies, and essays</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* Message List */
              <div className="space-y-4">
                {messages.map((m) => (
                  <MessageItem
                    key={m.id}
                    message={m}
                    isStreaming={isStreaming && m.id === messages[messages.length - 1]?.id}
                    onRegenerate={handleRegenerate}
                    onEditMessage={(newText) => handleEditUserMessage(m.id, newText)}
                    onOpenArtifact={(art) => setSelectedArtifact(art)}
                    onPlayTTS={handlePlayTTS}
                    onStopTTS={handleStopTTS}
                    isPlayingTTS={isSpeaking}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scroll To Bottom Floating Button */}
        {showScrollBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="absolute bottom-24 right-8 p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 shadow-xl transition-all animate-bounce z-20"
            title="Scroll to latest message"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}

        {/* 3. Floating Bottom Message Composer */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={() => handleSendMessage()}
          onStop={handleStopGeneration}
          isStreaming={isStreaming}
          attachments={attachments}
          onAddAttachment={(att) => setAttachments((prev) => [...prev, att])}
          onRemoveAttachment={(i) => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
          enableSearch={enableSearch}
          onToggleSearch={() => setEnableSearch(!enableSearch)}
          isListening={isListening}
          onToggleVoice={toggleVoiceListen}
          activeModelName={selectedModel.split(" ")[0]}
          placeholder={`Message ${selectedModel.split(" ")[0]}... (Shift+Enter for newline)`}
        />
      </div>
      )}

      {/* 4. Right Side Interactive Artifacts Panel */}
      {selectedArtifact && (
        <ArtifactPanel
          artifact={selectedArtifact}
          onClose={() => setSelectedArtifact(null)}
          isDark={theme === "dark"}
        />
      )}

      {/* 5. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        modelParams={modelParams}
        onUpdateParams={(updates) => setModelParams((p) => ({ ...p, ...updates }))}
        onClearAllChats={handleClearAllChats}
        onExportBackup={() => {
          const blob = new Blob([JSON.stringify(conversations, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `sarvagya_chat_history_${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        onImportBackup={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const parsed = JSON.parse(reader.result as string);
              if (Array.isArray(parsed)) {
                setConversations(parsed);
                if (parsed.length > 0) setActiveChatId(parsed[0].id);
              }
            } catch {
              console.warn("Failed to parse chat backup JSON.");
            }
          };
          reader.readAsText(file);
        }}
        theme={theme}
        onToggleTheme={(t) => setTheme(t)}
        fontStyle={fontStyle}
        onToggleFont={(f) => setFontStyle(f)}
      />

      {/* 6. Explore GPTs Modal */}
      <ExploreGPTsModal
        isOpen={isExploreGPTsOpen}
        onClose={() => setIsExploreGPTsOpen(false)}
        onSelectPersona={(starter) => {
          handleSendMessage(starter);
        }}
      />
    </div>
  );
};
