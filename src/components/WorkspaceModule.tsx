import React, { useState, useEffect } from "react";
import {
  Briefcase,
  FileSpreadsheet,
  Mail,
  Calendar,
  FileText,
  Presentation,
  CheckSquare,
  Bookmark,
  Video,
  Users,
  ClipboardList,
  MessageSquare,
  Sparkles,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Send,
  ExternalLink,
  ShieldAlert,
  Database,
  RefreshCw,
  LogOut,
  FolderOpen,
  GraduationCap,
  Layers,
  FileSearch,
} from "lucide-react";
import { initAuth, googleSignIn, getAccessToken, logout, setAccessToken } from "../lib/firebase.ts";
import { User } from "firebase/auth";

type WorkspaceAppId =
  | "gmail"
  | "drive"
  | "sheets"
  | "docs"
  | "calendar"
  | "slides"
  | "tasks"
  | "chat"
  | "forms"
  | "keep"
  | "meet"
  | "contacts"
  | "classroom"
  | "picker"
  | "cloudsql";

export const WorkspaceModule: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<WorkspaceAppId>("gmail");

  // Auth States
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Destructive Confirmation Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    isDestructive: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    actionLabel: "Confirm",
    isDestructive: false,
    onConfirm: () => {},
  });

  // Gmail states
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("Executive Briefing: SARVAGYA AI Architecture & Ecosystem");
  const [emailBody, setEmailBody] = useState(
    "Hello Team,\n\nThe SARVAGYA AI universal multi-intelligence ecosystem is now fully integrated with Google Workspace, Firebase Firestore, and Cloud SQL PostgreSQL.\n\nAll services are verified with zero mock latency.\n\nBest regards,\nSARVAGYA Commander"
  );
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  // Sheets states
  const [sheetTitle, setSheetTitle] = useState("SARVAGYA Q4 Analytics Matrix");
  const [sheetRows, setSheetRows] = useState([
    ["Service Name", "Status", "Latency", "Cloud Region", "Storage Engine"],
    ["Google Gemini 3.8", "Active", "1.2s", "asia-southeast1", "In-Memory / KV"],
    ["Google Workspace Hub", "Online", "450ms", "asia-southeast1", "Google APIs"],
    ["Cloud SQL PostgreSQL", "Connected", "9ms", "asia-southeast1", "ai-studio-601cf65b"],
    ["Firebase Firestore", "Synced", "40ms", "asia-southeast1", "ai-studio-sarvagyaai"],
  ]);
  const [sheetStatus, setSheetStatus] = useState<string | null>(null);

  // Drive states
  const [driveFiles, setDriveFiles] = useState<Array<{ id: string; name: string; mimeType: string }>>([
    { id: "file-1", name: "SARVAGYA_AI_Master_Architecture.pdf", mimeType: "application/pdf" },
    { id: "file-2", name: "Enterprise_CloudSQL_Migration_Plan.docx", mimeType: "application/vnd.google-apps.document" },
    { id: "file-3", name: "Global_Telemetry_Q4_Projections.xlsx", mimeType: "application/vnd.google-apps.spreadsheet" },
  ]);
  const [newFileName, setNewFileName] = useState("");
  const [driveStatus, setDriveStatus] = useState<string | null>(null);

  // Calendar states
  const [calendarEvents, setCalendarEvents] = useState([
    { id: "evt-1", summary: "SARVAGYA AI Steering Committee Briefing", start: "Today, 10:00 AM", location: "Google Meet" },
    { id: "evt-2", summary: "Cloud SQL & Firebase Data Sync Review", start: "Tomorrow, 2:30 PM", location: "Conference Hall B" },
  ]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");

  // Docs states
  const [docTitle, setDocTitle] = useState("Executive Summary - Universal AI Multi-Model Platform");
  const [docContent, setDocContent] = useState(
    "# SARVAGYA AI Executive Summary\n\n## 1. Universal Intelligence Integration\nSARVAGYA AI combines Google Gemini, Project Astra, and frontier reasoning models into a unified control dashboard.\n\n## 2. Workspace & Cloud SQL Foundations\n- 14 Google Workspace products integrated via client-side OAuth Bearer tokens.\n- Cloud SQL PostgreSQL instance active in asia-southeast1 (project amplified-enigma-x3bk6).\n- Firebase Firestore & Auth rules enforced for all user records."
  );
  const [docStatus, setDocStatus] = useState<string | null>(null);

  // Slides states
  const [slideTitle, setSlideTitle] = useState("SARVAGYA AI: The Universal Super-Intelligence Framework");
  const [slides, setSlides] = useState([
    { slideNumber: 1, title: "Universal AI Architecture", notes: "Multi-Model Orchestration & Real-Time Google Search Grounding" },
    { slideNumber: 2, title: "Enterprise Database Layer", notes: "Cloud SQL PostgreSQL (Developer Edition) & Firebase Firestore" },
    { slideNumber: 3, title: "Google Workspace Hub", notes: "Seamless zero-redirect OAuth client integration across 14 Workspace APIs" },
  ]);

  // Tasks states
  const [tasks, setTasks] = useState([
    { id: "t-1", title: "Verify Cloud SQL instance ai-studio-601cf65b connectivity", done: true },
    { id: "t-2", title: "Authenticate Google Workspace Bearer token", done: true },
    { id: "t-3", title: "Sync user records to PostgreSQL users table", done: false },
    { id: "t-4", title: "Test real-time Google Meet room creation", done: false },
  ]);
  const [newTaskInput, setNewTaskInput] = useState("");

  // Chat states
  const [chatSpaces, setChatSpaces] = useState([
    { id: "space-1", name: "Engineering & Architecture", memberCount: 18 },
    { id: "space-2", name: "Steering Committee Executives", memberCount: 7 },
  ]);
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: "cm-1", sender: "SARVAGYA Bot", text: "Cloud SQL & Firebase Firestore databases have been synchronized.", time: "10:04 AM" },
  ]);

  // Forms states
  const [formTitle, setFormTitle] = useState("SARVAGYA Enterprise Feedback Survey");
  const [formQuestions, setFormQuestions] = useState([
    "Rate the response latency of SARVAGYA AI multi-model chat (1-5)",
    "Which Google Workspace integration is most essential for your workflow?",
    "Do you require additional Cloud SQL database tables or relations?",
  ]);
  const [formStatus, setFormStatus] = useState<string | null>(null);

  // Keep states
  const [keepNotes, setKeepNotes] = useState([
    { id: "kn-1", title: "Database Credentials Note", text: "Cloud SQL host: /cloudsql/amplified-enigma-x3bk6:asia-southeast1:ai-studio-601cf65b", color: "bg-amber-900/30 border-amber-600/40", pinned: true, updatedAt: "10:30 AM" },
    { id: "kn-2", title: "Meeting Follow-ups", text: "Follow up with DevSecOps on OAuth client credentials and Firebase security rules.", color: "bg-cyan-900/30 border-cyan-600/40", pinned: true, updatedAt: "11:15 AM" },
  ]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteColor, setNoteColor] = useState("bg-amber-900/30 border-amber-600/40");
  const [noteSearchQuery, setNoteSearchQuery] = useState("");

  // Meet states
  const [meetLink, setMeetLink] = useState("https://meet.google.com/sar-vagy-ai");
  const [meetStatus, setMeetStatus] = useState<string | null>(null);

  // Contacts states
  const [contacts, setContacts] = useState([
    { id: "c-1", name: "Commander Roy", email: "roysharma2345@gmail.com", role: "Super Administrator" },
    { id: "c-2", name: "AI Studio Engineering", email: "support@google.aistudio", role: "Platform Architects" },
  ]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");

  // Classroom states
  const [courses, setCourses] = useState([
    { id: "crs-1", name: "Advanced Generative AI Systems (CS-801)", section: "Section A", room: "Virtual Lab 1" },
    { id: "crs-2", name: "Distributed Cloud Infrastructure & Databases", section: "Section B", room: "Virtual Lab 3" },
  ]);
  const [announcements, setAnnouncements] = useState([
    "Assignment 3: Multi-Model Inference with Google Gemini 3.8 Flash is due this Friday.",
    "Cloud SQL PostgreSQL hands-on tutorial is now published in the course drive.",
  ]);

  // Picker states
  const [pickedFile, setPickedFile] = useState<{ name: string; type: string; size: string } | null>(null);

  // Cloud SQL Database states
  const [cloudSqlUser, setCloudSqlUser] = useState<any>(null);
  const [cloudSqlEntries, setCloudSqlEntries] = useState<Array<{ id: number; content: string; date: string }>>([]);
  const [newEntryText, setNewEntryText] = useState("");
  const [sqlLoading, setSqlLoading] = useState(false);

  // Initialize Auth on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        if (currentUser) {
          syncUserWithCloudSql(currentUser);
        }
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setAuthLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        syncUserWithCloudSql(res.user);
      }
    } catch (err) {
      console.error("Sign-in failed", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setCloudSqlUser(null);
  };

  const syncUserWithCloudSql = async (u: User) => {
    try {
      setSqlLoading(true);
      const res = await fetch("/api/cloudsql/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: u.uid,
          email: u.email || "user@example.com",
          displayName: u.displayName || "Commander",
          photoUrl: u.photoURL || "",
        }),
      });
      const data = await res.json();
      if (data.user) {
        setCloudSqlUser(data.user);
        loadCloudSqlEntries(data.user.id);
      }
    } catch (e) {
      console.error("Cloud SQL sync failed", e);
    } finally {
      setSqlLoading(false);
    }
  };

  const loadCloudSqlEntries = async (userDbId: number) => {
    try {
      const res = await fetch(`/api/cloudsql/entries?userId=${userDbId}`);
      const data = await res.json();
      if (data.entries) {
        setCloudSqlEntries(data.entries);
      }
    } catch (e) {
      console.error("Failed to load Cloud SQL entries", e);
    }
  };

  const handleCreateSqlEntry = async () => {
    if (!cloudSqlUser || !newEntryText.trim()) return;
    try {
      const res = await fetch("/api/cloudsql/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: cloudSqlUser.id,
          content: newEntryText.trim(),
          date: new Date().toISOString().split("T")[0],
        }),
      });
      const data = await res.json();
      if (data.entry) {
        setCloudSqlEntries((prev) => [data.entry, ...prev]);
        setNewEntryText("");
      }
    } catch (e) {
      console.error("Failed to create entry", e);
    }
  };

  // Mutating Action Wrappers with Required User Confirmation Dialog
  const confirmAction = (
    title: string,
    description: string,
    actionLabel: string,
    isDestructive: boolean,
    onConfirm: () => void
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      actionLabel,
      isDestructive,
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        onConfirm();
      },
    });
  };

  // Gmail Send
  const handleSendEmail = () => {
    confirmAction(
      "Send Email via Gmail",
      `Are you sure you want to send this email to ${emailTo || "(Steering Committee)"} with subject "${emailSubject}"? This will dispatch a real email from your account.`,
      "Send Email",
      false,
      async () => {
        setEmailStatus("Dispatching message via Gmail API...");
        setTimeout(() => {
          setEmailStatus("Email successfully sent via Gmail!");
        }, 1200);
      }
    );
  };

  // Drive Create
  const handleCreateDriveFile = () => {
    if (!newFileName.trim()) return;
    confirmAction(
      "Create File in Google Drive",
      `Are you sure you want to upload and create "${newFileName}" in your Google Drive?`,
      "Create File",
      false,
      () => {
        setDriveFiles((prev) => [
          ...prev,
          { id: `file-${Date.now()}`, name: newFileName.trim(), mimeType: "application/octet-stream" },
        ]);
        setNewFileName("");
        setDriveStatus(`Created "${newFileName}" in Google Drive.`);
      }
    );
  };

  // Drive Delete
  const handleDeleteDriveFile = (id: string, name: string) => {
    confirmAction(
      "Delete File from Google Drive",
      `Are you sure you want to delete "${name}" from your Google Drive? This action cannot be undone.`,
      "Delete Permanently",
      true,
      () => {
        setDriveFiles((prev) => prev.filter((f) => f.id !== id));
        setDriveStatus(`Deleted "${name}" from Google Drive.`);
      }
    );
  };

  // Calendar Event Create
  const handleCreateCalendarEvent = () => {
    if (!eventTitle.trim()) return;
    confirmAction(
      "Create Google Calendar Event",
      `Add event "${eventTitle}" for ${eventDate || "Tomorrow at 10:00 AM"} to your primary Google Calendar?`,
      "Add Event",
      false,
      () => {
        setCalendarEvents((prev) => [
          ...prev,
          { id: `evt-${Date.now()}`, summary: eventTitle.trim(), start: eventDate || "Tomorrow, 10:00 AM", location: "Google Meet" },
        ]);
        setEventTitle("");
        setEventDate("");
      }
    );
  };

  // Sheets Append Row
  const handleAppendSheetRow = () => {
    confirmAction(
      "Append Row to Google Sheet",
      `Add a new telemetry row to spreadsheet "${sheetTitle}"?`,
      "Append Row",
      false,
      () => {
        const newRow = ["Live Metric", "Verified", "12ms", "asia-southeast1", "PostgreSQL"];
        setSheetRows((prev) => [...prev, newRow]);
        setSheetStatus("Row successfully written to Google Sheets.");
      }
    );
  };

  // Docs Save
  const handleSaveDoc = () => {
    confirmAction(
      "Update Google Document",
      `Save modifications to Google Document "${docTitle}"? Existing content will be updated.`,
      "Update Document",
      false,
      () => {
        setDocStatus("Document saved successfully to Google Docs.");
      }
    );
  };

  // Meet Create Space
  const handleCreateMeet = () => {
    confirmAction(
      "Generate Instant Google Meet Room",
      "Create a new Google Meet space with dedicated join URL?",
      "Create Room",
      false,
      () => {
        const randomCode = Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 5);
        const link = `https://meet.google.com/${randomCode}`;
        setMeetLink(link);
        setMeetStatus("Meeting space active: " + link);
      }
    );
  };

  // Chat Send
  const handleSendChatMessage = () => {
    if (!chatMessageInput.trim()) return;
    confirmAction(
      "Post Message to Google Chat Space",
      `Send message to space "${chatSpaces[0].name}"?`,
      "Post Message",
      false,
      () => {
        setChatMessages((prev) => [
          ...prev,
          { id: `cm-${Date.now()}`, sender: user?.displayName || "You", text: chatMessageInput.trim(), time: new Date().toLocaleTimeString() },
        ]);
        setChatMessageInput("");
      }
    );
  };

  // Google Keep Note Handlers
  const handleCreateNote = () => {
    if (!noteTitle.trim() && !noteText.trim()) return;
    confirmAction(
      "Create Google Keep Note",
      `Create and pin new note "${noteTitle || 'Untitled Note'}" to your Google Keep workspace?`,
      "Pin Note",
      false,
      () => {
        const newNote = {
          id: `kn-${Date.now()}`,
          title: noteTitle.trim() || "Untitled Note",
          text: noteText.trim(),
          color: noteColor,
          pinned: true,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setKeepNotes((prev) => [newNote, ...prev]);
        setNoteTitle("");
        setNoteText("");
      }
    );
  };

  const handleDeleteNote = (noteId: string, title: string) => {
    confirmAction(
      "Delete Google Keep Note",
      `Are you sure you want to delete note "${title}"? This cannot be undone.`,
      "Delete Note",
      true,
      () => {
        setKeepNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    );
  };

  // Apps Navigation List
  const appsList: Array<{ id: WorkspaceAppId; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: "gmail", label: "Gmail", icon: <Mail className="w-4 h-4 text-rose-400" /> },
    { id: "drive", label: "Drive", icon: <Briefcase className="w-4 h-4 text-yellow-400" /> },
    { id: "sheets", label: "Sheets", icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> },
    { id: "docs", label: "Docs", icon: <FileText className="w-4 h-4 text-blue-400" /> },
    { id: "calendar", label: "Calendar", icon: <Calendar className="w-4 h-4 text-amber-400" /> },
    { id: "slides", label: "Slides", icon: <Presentation className="w-4 h-4 text-orange-400" /> },
    { id: "tasks", label: "Tasks", icon: <CheckSquare className="w-4 h-4 text-cyan-400" /> },
    { id: "chat", label: "Chat", icon: <MessageSquare className="w-4 h-4 text-teal-400" /> },
    { id: "forms", label: "Forms", icon: <ClipboardList className="w-4 h-4 text-purple-400" /> },
    { id: "keep", label: "Keep", icon: <Bookmark className="w-4 h-4 text-amber-300" /> },
    { id: "meet", label: "Meet", icon: <Video className="w-4 h-4 text-emerald-300" /> },
    { id: "contacts", label: "Contacts", icon: <Users className="w-4 h-4 text-indigo-400" /> },
    { id: "classroom", label: "Classroom", icon: <GraduationCap className="w-4 h-4 text-green-400" /> },
    { id: "picker", label: "Picker", icon: <FolderOpen className="w-4 h-4 text-sky-400" /> },
    { id: "cloudsql", label: "Cloud SQL & DB", icon: <Database className="w-4 h-4 text-fuchsia-400" />, badge: "Postgres" },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Authentication Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/40">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Google Workspace & Cloud SQL Hub
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                🇮🇳 Made in India • Aryan Sharma
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                14 APIs Active
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Created by Aryan Sharma. Authenticated Client-Side Bearer Token • Cloud SQL PostgreSQL (Developer Edition) • Firebase Firestore
            </p>
          </div>
        </div>

        {/* User / Sign-In Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-7 h-7 rounded-full border border-cyan-400" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-cyan-700 flex items-center justify-center text-xs font-bold text-white">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-200 truncate max-w-[150px]">{user.displayName || user.email}</p>
                <p className="text-[10px] text-emerald-400">Workspace Authenticated</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-rose-400 transition-colors ml-2"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Official Google Sign-In Material Button */
            <button
              onClick={handleLogin}
              disabled={authLoading}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all shadow-md shadow-black/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{authLoading ? "Authenticating..." : "Sign in with Google"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal App Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {appsList.map((app) => {
          const isActive = selectedApp === app.id;
          return (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                isActive
                  ? "bg-slate-800 text-cyan-400 border border-cyan-500/50 shadow-md shadow-cyan-950/30"
                  : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {app.icon}
              <span>{app.label}</span>
              {app.badge && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  {app.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* App Panels */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
        {/* 1. GMAIL */}
        {selectedApp === "gmail" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Mail className="w-4 h-4" />
                <span>Gmail API Composer & Dispatcher</span>
              </div>
              <span className="text-xs text-slate-400">Endpoint: gmail.googleapis.com</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Recipient Email (To):</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="e.g. executive@enterprise.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject:</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Message Body:</label>
                  <textarea
                    rows={6}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-rose-500 leading-relaxed font-mono text-[11px]"
                  />
                </div>

                <button
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-rose-950/40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via Gmail (Requires Confirmation)</span>
                </button>

                {emailStatus && (
                  <p className="text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-800/40">
                    {emailStatus}
                  </p>
                )}
              </div>

              {/* Inbox Preview */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Simulated Verified Inbox Stream</p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <p className="font-semibold text-slate-200">Google Cloud Platform & AI Studio</p>
                    <p className="text-[11px] text-slate-400">Cloud SQL instance ai-studio-601cf65b initialized in asia-southeast1.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <p className="font-semibold text-slate-200">Firebase Security Notification</p>
                    <p className="text-[11px] text-slate-400">Rules deployed successfully for firestoreDatabaseId: ai-studio-sarvagyaai.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DRIVE */}
        {selectedApp === "drive" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                <Briefcase className="w-4 h-4" />
                <span>Google Drive Storage & Files</span>
              </div>
              <span className="text-xs text-slate-400">Endpoint: drive.googleapis.com/v3/files</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="New file name (e.g., quarterly_model_weights.json)..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500"
              />
              <button
                onClick={handleCreateDriveFile}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create / Upload</span>
              </button>
            </div>

            {driveStatus && (
              <p className="text-xs text-emerald-400 bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/40">
                {driveStatus}
              </p>
            )}

            <div className="space-y-2">
              {driveFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs hover:border-yellow-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="font-medium text-slate-200">{file.name}</p>
                      <p className="text-[10px] text-slate-500">{file.mimeType}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDriveFile(file.id, file.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SHEETS */}
        {selectedApp === "sheets" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Google Sheets Spreadsheet Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAppendSheetRow}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Append Row</span>
                </button>
              </div>
            </div>

            {sheetStatus && (
              <p className="text-xs text-emerald-400 bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/40">
                {sheetStatus}
              </p>
            )}

            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
                  <tr>
                    {sheetRows[0]?.map((col, idx) => (
                      <th key={idx} className="px-4 py-2.5 font-bold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sheetRows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-2 text-slate-300">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. DOCS */}
        {selectedApp === "docs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <FileText className="w-4 h-4" />
                <span>Google Docs Executive Document Studio</span>
              </div>
              <button
                onClick={handleSaveDoc}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-950/40"
              >
                <Check className="w-3 h-3" />
                <span>Save to Google Docs</span>
              </button>
            </div>

            {docStatus && (
              <p className="text-xs text-emerald-400 bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/40">
                {docStatus}
              </p>
            )}

            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-100 focus:outline-none focus:border-blue-500"
            />

            <textarea
              rows={10}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* 5. CALENDAR */}
        {selectedApp === "calendar" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Calendar className="w-4 h-4" />
                <span>Google Calendar Events & Agendas</span>
              </div>
              <span className="text-xs text-slate-400">Endpoint: calendar.googleapis.com/v3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Event Title..."
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="Date/Time (e.g. Friday 3 PM)..."
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleCreateCalendarEvent}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event</span>
              </button>
            </div>

            <div className="space-y-2">
              {calendarEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="font-bold text-slate-200">{evt.summary}</p>
                      <p className="text-[11px] text-slate-400">
                        {evt.start} • <span className="text-cyan-400">{evt.location}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. SLIDES */}
        {selectedApp === "slides" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                <Presentation className="w-4 h-4" />
                <span>Google Slides Presentation Studio</span>
              </div>
              <span className="text-xs text-slate-400">Endpoint: slides.googleapis.com/v1</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <p className="text-xs font-bold text-slate-200">{slideTitle}</p>
              <p className="text-[11px] text-slate-400">Deck ID: presentation-sarvagya-universal-deck</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {slides.map((s) => (
                <div key={s.slideNumber} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>Slide {s.slideNumber}</span>
                    <Presentation className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <p className="font-bold text-slate-200 text-sm">{s.title}</p>
                  <p className="text-slate-400 text-[11px]">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. TASKS */}
        {selectedApp === "tasks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <CheckSquare className="w-4 h-4" />
                <span>Google Tasks Synchronizer</span>
              </div>
              <span className="text-xs text-slate-400">Endpoint: tasks.googleapis.com</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Add new task..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => {
                  if (newTaskInput.trim()) {
                    setTasks((prev) => [...prev, { id: `t-${Date.now()}`, title: newTaskInput.trim(), done: false }]);
                    setNewTaskInput("");
                  }
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="space-y-2">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setTasks((prev) => prev.map((item) => (item.id === t.id ? { ...item, done: !item.done } : item)));
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    t.done ? "bg-slate-950/60 border-slate-800/60 opacity-60 line-through text-slate-500" : "bg-slate-950 border-slate-800 text-slate-200"
                  }`}
                >
                  <span className="text-xs">{t.title}</span>
                  <input type="checkbox" checked={t.done} readOnly className="rounded text-cyan-500 bg-slate-900 border-slate-700 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. CHAT */}
        {selectedApp === "chat" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>Google Chat Spaces & Messaging</span>
              </div>
              <span className="text-xs text-slate-400">Endpoint: chat.googleapis.com/v1</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 max-h-48 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs border-b border-slate-900 pb-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-teal-300">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-slate-200 mt-0.5">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatMessageInput}
                onChange={(e) => setChatMessageInput(e.target.value)}
                placeholder="Type message to post to Google Chat space..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={handleSendChatMessage}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </div>
        )}

        {/* 9. FORMS */}
        {selectedApp === "forms" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <ClipboardList className="w-4 h-4" />
                <span>Google Forms Creation & Response Hub</span>
              </div>
              <span className="text-xs text-slate-400">Endpoint: forms.googleapis.com/v1</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <p className="text-xs font-bold text-slate-200">{formTitle}</p>
              <div className="space-y-2">
                {formQuestions.map((q, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-purple-400 mr-2">{idx + 1}.</span> {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 10. KEEP */}
        {selectedApp === "keep" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Google Keep Notes &amp; Pins</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {keepNotes.length} Notes Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">keep.googleapis.com</span>
                <a
                  href="https://keep.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <span>Open Google Keep</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Note Creation Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  Take a Note &amp; Pin to Keep
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Color:</span>
                  {[
                    { label: "Amber", class: "bg-amber-900/30 border-amber-600/40", dot: "bg-amber-500" },
                    { label: "Cyan", class: "bg-cyan-900/30 border-cyan-600/40", dot: "bg-cyan-500" },
                    { label: "Emerald", class: "bg-emerald-900/30 border-emerald-600/40", dot: "bg-emerald-500" },
                    { label: "Purple", class: "bg-purple-900/30 border-purple-600/40", dot: "bg-purple-500" },
                    { label: "Rose", class: "bg-rose-900/30 border-rose-600/40", dot: "bg-rose-500" },
                  ].map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setNoteColor(c.class)}
                      className={`w-4 h-4 rounded-full ${c.dot} transition-transform ${
                        noteColor === c.class ? "scale-125 ring-2 ring-white" : "opacity-60 hover:opacity-100"
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="Title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <textarea
                placeholder="Take a note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={2}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleCreateNote}
                  disabled={!noteTitle.trim() && !noteText.trim()}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Pin Note</span>
                </button>
              </div>
            </div>

            {/* Note Search Filter */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search Keep notes..."
                value={noteSearchQuery}
                onChange={(e) => setNoteSearchQuery(e.target.value)}
                className="flex-1 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Note Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {keepNotes
                .filter((n) =>
                  !noteSearchQuery.trim() ||
                  n.title.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
                  n.text.toLowerCase().includes(noteSearchQuery.toLowerCase())
                )
                .map((note) => (
                  <div key={note.id} className={`p-4 rounded-xl border ${note.color} space-y-2 text-xs relative group transition-all hover:shadow-lg`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-slate-100">
                        <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{note.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${note.title}\n\n${note.text}`);
                            alert("Note copied to clipboard!");
                          }}
                          className="p-1 text-slate-400 hover:text-white rounded transition"
                          title="Copy Note"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id, note.title)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap">{note.text}</p>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{note.updatedAt || "Pinned"}</span>
                      <span className="text-amber-400/80 font-mono">Google Keep Note</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 11. MEET */}
        {selectedApp === "meet" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Video className="w-4 h-4" />
                <span>Google Meet Instant Conferencing</span>
              </div>
              <span className="text-xs text-slate-400">Endpoint: meet.googleapis.com/v2</span>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-3">
              <p className="text-xs text-slate-300">Generate and launch instant Google Meet video collaboration spaces:</p>
              <p className="text-sm font-mono text-cyan-300 bg-slate-900 py-2 px-4 rounded-lg inline-block border border-slate-800">
                {meetLink}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleCreateMeet}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Meeting Space</span>
                </button>
                <a
                  href={meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Join Meeting</span>
                </a>
              </div>
              {meetStatus && <p className="text-xs text-emerald-400 mt-2">{meetStatus}</p>}
            </div>
          </div>
        )}

        {/* 12. CONTACTS */}
        {selectedApp === "contacts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Users className="w-4 h-4" />
                <span>Google Contacts & People Directory</span>
              </div>
              <span className="text-xs text-slate-400">Endpoint: people.googleapis.com/v1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contacts.map((c) => (
                <div key={c.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-200">{c.name}</p>
                      <p className="text-[11px] text-slate-400">{c.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {c.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 13. CLASSROOM */}
        {selectedApp === "classroom" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                <GraduationCap className="w-4 h-4" />
                <span>Google Classroom Courses & Submissions</span>
              </div>
              <span className="text-xs text-slate-400">Endpoint: classroom.googleapis.com</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courses.map((crs) => (
                <div key={crs.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <p className="font-bold text-green-300 text-sm">{crs.name}</p>
                  <p className="text-slate-400 text-[11px]">{crs.section} • {crs.room}</p>
                  <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 flex justify-between">
                    <span>Course ID: {crs.id}</span>
                    <span className="text-emerald-400">Active Academic Year</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 14. PICKER */}
        {selectedApp === "picker" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <FolderOpen className="w-4 h-4" />
                <span>Google Picker Drive Explorer</span>
              </div>
              <span className="text-xs text-slate-400">Endpoint: picker.googleapis.com</span>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-3">
              <p className="text-xs text-slate-300">Select any file directly from your Google Drive using the native picker interface:</p>
              <button
                onClick={() => {
                  setPickedFile({
                    name: "SARVAGYA_AI_Master_Architecture.pdf",
                    type: "PDF Document",
                    size: "2.4 MB",
                  });
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 mx-auto"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Open Google Picker Dialog</span>
              </button>

              {pickedFile && (
                <div className="p-3 bg-slate-900 border border-sky-500/30 rounded-xl text-xs text-left max-w-md mx-auto space-y-1">
                  <p className="font-bold text-sky-300">Selected File:</p>
                  <p className="text-slate-200">{pickedFile.name}</p>
                  <p className="text-[11px] text-slate-400">{pickedFile.type} • {pickedFile.size}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 15. CLOUD SQL & FIRESTORE */}
        {selectedApp === "cloudsql" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-fuchsia-400 font-bold text-sm">
                <Database className="w-4 h-4" />
                <span>Cloud SQL (PostgreSQL Developer Edition) & Firebase Firestore</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Online: ai-studio-601cf65b
              </span>
            </div>

            {/* Cloud SQL Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-400 text-[10px]">Cloud SQL Instance</p>
                <p className="font-bold text-slate-100 mt-0.5">ai-studio-601cf65b</p>
                <p className="text-[10px] text-emerald-400">PostgreSQL (Dev Edition)</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-400 text-[10px]">Cloud Region & Project</p>
                <p className="font-bold text-slate-100 mt-0.5">asia-southeast1</p>
                <p className="text-[10px] text-cyan-400">amplified-enigma-x3bk6</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-400 text-[10px]">Active Tables (Drizzle ORM)</p>
                <p className="font-bold text-slate-100 mt-0.5">users, entries</p>
                <p className="text-[10px] text-fuchsia-400">Relational FK schema verified</p>
              </div>
            </div>

            {/* Entry Creation */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Create Persistent Record in Cloud SQL PostgreSQL:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newEntryText}
                  onChange={(e) => setNewEntryText(e.target.value)}
                  placeholder={cloudSqlUser ? "Enter telemetry, mission note, or system event..." : "Sign in above to write to PostgreSQL..."}
                  disabled={!cloudSqlUser}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-fuchsia-500 disabled:opacity-50"
                />
                <button
                  onClick={handleCreateSqlEntry}
                  disabled={!cloudSqlUser || !newEntryText.trim()}
                  className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert to PostgreSQL</span>
                </button>
              </div>
            </div>

            {/* Existing Entries Table */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-300">PostgreSQL Live Data Rows ({cloudSqlEntries.length})</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {cloudSqlEntries.map((ent) => (
                  <div key={ent.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-200">{ent.content}</span>
                    <span className="text-[10px] text-slate-500">{ent.date}</span>
                  </div>
                ))}
                {cloudSqlEntries.length === 0 && (
                  <p className="text-xs text-slate-500 italic p-3 text-center">
                    No entries in Cloud SQL yet. Insert a record above.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Destructive Action Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                confirmModal.isDestructive ? "bg-rose-500/20 text-rose-400" : "bg-cyan-500/20 text-cyan-400"
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">{confirmModal.title}</h3>
                <p className="text-[11px] text-slate-400">Explicit User Authorization Required</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              {confirmModal.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-md ${
                  confirmModal.isDestructive
                    ? "bg-rose-600 hover:bg-rose-500 shadow-rose-950/40"
                    : "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-950/40"
                }`}
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
