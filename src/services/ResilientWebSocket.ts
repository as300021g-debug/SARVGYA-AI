// ============================================================================
// SARVAGYA AI — SINGLETON RESILIENT WEBSOCKET CLIENT (`src/services/ResilientWebSocket.ts`)
// Features: Heartbeat Ping/Pong, Outgoing Queue, Exponential Backoff, & Stream Resume
// ============================================================================

type MessageListener = (data: any) => void;

export class ResilientWebSocketManager {
  private static instance: ResilientWebSocketManager | null = null;
  private ws: WebSocket | null = null;
  private listeners = new Set<MessageListener>();
  private outboundQueue: string[] = [];
  private reconnectAttempts = 0;
  private heartbeatTimer: number | null = null;
  private isIntentionallyClosed = false;
  private activeStreams = new Map<string, number>(); // requestId -> lastSequence received

  private constructor() {
    if (typeof window !== "undefined") {
      this.connect();
    }
  }

  public static getInstance(): ResilientWebSocketManager {
    if (!ResilientWebSocketManager.instance) {
      ResilientWebSocketManager.instance = new ResilientWebSocketManager();
    }
    return ResilientWebSocketManager.instance;
  }

  private getWsUrl(): string {
    if (typeof window === "undefined") return "ws://localhost:3000/ws";
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/ws`;
  }

  public connect(): void {
    if (typeof window === "undefined") return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isIntentionallyClosed = false;
    try {
      this.ws = new WebSocket(this.getWsUrl());
    } catch {
      return;
    }

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.flushQueue();

      // Automatically request resumption for any in-flight AI stream
      this.activeStreams.forEach((lastSequence, requestId) => {
        this.send({ type: "ai_stream_resume", requestId, lastSequence });
      });

      this.notifyListeners({ type: "ws_status", status: "connected" });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ai_stream_chunk" && data.requestId) {
          this.activeStreams.set(data.requestId, data.sequence);
        } else if (data.type === "ai_stream_complete" && data.requestId) {
          this.activeStreams.delete(data.requestId);
        }
        this.notifyListeners(data);
      } catch {
        // Ignore non-JSON frames
      }
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.notifyListeners({ type: "ws_status", status: "disconnected" });
      if (!this.isIntentionallyClosed) {
        const delay = Math.min(15000, 1000 * Math.pow(1.8, this.reconnectAttempts++));
        setTimeout(() => this.connect(), delay);
      }
    };

    this.ws.onerror = () => {
      // Handled by onclose
    };
  }

  public send(payload: Record<string, any>): void {
    const serialized = JSON.stringify(payload);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(serialized);
    } else {
      this.outboundQueue.push(serialized);
      this.connect();
    }
  }

  public subscribe(listener: MessageListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private flushQueue(): void {
    while (this.outboundQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const msg = this.outboundQueue.shift();
      if (msg) this.ws.send(msg);
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping", messageId: crypto.randomUUID() }));
      }
    }, 20000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private notifyListeners(data: any): void {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (e) {
        console.error("Error in WS listener:", e);
      }
    });
  }
}
