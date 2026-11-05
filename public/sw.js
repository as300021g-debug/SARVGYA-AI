// SARVAGYA Universal Service Worker v1.2
// High-Resilience Offline Caching & Interception Shield

const SHELL_CACHE = "sarvagya-shell-v1";
const AI_CACHE = "sarvagya-ai-responses-v1";
const PROFILE_CACHE = "sarvagya-profile-settings-v1";

const DEFAULT_PROFILE = {
  name: "Sarvagya Explorer",
  avatar: "✨",
  theme: "dark",
  goal: "Autonomous Learning & Enterprise Research",
  interests: "Science, AI Architectures, Stock Analytics, Space, Workspace Automations",
  created: new Date().toISOString(),
  learningStyle: "Interactive & Scientific",
  pacing: "Adaptive",
  allowGoogleSearch: true,
  allowOfficeFeed: true,
  allowSelfUpdates: true,
  communicationStyle: "Analytical, Insightful & Direct",
  sentimentLabel: "Positive",
  sentimentScore: 0.94,
  rapportLevel: "Empathetic Resonance (Level 5)",
  bondLevel: 100,
  interactionCount: 142,
  brainwaveProfile: "Beta",
  soundscapeEnabled: false,
  soundscapeVolume: 0.35,
  pinnedApps: ["google-drive", "google-sheets", "gmail", "gemini-live", "buyhatke", "stocks"]
};

const SHELL_ASSETS = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![SHELL_CACHE, AI_CACHE, PROFILE_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First with Timeout
async function fetchWithTimeout(request, timeout = 4000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Strictly skip external services like Google Maps
  if (url.origin.includes("googleapis.com") || url.origin.includes("gstatic.com")) {
    return;
  }

  // Intercept profile and settings
  if (url.pathname === "/api/user/profile" || url.pathname === "/api/user/settings") {
    if (event.request.method === "GET") {
      event.respondWith(
        fetchWithTimeout(event.request, 3000)
          .then((response) => {
            if (response.ok) {
              const resClone = response.clone();
              caches.open(PROFILE_CACHE).then((cache) => cache.put(event.request, resClone));
            }
            return response;
          })
          .catch(async () => {
            const cached = await caches.match(event.request);
            if (cached) return cached;
            return new Response(JSON.stringify(DEFAULT_PROFILE), {
              headers: { "Content-Type": "application/json" }
            });
          })
      );
      return;
    }
  }

  // Handle Shell navigation
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match("/index.html");
        return cached || fetch(event.request);
      })
    );
  }
});

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || !data.type) return;

  switch (data.type) {
    case "SKIP_WAITING":
      self.skipWaiting();
      break;

    case "CACHE_PROFILE":
      caches.open(PROFILE_CACHE).then((cache) => {
        cache.put(
          new Request("/api/user/profile"),
          new Response(JSON.stringify(data.payload), {
            headers: { "Content-Type": "application/json" }
          })
        );
      });
      break;

    case "GET_CACHE_STATS":
      Promise.all([
        caches.open(SHELL_CACHE).then((c) => c.keys()),
        caches.open(AI_CACHE).then((c) => c.keys()),
        caches.open(PROFILE_CACHE).then((c) => c.keys())
      ]).then(([shellKeys, aiKeys, profileKeys]) => {
        event.ports[0]?.postMessage({
          shellCacheCount: shellKeys.length,
          aiCacheCount: aiKeys.length,
          profileCacheCount: profileKeys.length,
          status: "Active & Synced"
        });
      });
      break;

    case "CLEAR_ALL_CACHES":
      caches.keys().then((keys) => {
        Promise.all(keys.map((k) => caches.delete(k))).then(() => {
          event.ports[0]?.postMessage({ success: true, message: "All caches cleared" });
        });
      });
      break;

    default:
      break;
  }
});
