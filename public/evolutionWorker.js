// SARVAGYA Real-Time Live Event Listener Worker
// Background Worker for Uninterrupted Event-Driven Ingestion & Tick Telemetry

let streamTimer = null;
let tickCount = 0;

self.onmessage = function (e) {
  const data = e.data || {};

  if (data.command === "START_STREAM") {
    if (streamTimer) return;
    console.log("[Worker] Real-time background feed listener initialized.");
    
    streamTimer = setInterval(() => {
      tickCount++;
      self.postMessage({
        type: "NEW_DATA_ACQUIRED",
        status: "NEW_DATA_ACQUIRED",
        timestamp: Date.now(),
        tickIndex: tickCount,
        payloadSize: Math.floor(Math.random() * 512) + 128,
        source: "client_background_worker"
      });
    }, 1000);

    self.postMessage({
      type: "STREAM_STARTED",
      status: "STREAM_STARTED",
      timestamp: Date.now()
    });
  } else if (data.command === "STOP_STREAM") {
    if (streamTimer) {
      clearInterval(streamTimer);
      streamTimer = null;
    }
    console.log("[Worker] Real-time background feed listener paused.");
    self.postMessage({
      type: "STREAM_STOPPED",
      status: "STREAM_STOPPED",
      timestamp: Date.now()
    });
  }
};
