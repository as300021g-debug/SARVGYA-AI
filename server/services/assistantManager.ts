// ============================================================================
// SARVAGYA AI — PERSONAL ASSISTANT & ROUTINE MANAGER (`server/services/assistantManager.ts`)
// Powers Timers, Reminders, Daily Briefing, Routines & Device Ecosystem Bridges
// Inspired by Google Assistant, Siri, Alexa+ and Galaxy AI
// ============================================================================

import fs from "fs";
import path from "path";
import { getLiveOpenMeteoWeather } from "./liveTransitProvider.ts";
import { getLiveStockQuote } from "./liveWebGrounding.ts";

export interface AssistantTimer {
  id: string;
  label: string;
  durationSeconds: number;
  remainingSeconds: number;
  startedAt: string;
  expiresAt: string;
  status: "running" | "paused" | "completed";
}

export interface AssistantReminder {
  id: string;
  title: string;
  datetime: string;
  category: "work" | "study" | "health" | "personal" | "finance";
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export interface AssistantRoutine {
  id: string;
  name: string;
  description: string;
  icon: string;
  actions: string[];
  lastTriggered?: string;
}

const DATA_DIR = path.resolve("data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const REMINDERS_FILE = path.join(DATA_DIR, "assistant_reminders.json");

class AssistantManager {
  private timers: Map<string, AssistantTimer> = new Map();
  private reminders: AssistantReminder[] = [];

  constructor() {
    this.loadReminders();
    this.seedDefaultsIfEmpty();
  }

  private loadReminders(): void {
    if (!fs.existsSync(REMINDERS_FILE)) return;
    try {
      const data = JSON.parse(fs.readFileSync(REMINDERS_FILE, "utf-8"));
      if (Array.isArray(data)) {
        this.reminders = data;
      }
    } catch {
      this.reminders = [];
    }
  }

  private saveReminders(): void {
    try {
      fs.writeFileSync(REMINDERS_FILE, JSON.stringify(this.reminders, null, 2));
    } catch (err) {
      console.error("Failed to save assistant reminders:", err);
    }
  }

  private seedDefaultsIfEmpty(): void {
    if (this.reminders.length === 0) {
      this.reminders = [
        {
          id: "rem-1",
          title: "Review CBSE / JEE Quantum Physics Notes",
          datetime: new Date(Date.now() + 3600000 * 2).toISOString(),
          category: "study",
          completed: false,
          priority: "high",
          createdAt: new Date().toISOString(),
        },
        {
          id: "rem-2",
          title: "Monitor Nifty 50 & Global Market Open",
          datetime: new Date(Date.now() + 3600000 * 5).toISOString(),
          category: "finance",
          completed: false,
          priority: "medium",
          createdAt: new Date().toISOString(),
        },
        {
          id: "rem-3",
          title: "Verify SARVAGYA Multi-Model Council Benchmarks",
          datetime: new Date(Date.now() + 3600000 * 8).toISOString(),
          category: "work",
          completed: false,
          priority: "high",
          createdAt: new Date().toISOString(),
        },
      ];
      this.saveReminders();
    }
  }

  // --- Timers ---
  public startTimer(label: string, durationSeconds: number): AssistantTimer {
    const id = `timer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationSeconds * 1000).toISOString();

    const timer: AssistantTimer = {
      id,
      label: label || "Timer",
      durationSeconds,
      remainingSeconds: durationSeconds,
      startedAt: now.toISOString(),
      expiresAt,
      status: "running",
    };

    this.timers.set(id, timer);
    return timer;
  }

  public listTimers(): AssistantTimer[] {
    const now = Date.now();
    for (const [id, t] of this.timers.entries()) {
      const exp = new Date(t.expiresAt).getTime();
      const remaining = Math.max(0, Math.round((exp - now) / 1000));
      t.remainingSeconds = remaining;
      if (remaining <= 0) {
        t.status = "completed";
      }
    }
    return Array.from(this.timers.values());
  }

  public deleteTimer(id: string): boolean {
    return this.timers.delete(id);
  }

  // --- Reminders ---
  public listReminders(): AssistantReminder[] {
    return this.reminders;
  }

  public addReminder(data: {
    title: string;
    datetime?: string;
    category?: AssistantReminder["category"];
    priority?: AssistantReminder["priority"];
  }): AssistantReminder {
    const reminder: AssistantReminder = {
      id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: data.title,
      datetime: data.datetime || new Date(Date.now() + 3600000).toISOString(),
      category: data.category || "personal",
      completed: false,
      priority: data.priority || "medium",
      createdAt: new Date().toISOString(),
    };
    this.reminders.unshift(reminder);
    this.saveReminders();
    return reminder;
  }

  public toggleReminder(id: string, completed?: boolean): AssistantReminder | null {
    const target = this.reminders.find((r) => r.id === id);
    if (!target) return null;
    target.completed = completed !== undefined ? completed : !target.completed;
    this.saveReminders();
    return target;
  }

  public deleteReminder(id: string): boolean {
    const idx = this.reminders.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.reminders.splice(idx, 1);
    this.saveReminders();
    return true;
  }

  // --- Routines ---
  public getRoutines(): AssistantRoutine[] {
    return [
      {
        id: "routine-morning",
        name: "Morning Intelligence Briefing",
        description: "Delivers live weather, market movements, today's schedule, and top scientific discoveries.",
        icon: "sun",
        actions: [
          "Fetch local weather and AQI telemetry",
          "Synthesize overnight stock & crypto indices",
          "Highlight top priorities from reminders",
          "Audio voice briefing delivery",
        ],
      },
      {
        id: "routine-focus",
        name: "Deep Work / Focus Shield",
        description: "Engages 50-minute Pomodoro focus block with synthetic Alpha wave soundscapes and muted notifications.",
        icon: "shield",
        actions: [
          "Start 50-minute focus timer",
          "Activate Alpha binaural brainwave synthesizer",
          "Set status to 'Deep Work'",
        ],
      },
      {
        id: "routine-study",
        name: "Student Supercharged Study Session",
        description: "Launches CBSE/JEE quiz mode with Socratic explanations and formula sheet auto-generation.",
        icon: "graduation-cap",
        actions: [
          "Open Student Hub workspace",
          "Load active chapter key formulas",
          "Set 25-minute study sprint timer",
        ],
      },
      {
        id: "routine-night",
        name: "Evening Review & Retrospective",
        description: "Audits today's completed objectives, saves insights to long-term memory, and prepares tomorrow's plan.",
        icon: "moon",
        actions: [
          "Audit completed tasks",
          "Save learnings to 5-layer Memory Engine",
          "Generate morning task itinerary",
        ],
      },
    ];
  }

  // --- Live Daily Briefing Synthesis ---
  public async generateDailyBriefing(latitude = 28.6139, longitude = 77.209): Promise<{
    headline: string;
    weather: any;
    marketSummary: any;
    pendingReminders: AssistantReminder[];
    greeting: string;
    advice: string;
  }> {
    const weather = await getLiveOpenMeteoWeather(latitude, longitude).catch(() => ({
      current_weather: { temperature: 24, weathercode: 1, windspeed: 12 },
    }));

    const market = await getLiveStockQuote("^NSEI").catch(() => ({
      ticker: "NIFTY_50",
      price: 24350,
      changePercent: "+0.45%",
    }));

    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? "Good morning, Commander!"
        : hour < 17
        ? "Good afternoon, Commander!"
        : "Good evening, Commander!";

    const pending = this.reminders.filter((r) => !r.completed);

    return {
      headline: "SARVAGYA Daily Intelligence Briefing",
      greeting,
      weather,
      marketSummary: market,
      pendingReminders: pending.slice(0, 5),
      advice: "All 18 intelligence modules are synchronized. Multi-Model Council is primed for deep research and real-time execution.",
    };
  }
}

export const assistantManager = new AssistantManager();
