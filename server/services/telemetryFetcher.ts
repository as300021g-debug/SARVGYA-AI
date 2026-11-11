// ============================================================================
// SARVAGYA AI — REAL TELEMETRY & LIVE WEB RETRIEVAL (LEAF SERVICE)
// Pure leaf module providing real-time financial market, weather, news RSS,
// and web snippet retrieval. Zero circular dependencies.
// ============================================================================

export interface LiveSource {
  title: string;
  uri: string;
}

/**
 * Clean HTML strings into clean plain text
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetch live news headlines directly from Google News RSS in real-time
 */
export async function fetchGoogleNewsRss(query: string): Promise<{ headlines: string[]; sources: LiveSource[] }> {
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://news.google.com/rss/search?q=${encoded}&hl=en-US&gl=US&ceid=US:en`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return { headlines: [], sources: [] };

    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 5);

    const headlines: string[] = [];
    const sources: LiveSource[] = [];

    for (const item of items) {
      const itemContent = item[1];
      const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

      if (titleMatch) {
        const rawTitle = stripHtml(titleMatch[1]);
        const dateStr = pubDateMatch ? ` (${stripHtml(pubDateMatch[1])})` : "";
        headlines.push(`${rawTitle}${dateStr}`);

        const link = linkMatch ? stripHtml(linkMatch[1]) : "https://news.google.com";
        sources.push({
          title: rawTitle,
          uri: link,
        });
      }
    }

    return { headlines, sources };
  } catch {
    return { headlines: [], sources: [] };
  }
}

/**
 * Fetch live search snippets from web search engine
 */
export async function fetchWebSnippets(query: string): Promise<{ snippets: string[]; sources: LiveSource[] }> {
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://html.duckduckgo.com/html/?q=${encoded}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return { snippets: [], sources: [] };

    const html = await res.text();
    const snippets: string[] = [];
    const sources: LiveSource[] = [];

    const linkMatches = [...html.matchAll(/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].slice(0, 5);
    const snippetMatches = [...html.matchAll(/<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)].slice(0, 5);

    for (let i = 0; i < linkMatches.length; i++) {
      let url = linkMatches[i][1];
      const uddgMatch = url.match(/uddg=([^&]+)/);
      if (uddgMatch) {
        url = decodeURIComponent(uddgMatch[1]);
      }
      const title = stripHtml(linkMatches[i][2]);
      const snippet = snippetMatches[i] ? stripHtml(snippetMatches[i][1]) : "";

      if (title && url) {
        sources.push({ title, uri: url });
        snippets.push(`[${title}]: ${snippet} (Source: ${url})`);
      }
    }

    return { snippets, sources };
  } catch {
    return { snippets: [], sources: [] };
  }
}

/**
 * Fetch live Wikipedia summary / facts if entity detected
 */
export async function fetchWikipediaFacts(query: string): Promise<{ facts: string[]; sources: LiveSource[] }> {
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encoded}&utf8=&format=json`;
    const res = await fetch(url, {
      headers: { "User-Agent": "SarvagyaAI/2.0 (mailto:admin@sarvagya.ai)" },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return { facts: [], sources: [] };

    const data = await res.json();
    const searchResults = data?.query?.search || [];
    const facts: string[] = [];
    const sources: LiveSource[] = [];

    for (const item of searchResults.slice(0, 2)) {
      const title = item.title;
      const snippet = stripHtml(item.snippet);
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
      facts.push(`Wikipedia [${title}]: ${snippet}`);
      sources.push({ title: `${title} - Wikipedia`, uri: pageUrl });
    }

    return { facts, sources };
  } catch {
    return { facts: [], sources: [] };
  }
}

/**
 * Fetch live stock market / crypto quote if ticker or asset query detected
 */
export async function getLiveStockQuote(ticker: string): Promise<{
  symbol: string;
  price: number;
  prevClose: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  currency: string;
  exchangeName: string;
  timestamp: string;
  isLive: boolean;
} | null> {
  try {
    const symbol = ticker.toUpperCase().trim();
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (meta && meta.regularMarketPrice) {
        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || price;
        const change = ((price - prevClose) / prevClose) * 100;
        return {
          symbol: meta.symbol || symbol,
          price: parseFloat(price.toFixed(2)),
          prevClose: parseFloat(prevClose.toFixed(2)),
          changePercent: parseFloat(change.toFixed(2)),
          dayHigh: parseFloat((meta.regularMarketDayHigh || price * 1.01).toFixed(2)),
          dayLow: parseFloat((meta.regularMarketDayLow || price * 0.99).toFixed(2)),
          currency: meta.currency || "USD",
          exchangeName: meta.exchangeName || "NASDAQ",
          timestamp: new Date().toISOString(),
          isLive: true,
        };
      }
    }
  } catch (err) {
    console.warn("[LiveStockQuote] Notice:", err);
  }
  return null;
}

/**
 * Fetch live weather data if weather query detected
 */
export async function fetchLiveWeather(query: string): Promise<{ weatherText?: string; source?: LiveSource }> {
  if (!/\b(weather|temperature|forecast|rain|climate|humidity|degrees)\b/i.test(query)) {
    return {};
  }

  const cities: Record<string, { lat: number; lon: number; name: string }> = {
    delhi: { lat: 28.6139, lon: 77.209, name: "New Delhi, India" },
    mumbai: { lat: 19.076, lon: 72.8777, name: "Mumbai, India" },
    bangalore: { lat: 12.9716, lon: 77.5946, name: "Bengaluru, India" },
    "new york": { lat: 40.7128, lon: -74.006, name: "New York, USA" },
    london: { lat: 51.5074, lon: -0.1278, name: "London, UK" },
    tokyo: { lat: 35.6762, lon: 139.6503, name: "Tokyo, Japan" },
    san_francisco: { lat: 37.7749, lon: -122.4194, name: "San Francisco, USA" },
    paris: { lat: 48.8566, lon: 2.3522, name: "Paris, France" },
    sydney: { lat: -33.8688, lon: 151.2093, name: "Sydney, Australia" },
  };

  let matchedCity = cities.delhi;
  const qLower = query.toLowerCase();
  for (const [key, val] of Object.entries(cities)) {
    if (qLower.includes(key) || qLower.includes(key.replace("_", " "))) {
      matchedCity = val;
      break;
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${matchedCity.lat}&longitude=${matchedCity.lon}&current_weather=true`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return {};

    const data = await res.json();
    const cw = data.current_weather;
    if (cw) {
      const text = `LIVE METEOROLOGICAL TELEMETRY [${matchedCity.name}]: Temperature = ${cw.temperature}°C, Windspeed = ${cw.windspeed} km/h, Wind Direction = ${cw.winddirection}°, Time = ${cw.time}. (Data sourced in real-time from Open-Meteo).`;
      return {
        weatherText: text,
        source: {
          title: `Real-Time Weather for ${matchedCity.name} - Open-Meteo`,
          uri: `https://open-meteo.com/en/docs#latitude=${matchedCity.lat}&longitude=${matchedCity.lon}`,
        },
      };
    }
  } catch {}

  return {};
}
