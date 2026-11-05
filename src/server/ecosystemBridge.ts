// ============================================================================
// SARVAGYA AI — SSRF-SAFE WEB EXTRACTOR, LIVE MARKETS & GOOGLE ECOSYSTEM BRIDGE
// (`src/server/ecosystemBridge.ts`)
// ============================================================================

import { URL } from "url";
import dns from "dns/promises";
import net from "net";
import { GoogleGenAI } from "@google/genai";

// 1. SSRF Protection: Reject localhost, loopback, link-local, and RFC1918 private IPs
function isPrivateIP(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    if (parts[0] === 10) return true;
    if (parts[0] === 127) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 0) return true;
  } else if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    if (
      normalized === "::1" ||
      normalized.startsWith("fe80:") ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd")
    ) {
      return true;
    }
  }
  return false;
}

export async function fetchUrlSafely(rawUrl: string): Promise<{ title: string; textContent: string; finalUrl: string }> {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Only HTTP/HTTPS protocols are permitted.");
  }

  const addresses = await dns.lookup(parsed.hostname, { all: true });
  for (const addr of addresses) {
    if (isPrivateIP(addr.address)) {
      throw new Error("Access to private, loopback, or internal network addresses is strictly blocked (SSRF Protection).");
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  const res = await fetch(parsed.toString(), {
    signal: controller.signal,
    headers: { "User-Agent": "SARVAGYA-AI-Research-Bot/2.5" },
  });
  clearTimeout(timer);

  if (!res.ok) throw new Error(`Remote server returned HTTP ${res.status}`);
  const html = (await res.text()).slice(0, 250000); // Cap payload at 250KB

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : parsed.hostname;
  const textContent = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);

  return { title, textContent, finalUrl: res.url };
}

// 2. Live Stock & Crypto Market OHLCV Telemetry Fetcher
export async function fetchLiveMarketTelemetry(symbol: string, ai: GoogleGenAI, model: string = "gemini-3.8-flash") {
  const cleanSymbol = symbol.trim().toUpperCase();

  // Attempt live Yahoo Finance public chart API for real OHLCV candles
  const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cleanSymbol)}?interval=15m&range=5d`;
  let candles: Array<{ time: string; open: number; high: number; low: number; close: number; volume: number }> = [];
  let latestPrice: number | null = null;
  let currency = "USD";

  try {
    const res = await fetch(chartUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (res.ok) {
      const data: any = await res.json();
      const result = data.chart?.result?.[0];
      if (result) {
        currency = result.meta?.currency || "USD";
        latestPrice = result.meta?.regularMarketPrice ?? null;
        const timestamps: number[] = result.timestamp || [];
        const quote = result.indicators?.quote?.[0] || {};
        candles = timestamps
          .map((ts, idx) => ({
            time: new Date(ts * 1000).toISOString().slice(5, 16).replace("T", " "),
            open: Number((quote.open?.[idx] ?? 0).toFixed(2)),
            high: Number((quote.high?.[idx] ?? 0).toFixed(2)),
            low: Number((quote.low?.[idx] ?? 0).toFixed(2)),
            close: Number((quote.close?.[idx] ?? 0).toFixed(2)),
            volume: Number(quote.volume?.[idx] ?? 0),
          }))
          .filter((c) => c.close > 0)
          .slice(-40);
      }
    }
  } catch {
    // Proceed to Gemini Search Grounding for real-time fundamentals
  }

  // Grounded Google Finance & Analyst Synthesis
  const groundedResp = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Retrieve the current real-time stock/asset price, day range, 52-week range, market cap, P/E ratio, and latest breaking financial news for ticker "${cleanSymbol}" via Google Finance and live financial feeds.`,
          },
        ]
      },
    ],
    config: { tools: [{ googleSearch: {} }], temperature: 0.2 },
  });

  const chunks = groundedResp.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = chunks
    .map((c: any) => (c.web ? { title: c.web.title, uri: c.web.uri } : null))
    .filter(Boolean);

  return {
    symbol: cleanSymbol,
    currency,
    latestPrice,
    dataOrigin: candles.length > 0 ? "LIVE_EXCHANGE_OHLCV_FEED" : "GROUNDED_GOOGLE_FINANCE_SEARCH",
    candles,
    analystSummary: groundedResp.text || "",
    sources,
    timestamp: new Date().toISOString(),
  };
}

// 3. Complete Google Ecosystem Hub Dispatcher
export const GOOGLE_ECOSYSTEM_APPS = [
  { id: "search", name: "Google Search", category: "Core", url: "https://www.google.com" },
  { id: "gemini", name: "Google Gemini", category: "AI", url: "https://gemini.google.com" },
  { id: "aistudio", name: "Google AI Studio", category: "AI", url: "https://aistudio.google.com" },
  { id: "notebooklm", name: "NotebookLM", category: "AI", url: "https://notebooklm.google.com" },
  { id: "drive", name: "Google Drive", category: "Workspace", url: "https://drive.google.com" },
  { id: "docs", name: "Google Docs", category: "Workspace", url: "https://docs.google.com" },
  { id: "sheets", name: "Google Sheets", category: "Workspace", url: "https://sheets.google.com" },
  { id: "slides", name: "Google Slides", category: "Workspace", url: "https://slides.google.com" },
  { id: "gmail", name: "Gmail", category: "Workspace", url: "https://mail.google.com" },
  { id: "calendar", name: "Google Calendar", category: "Workspace", url: "https://calendar.google.com" },
  { id: "meet", name: "Google Meet", category: "Workspace", url: "https://meet.google.com" },
  { id: "keep", name: "Google Keep", category: "Workspace", url: "https://keep.google.com" },
  { id: "forms", name: "Google Forms", category: "Workspace", url: "https://docs.google.com/forms" },
  { id: "maps", name: "Google Maps", category: "Geo & Space", url: "https://maps.google.com" },
  { id: "earth", name: "Google Earth", category: "Geo & Space", url: "https://earth.google.com" },
  { id: "sky", name: "Google Sky & Space", category: "Geo & Space", url: "https://www.google.com/sky" },
  { id: "flights", name: "Google Flights", category: "Transit", url: "https://www.google.com/travel/flights" },
  { id: "finance", name: "Google Finance", category: "Markets", url: "https://www.google.com/finance" },
  { id: "news", name: "Google News", category: "Media", url: "https://news.google.com" },
  { id: "youtube", name: "YouTube", category: "Media", url: "https://www.youtube.com" },
  { id: "photos", name: "Google Photos", category: "Media", url: "https://photos.google.com" },
  { id: "translate", name: "Google Translate", category: "Utilities", url: "https://translate.google.com" },
  { id: "scholar", name: "Google Scholar", category: "Research", url: "https://scholar.google.com" },
  { id: "patents", name: "Google Patents", category: "Research", url: "https://patents.google.com" },
  { id: "trends", name: "Google Trends", category: "Research", url: "https://trends.google.com" },
  { id: "cloud", name: "Google Cloud Console", category: "Developer", url: "https://console.cloud.google.com" },
  { id: "colab", name: "Google Colab", category: "Developer", url: "https://colab.research.google.com" },
  { id: "firebase", name: "Firebase Console", category: "Developer", url: "https://console.firebase.google.com" },
];
