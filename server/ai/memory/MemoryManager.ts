// ============================================================================
// SARVAGYA AI — SHARED MEMORY CENTER (`server/ai/memory/MemoryManager.ts`)
// 5-Layer Shared Memory for Astra, Gemini & Autonomous Agents
// ============================================================================

import fs from "fs";
import path from "path";

export interface MemoryRecord {
  id: string;
  layer: "conversation" | "project" | "knowledge" | "task" | "preferences";
  title: string;
  content: string;
  tags: string[];
  source: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export class MemoryManager {
  private memories: Map<string, MemoryRecord> = new Map();
  private storagePath: string;

  constructor() {
    const dataDir = path.resolve("data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.storagePath = path.join(dataDir, "sarvagya_memory_center.json");
    this.loadFromDisk();
    this.seedDefaultProjectMemory();
  }

  private loadFromDisk(): void {
    if (!fs.existsSync(this.storagePath)) return;
    try {
      const data = JSON.parse(fs.readFileSync(this.storagePath, "utf-8"));
      if (Array.isArray(data)) {
        for (const item of data) {
          this.memories.set(item.id, item);
        }
      }
    } catch (err) {
      console.warn("[MemoryManager] Failed to read disk memories:", err);
    }
  }

  private saveToDisk(): void {
    try {
      const arr = Array.from(this.memories.values());
      fs.writeFileSync(this.storagePath, JSON.stringify(arr, null, 2));
    } catch (err) {
      console.warn("[MemoryManager] Failed to write memories to disk:", err);
    }
  }

  private seedDefaultProjectMemory(): void {
    if (this.memories.size === 0) {
      this.addMemory({
        layer: "project",
        title: "SARVAGYA AI Architecture & Multi-Model Command",
        content:
          "SARVAGYA AI is the sovereign universal intelligence platform integrating OpenAI GPT-6 Astra and Google Gemini engines under central orchestration. It enforces zero mock data, real live telemetry, and human guardian authorization for financial transactions.",
        tags: ["architecture", "astra", "gemini", "sarvagya"],
        source: "System Design Constitution",
        approved: true,
      });

      this.addMemory({
        layer: "preferences",
        title: "Default Commander Persona & Depth",
        content:
          "Commander Aryan Sharma prefers high reasoning depth, structured technical markdown, executable TypeScript code blocks, and real-time Google Search grounding.",
        tags: ["preferences", "commander", "reasoning"],
        source: "User Profile Initializer",
        approved: true,
      });
    }
  }

  public addMemory(record: Omit<MemoryRecord, "id" | "createdAt" | "updatedAt">): MemoryRecord {
    const id = `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const fullRecord: MemoryRecord = {
      ...record,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.memories.set(id, fullRecord);
    this.saveToDisk();
    return fullRecord;
  }

  public getMemoriesByLayer(layer: MemoryRecord["layer"]): MemoryRecord[] {
    return Array.from(this.memories.values()).filter((m) => m.layer === layer);
  }

  public searchRelevantContext(query: string, limit: number = 3): MemoryRecord[] {
    const q = query.toLowerCase();
    const words = q.split(/\s+/).filter((w) => w.length > 2);

    const scored = Array.from(this.memories.values()).map((mem) => {
      let score = 0;
      const contentLower = mem.content.toLowerCase();
      const titleLower = mem.title.toLowerCase();

      for (const w of words) {
        if (titleLower.includes(w)) score += 3;
        if (contentLower.includes(w)) score += 1;
        if (mem.tags.some((t) => t.toLowerCase().includes(w))) score += 2;
      }
      return { mem, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.mem);
  }

  public getAll(): MemoryRecord[] {
    return Array.from(this.memories.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const memoryManager = new MemoryManager();
