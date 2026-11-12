import React, { useState, useEffect } from "react";
import {
  StickyNote,
  Plus,
  Pin,
  Trash2,
  Palette,
  CheckSquare,
  Square,
  Search,
  Sparkles,
  Cloud,
  CloudCheck,
  RefreshCw,
  Copy,
  Check,
  LogIn,
  LogOut,
  Folder,
  Tag,
  Archive,
  Layers,
  ChevronDown,
  Globe,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import {
  auth,
  db,
  googleSignIn,
  logout,
  initAuth,
  handleFirestoreError,
  OperationType,
  testFirestoreConnection,
} from "../lib/firebase";
import { User } from "firebase/auth";
import { KeepNote } from "../types";

// Official Google Keep Color Palette
export const KEEP_COLORS = [
  { id: "default", bg: "bg-slate-900", border: "border-slate-800", name: "Default" },
  { id: "coral", bg: "bg-rose-950/60", border: "border-rose-700/60", name: "Coral" },
  { id: "peach", bg: "bg-amber-950/60", border: "border-amber-700/60", name: "Peach" },
  { id: "sand", bg: "bg-yellow-950/60", border: "border-yellow-700/60", name: "Sand" },
  { id: "mint", bg: "bg-emerald-950/60", border: "border-emerald-700/60", name: "Mint" },
  { id: "sage", bg: "bg-teal-950/60", border: "border-teal-700/60", name: "Sage" },
  { id: "fog", bg: "bg-sky-950/60", border: "border-sky-700/60", name: "Fog" },
  { id: "storm", bg: "bg-blue-950/60", border: "border-blue-700/60", name: "Storm" },
  { id: "dusk", bg: "bg-indigo-950/60", border: "border-indigo-700/60", name: "Dusk" },
  { id: "blossom", bg: "bg-purple-950/60", border: "border-purple-700/60", name: "Blossom" },
  { id: "clay", bg: "bg-stone-900", border: "border-stone-700", name: "Clay" },
];

const LOCAL_STORAGE_KEY = "sarvagya_keep_notes_local";

export const GoogleKeepModule: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [notes, setNotes] = useState<KeepNote[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Composer State
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState("default");
  const [isPinned, setIsPinned] = useState(false);
  const [labels, setLabels] = useState("");
  const [isChecklistMode, setIsChecklistMode] = useState(false);
  const [checklistItems, setChecklistItems] = useState<Array<{ id: string; text: string; done: boolean }>>([]);
  const [newChecklistText, setNewChecklistText] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"notes" | "alphabet_directory">("notes");
  const [directorySearch, setDirectorySearch] = useState("");

  // AI Assistant Modal
  const [aiNoteTarget, setAiNoteTarget] = useState<KeepNote | null>(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "local">("local");

  // Initialize Auth & Firestore Listener
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        setIsAuthLoading(false);
        setSyncStatus("synced");
      },
      () => {
        setCurrentUser(null);
        setIsAuthLoading(false);
        setSyncStatus("local");
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync with Firestore when user is authenticated
  useEffect(() => {
    if (!currentUser) {
      setSyncStatus("local");
      return;
    }

    setSyncStatus("syncing");
    const notesPath = `users/${currentUser.uid}/notes`;
    const notesCol = collection(db, notesPath);
    const q = query(notesCol, orderBy("createdAt", "desc"));

    const unsubFirestore = onSnapshot(
      q,
      (snapshot) => {
        const remoteNotes: KeepNote[] = [];
        snapshot.forEach((d) => {
          remoteNotes.push({ id: d.id, ...d.data() } as KeepNote);
        });
        setNotes(remoteNotes);
        setSyncStatus("synced");
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteNotes));
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
        handleFirestoreError(error, OperationType.LIST, notesPath);
      }
    );

    return () => unsubFirestore();
  }, [currentUser]);

  // Save to local storage on offline/fallback updates
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, currentUser]);

  // Google Sign-In Handler
  const handleSignIn = async () => {
    try {
      setIsAuthLoading(true);
      await googleSignIn();
    } catch (err) {
      console.error("Google sign-in error:", err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Google Sign-Out Handler
  const handleSignOut = async () => {
    try {
      await logout();
      setCurrentUser(null);
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  // Create Note Handler
  const handleAddNote = async () => {
    if (!title.trim() && !content.trim() && checklistItems.length === 0) {
      setIsExpanded(false);
      return;
    }

    const newId = `note-${Date.now()}`;
    const authorId = currentUser ? currentUser.uid : "local_user";
    const nowIso = new Date().toISOString();

    const newNote: KeepNote = {
      id: newId,
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      color: selectedColor,
      pinned: isPinned,
      labels: labels.trim(),
      checklist: isChecklistMode ? checklistItems : undefined,
      authorId,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Optimistic local state update
    setNotes((prev) => [newNote, ...prev]);

    // Reset composer
    setTitle("");
    setContent("");
    setSelectedColor("default");
    setIsPinned(false);
    setLabels("");
    setIsChecklistMode(false);
    setChecklistItems([]);
    setIsExpanded(false);

    // Save to Firestore if authenticated
    if (currentUser) {
      try {
        setSyncStatus("syncing");
        const notePath = `users/${currentUser.uid}/notes/${newId}`;
        await setDoc(doc(db, "users", currentUser.uid, "notes", newId), newNote);
        setSyncStatus("synced");
      } catch (err) {
        console.error("Firestore create error:", err);
        handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/notes/${newId}`);
      }
    }
  };

  // Toggle Pin Status
  const handleTogglePin = async (note: KeepNote) => {
    const updatedPinned = !note.pinned;
    const nowIso = new Date().toISOString();

    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, pinned: updatedPinned, updatedAt: nowIso } : n))
    );

    if (currentUser) {
      try {
        await updateDoc(doc(db, "users", currentUser.uid, "notes", note.id), {
          pinned: updatedPinned,
          updatedAt: nowIso,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/notes/${note.id}`);
      }
    }
  };

  // Delete Note
  const handleDeleteNote = async (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));

    if (currentUser) {
      try {
        await deleteDoc(doc(db, "users", currentUser.uid, "notes", noteId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/notes/${noteId}`);
      }
    }
  };

  // Toggle Checklist Item Checkbox
  const handleToggleChecklistItem = async (note: KeepNote, itemId: string) => {
    if (!note.checklist) return;
    const updatedChecklist = note.checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    const nowIso = new Date().toISOString();

    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, checklist: updatedChecklist, updatedAt: nowIso } : n))
    );

    if (currentUser) {
      try {
        await updateDoc(doc(db, "users", currentUser.uid, "notes", note.id), {
          checklist: updatedChecklist,
          updatedAt: nowIso,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/notes/${note.id}`);
      }
    }
  };

  // AI Assistant for Note
  const handleRunAiAssistant = async (action: "summarize" | "checklist" | "expand" | "translate") => {
    if (!aiNoteTarget) return;
    setAiProcessing(true);
    setAiResult(null);

    let prompt = "";
    const noteText = `${aiNoteTarget.title}\n${aiNoteTarget.content || ""}`;

    if (action === "summarize") {
      prompt = `Summarize the following note into clear, bulleted executive highlights:\n\n${noteText}`;
    } else if (action === "checklist") {
      prompt = `Convert the following note into an actionable step-by-step checklist:\n\n${noteText}`;
    } else if (action === "expand") {
      prompt = `Elaborate and brainstorm comprehensive next steps, research angles, and implementation details for this note:\n\n${noteText}`;
    } else if (action === "translate") {
      prompt = `Translate this note into Hindi and Spanish with natural fluency:\n\n${noteText}`;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: "gemini-3.8-flash",
          highThinking: false,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setAiResult(data.reply);
      }
    } catch (err) {
      console.error("AI Assistant error:", err);
      setAiResult("Unable to process note with AI right now. Please verify your connection.");
    } finally {
      setAiProcessing(false);
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      (n.content && n.content.toLowerCase().includes(q)) ||
      (n.labels && n.labels.toLowerCase().includes(q)) ||
      (n.checklist && n.checklist.some((item) => item.text.toLowerCase().includes(q)))
    );
  });

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);

  // Complete Alphabet Inc. & Google LLC Ecosystem Directory
  const ALPHABET_ECOSYSTEM = [
    {
      category: "Search, Discovery & Reference",
      items: [
        { name: "Google Search", desc: "Core web search engine with Images, Videos, News & Shopping", url: "https://www.google.com" },
        { name: "Google Lens", desc: "Visual AI search identifying objects, text, formulas & landmarks", url: "https://lens.google" },
        { name: "Google Scholar", desc: "Academic literature and peer-reviewed journals database", url: "https://scholar.google.com" },
        { name: "Google Books & Patents", desc: "Digital book archive and global patent search", url: "https://books.google.com" },
        { name: "Google Arts & Culture", desc: "High-resolution artworks and museum exhibits", url: "https://artsandculture.google.com" },
        { name: "Google Finance & Trends", desc: "Real-time stock markets & search popularity trends", url: "https://www.google.com/finance" },
      ],
    },
    {
      category: "Artificial Intelligence & Research",
      items: [
        { name: "Gemini", desc: "Flagship generative AI model family, Gemini Live & Canvas", url: "https://gemini.google.com" },
        { name: "Google DeepMind", desc: "Frontier AI lab training frontier models & AlphaFold", url: "https://deepmind.google" },
        { name: "NotebookLM", desc: "AI-powered personalized research and document notebook", url: "https://notebooklm.google" },
        { name: "Google Labs", desc: "Early-stage experimental AI sandbox & creative tools", url: "https://labs.google" },
        { name: "Kaggle", desc: "Global data science and machine learning competition platform", url: "https://www.kaggle.com" },
      ],
    },
    {
      category: "Productivity & Workspace",
      items: [
        { name: "Google Keep", desc: "Note-taking, checklists, memos, and multi-device cloud sync", url: "https://keep.google.com" },
        { name: "Gmail & Calendar", desc: "Core email, scheduling, and time management suite", url: "https://mail.google.com" },
        { name: "Google Drive", desc: "Cloud file storage and Workspace document management", url: "https://drive.google.com" },
        { name: "Docs, Sheets & Slides", desc: "Real-time collaborative document and spreadsheet editors", url: "https://docs.google.com" },
        { name: "Meet, Chat & Voice", desc: "HD video conferencing, team communication & VoIP", url: "https://meet.google.com" },
        { name: "Google Forms & Sites", desc: "Survey collection and public web page builder", url: "https://forms.google.com" },
      ],
    },
    {
      category: "Media, Entertainment & App Stores",
      items: [
        { name: "YouTube", desc: "World's largest video platform, YouTube Music & Shorts", url: "https://www.youtube.com" },
        { name: "Google Play", desc: "Digital app, game, book, and movie storefront for Android", url: "https://play.google.com" },
        { name: "Chrome Music Lab", desc: "Interactive web music experimentation platform", url: "https://musiclab.chromeexperiments.com" },
      ],
    },
    {
      category: "Maps, Navigation & Travel",
      items: [
        { name: "Google Maps & Earth", desc: "Satellite mapping, 3D photogrammetry, Street View & routing", url: "https://maps.google.com" },
        { name: "Waze", desc: "Community-driven real-time traffic and hazard GPS alerts", url: "https://www.waze.com" },
        { name: "Google Travel & Flights", desc: "Airfare search, hotel reservations, and trip itineraries", url: "https://www.google.com/travel/flights" },
      ],
    },
    {
      category: "Cloud, Developer & Cybersecurity",
      items: [
        { name: "Google Cloud Platform (GCP)", desc: "Compute Engine, Cloud Run, Cloud SQL & Kubernetes", url: "https://cloud.google.com" },
        { name: "Firebase", desc: "Real-time backend, Firestore database & authentication", url: "https://firebase.google.com" },
        { name: "BigQuery & Looker", desc: "Petabyte-scale enterprise analytics and data visualization", url: "https://cloud.google.com/bigquery" },
        { name: "TensorFlow & Flutter", desc: "Machine learning library and cross-platform mobile UI", url: "https://flutter.dev" },
        { name: "Mandiant & VirusTotal", desc: "Threat intelligence, malware analysis and cloud security", url: "https://www.virustotal.com" },
      ],
    },
    {
      category: "Alphabet Subsidiaries & Other Bets",
      items: [
        { name: "Waymo", desc: "Autonomous driving technology and commercial robotaxi service", url: "https://waymo.com" },
        { name: "Wing", desc: "Autonomous commercial drone delivery network", url: "https://wing.com" },
        { name: "Verily & Calico", desc: "Precision healthcare, clinical research & human longevity", url: "https://verily.com" },
        { name: "Isomorphic Labs", desc: "AI-driven drug discovery spun out of DeepMind", url: "https://isomorphiclabs.com" },
        { name: "X (The Moonshot Factory)", desc: "Breakthrough radical technology incubation lab", url: "https://x.company" },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-md shadow-amber-950/20">
            <StickyNote className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-100 flex items-center gap-2">
                <span>Google Keep Notes</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  Firebase Firestore Synced
                </span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                🇮🇳 Made in India • Aryan Sharma
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrated Google Keep note-taking suite with real-time Firebase Firestore database persistence, Gemini AI smart transformations, and Alphabet ecosystem directory.
            </p>
          </div>
        </div>

        {/* Auth & Sync Status Cluster */}
        <div className="flex items-center gap-3">
          {/* Sync indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {syncStatus === "synced" ? (
              <>
                <CloudCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-mono">Synced to Firebase</span>
              </>
            ) : syncStatus === "syncing" ? (
              <>
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-slate-300 font-mono">Syncing...</span>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 font-mono">Offline Local Cache</span>
              </>
            )}
          </div>

          {/* User Profile or Google Sign In */}
          {currentUser ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="w-7 h-7 rounded-full border border-amber-500/40"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-300">
                  {currentUser.displayName ? currentUser.displayName[0] : "U"}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left text-xs">
                <span className="font-bold text-slate-200 truncate max-w-[120px]">
                  {currentUser.displayName || "Authenticated"}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {currentUser.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign out"
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isAuthLoading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Switcher: Google Keep Notes vs Alphabet Ecosystem */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${
            activeTab === "notes"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <StickyNote className="w-4 h-4 text-amber-400" />
          <span>My Keep Notes ({notes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("alphabet_directory")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${
            activeTab === "alphabet_directory"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Alphabet & Google Ecosystem Directory</span>
        </button>
      </div>

      {activeTab === "notes" ? (
        <div className="space-y-6">
          {/* Note Composer */}
          <div className="max-w-2xl mx-auto">
            <div
              className={`rounded-2xl border transition-all duration-200 shadow-xl overflow-hidden ${
                KEEP_COLORS.find((c) => c.id === selectedColor)?.bg || "bg-slate-900"
              } ${KEEP_COLORS.find((c) => c.id === selectedColor)?.border || "border-slate-800"}`}
            >
              {isExpanded ? (
                <div className="p-4 space-y-3">
                  {/* Title & Pin */}
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full bg-transparent text-sm font-bold text-slate-100 placeholder-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPinned(!isPinned)}
                      className={`p-1.5 rounded-lg transition ${
                        isPinned ? "text-amber-400 bg-amber-500/20" : "text-slate-400 hover:text-slate-200"
                      }`}
                      title={isPinned ? "Unpin note" : "Pin note"}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body or Checklist */}
                  {isChecklistMode ? (
                    <div className="space-y-2">
                      <div className="space-y-1.5">
                        {checklistItems.map((item, idx) => (
                          <div key={item.id} className="flex items-center gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setChecklistItems((prev) =>
                                  prev.map((it) => (it.id === item.id ? { ...it, done: !it.done } : it))
                                );
                              }}
                              className="text-slate-400 hover:text-amber-400"
                            >
                              {item.done ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4" />}
                            </button>
                            <span className={item.done ? "line-through text-slate-500" : "text-slate-200"}>
                              {item.text}
                            </span>
                            <button
                              type="button"
                              onClick={() => setChecklistItems((prev) => prev.filter((_, i) => i !== idx))}
                              className="ml-auto text-slate-500 hover:text-rose-400"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={newChecklistText}
                          onChange={(e) => setNewChecklistText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newChecklistText.trim()) {
                              e.preventDefault();
                              setChecklistItems((prev) => [
                                ...prev,
                                { id: `item-${Date.now()}`, text: newChecklistText.trim(), done: false },
                              ]);
                              setNewChecklistText("");
                            }
                          }}
                          placeholder="List item (Press Enter to add)..."
                          className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <textarea
                      rows={3}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Take a note..."
                      className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
                    />
                  )}

                  {/* Labels input */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={labels}
                      onChange={(e) => setLabels(e.target.value)}
                      placeholder="Add labels (e.g. Work, Ideas, Project Astra)..."
                      className="w-full bg-transparent text-[11px] text-slate-300 placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  {/* Toolbar & Color Selector */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      {/* Color Palette */}
                      <div className="flex items-center gap-1">
                        {KEEP_COLORS.map((col) => (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() => setSelectedColor(col.id)}
                            className={`w-4 h-4 rounded-full border ${col.border} ${col.bg} transition ${
                              selectedColor === col.id ? "scale-125 ring-2 ring-white/50" : "hover:scale-110"
                            }`}
                            title={col.name}
                          />
                        ))}
                      </div>

                      {/* Toggle Checklist */}
                      <button
                        type="button"
                        onClick={() => setIsChecklistMode(!isChecklistMode)}
                        className={`p-1.5 rounded-lg text-xs transition ${
                          isChecklistMode ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Toggle Checklist"
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddNote}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsExpanded(true)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
                >
                  <span className="text-xs text-slate-400 font-medium">Take a note...</span>
                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsChecklistMode(true);
                        setIsExpanded(true);
                      }}
                      className="p-1 rounded-lg hover:text-slate-200"
                      title="New list"
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search bar over notes */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, labels, or checklists..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Pin className="w-3 h-3 text-amber-400" />
                Pinned Notes ({pinnedNotes.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pinnedNotes.map((note) => renderNoteCard(note))}
              </div>
            </div>
          )}

          {/* Other Notes Section */}
          <div className="space-y-3">
            {pinnedNotes.length > 0 && otherNotes.length > 0 && (
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Other Notes ({otherNotes.length})
              </span>
            )}
            {otherNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {otherNotes.map((note) => renderNoteCard(note))}
              </div>
            ) : pinnedNotes.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-2">
                <StickyNote className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-300">No notes found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Create your first note above. All notes are instantly saved and synchronized with Firebase Firestore.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* Alphabet & Google Ecosystem Directory View */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Complete Alphabet Inc. & Google LLC Portfolio</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Comprehensive directory of consumer apps, AI models, enterprise cloud, hardware & moonshot subsidiaries.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                placeholder="Search Google apps & subsidiaries..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-6">
            {ALPHABET_ECOSYSTEM.map((cat, idx) => {
              const matchedItems = cat.items.filter((item) => {
                if (!directorySearch.trim()) return true;
                const q = directorySearch.toLowerCase();
                return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
              });

              if (matchedItems.length === 0) return null;

              return (
                <div key={idx} className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{cat.category}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {matchedItems.map((item, i) => (
                      <a
                        key={i}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-left transition group shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition">
                              {item.name}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition" />
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                        <div className="mt-2 text-[9px] font-mono text-cyan-500/80">Official Endpoint →</div>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Note Assistant Modal */}
      {aiNoteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Gemini AI Note Intelligence: &ldquo;{aiNoteTarget.title}&rdquo;
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAiNoteTarget(null);
                  setAiResult(null);
                }}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleRunAiAssistant("summarize")}
                disabled={aiProcessing}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/40 text-slate-200 text-left transition flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Summarize Key Points</span>
              </button>

              <button
                type="button"
                onClick={() => handleRunAiAssistant("checklist")}
                disabled={aiProcessing}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/40 text-slate-200 text-left transition flex items-center gap-2"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Extract Checklist Items</span>
              </button>

              <button
                type="button"
                onClick={() => handleRunAiAssistant("expand")}
                disabled={aiProcessing}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-left transition flex items-center gap-2"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Brainstorm Next Steps</span>
              </button>

              <button
                type="button"
                onClick={() => handleRunAiAssistant("translate")}
                disabled={aiProcessing}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-purple-500/20 border border-slate-700 hover:border-purple-500/40 text-slate-200 text-left transition flex items-center gap-2"
              >
                <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Translate (Hindi/Spanish)</span>
              </button>
            </div>

            {/* AI Result Area */}
            {aiProcessing ? (
              <div className="p-6 text-center space-y-2">
                <RefreshCw className="w-5 h-5 text-amber-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Synthesizing note with Gemini 3.8 Flash...</p>
              </div>
            ) : aiResult ? (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-amber-300">AI Generated Output:</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(aiResult);
                      setCopiedId("ai_res");
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedId === "ai_res" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === "ai_res" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {aiResult}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );

  // Helper to render an individual note card
  function renderNoteCard(note: KeepNote) {
    const colObj = KEEP_COLORS.find((c) => c.id === note.color) || KEEP_COLORS[0];

    return (
      <div
        key={note.id}
        className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-xl group flex flex-col justify-between ${colObj.bg} ${colObj.border}`}
      >
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-bold text-slate-100 leading-snug">{note.title}</h4>
            <button
              type="button"
              onClick={() => handleTogglePin(note)}
              className={`p-1 rounded-md transition ${
                note.pinned ? "text-amber-400" : "text-slate-500 opacity-0 group-hover:opacity-100 hover:text-slate-200"
              }`}
              title={note.pinned ? "Unpin note" : "Pin note"}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content */}
          {note.content && (
            <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-6">
              {note.content}
            </p>
          )}

          {/* Checklist if present */}
          {note.checklist && note.checklist.length > 0 && (
            <div className="space-y-1 pt-1">
              {note.checklist.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleChecklistItem(note, item.id)}
                    className="text-slate-400 hover:text-amber-400"
                  >
                    {item.done ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
                  </button>
                  <span className={item.done ? "line-through text-slate-500 text-[11px]" : "text-slate-200 text-[11px]"}>
                    {item.text}
                  </span>
                </div>
              ))}
              {note.checklist.length > 5 && (
                <span className="text-[10px] text-slate-400">+{note.checklist.length - 5} more items</span>
              )}
            </div>
          )}

          {/* Labels badge */}
          {note.labels && (
            <div className="pt-1 flex flex-wrap gap-1">
              {note.labels.split(",").map((lbl, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-slate-950/70 border border-slate-700/60 text-[10px] font-mono text-slate-300"
                >
                  #{lbl.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action footer */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-slate-400 opacity-80 group-hover:opacity-100 transition">
          <div className="flex items-center gap-1">
            {/* AI Assistant button */}
            <button
              type="button"
              onClick={() => {
                setAiNoteTarget(note);
                setAiResult(null);
              }}
              className="p-1 rounded-md hover:bg-slate-800/80 hover:text-amber-300 transition"
              title="Transform with Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            {/* Copy button */}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`${note.title}\n\n${note.content || ""}`);
                setCopiedId(note.id);
                setTimeout(() => setCopiedId(null), 2000);
              }}
              className="p-1 rounded-md hover:bg-slate-800/80 hover:text-slate-200 transition"
              title="Copy note"
            >
              {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleDeleteNote(note.id)}
            className="p-1 rounded-md hover:bg-slate-800/80 hover:text-rose-400 transition"
            title="Delete note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }
};
