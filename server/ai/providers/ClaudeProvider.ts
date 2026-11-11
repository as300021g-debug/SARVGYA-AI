// ============================================================================
// SARVAGYA AI — ANTHROPIC CLAUDE PROVIDER (`server/ai/providers/ClaudeProvider.ts`)
// Connects to Anthropic Messages API (Claude 3.7 Sonnet, Claude 3.5 Sonnet / Opus)
// ============================================================================

import Anthropic from "@anthropic-ai/sdk";
import type {
  AIProvider,
  AIProviderName,
  AIRequest,
  AIResult,
  AIStreamChunk,
  ProviderHealth,
} from "./AIProvider.ts";

export class ClaudeProvider implements AIProvider {
  public readonly name: AIProviderName = "claude";
  public readonly defaultModel: string = "claude-3-7-sonnet-20250219";

  private client: Anthropic | null = null;
  private apiKeyPresent: boolean = false;

  constructor() {
    this.refreshClient();
  }

  public refreshClient(customKey?: string): void {
    const key = (customKey || process.env.ANTHROPIC_API_KEY || "").trim();
    if (key) {
      try {
        this.client = new Anthropic({ apiKey: key });
        this.apiKeyPresent = true;
      } catch {
        this.client = null;
        this.apiKeyPresent = false;
      }
    } else {
      this.client = null;
      this.apiKeyPresent = false;
    }
  }

  public async isAvailable(): Promise<boolean> {
    this.refreshClient();
    return this.apiKeyPresent;
  }

  public async getHealth(): Promise<ProviderHealth> {
    const available = await this.isAvailable();
    return {
      provider: "claude",
      name: "Anthropic Claude 3.7 / 3.5 Sonnet",
      isConfigured: available,
      isHealthy: available,
      preferredModel: this.defaultModel,
      supportedCapabilities: [
        "long_document_analysis",
        "deep_reasoning_and_thinking",
        "code_generation_and_refactoring",
        "computer_use_workflows",
        "multimodal_vision",
        "streaming",
      ],
      lastChecked: new Date().toISOString(),
      statusMessage: available
        ? "Connected to Anthropic Claude Messages API"
        : "ANTHROPIC_API_KEY not configured. Add your key in Model Configuration to activate Claude.",
    };
  }

  public async generate(request: AIRequest): Promise<AIResult> {
    const start = Date.now();
    this.refreshClient();

    if (!this.client) {
      return {
        provider: "claude",
        model: this.defaultModel,
        text: "Anthropic Claude is currently not configured with an API key. Please configure ANTHROPIC_API_KEY in server environment or the Model Configuration Drawer to activate Claude.",
        latencyMs: Date.now() - start,
        executionMode: "UNCONFIGURED_NOTICE",
      };
    }

    try {
      const messages: any[] = [];
      if (request.context && request.context.length > 0) {
        for (const msg of request.context) {
          if (msg.role === "system") continue;
          messages.push({
            role: msg.role === "assistant" || msg.role === "model" ? "assistant" : "user",
            content: msg.content,
          });
        }
      }

      // Add user message
      messages.push({
        role: "user",
        content: request.message,
      });

      const response = await this.client.messages.create({
        model: this.defaultModel,
        max_tokens: 4096,
        system: request.systemInstructions || "You are Claude, operating inside SARVAGYA AI's unified multi-model intelligence platform.",
        messages,
      });

      let textContent = "";
      for (const block of response.content) {
        if (block.type === "text") {
          textContent += block.text;
        }
      }

      return {
        provider: "claude",
        model: response.model,
        text: textContent,
        responseId: response.id,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
        latencyMs: Date.now() - start,
        executionMode: "ANTHROPIC_MESSAGES_API",
      };
    } catch (err: any) {
      return {
        provider: "claude",
        model: this.defaultModel,
        text: `Anthropic Claude API Error: ${err?.message || "Unknown error"}`,
        latencyMs: Date.now() - start,
        executionMode: "ERROR",
      };
    }
  }

  public async generateStream(
    request: AIRequest,
    onChunk: (chunk: AIStreamChunk) => void
  ): Promise<AIResult> {
    const start = Date.now();
    this.refreshClient();

    if (!this.client) {
      const notice = "Anthropic Claude is currently not configured with an API key. Please configure ANTHROPIC_API_KEY in server environment or Model Configuration Drawer.";
      onChunk({
        requestId: request.requestId || `req_${Date.now()}`,
        sequence: 1,
        provider: "claude",
        model: this.defaultModel,
        token: notice,
        isComplete: true,
      });
      return {
        provider: "claude",
        model: this.defaultModel,
        text: notice,
        latencyMs: Date.now() - start,
        executionMode: "UNCONFIGURED_NOTICE",
      };
    }

    try {
      const messages: any[] = [];
      if (request.context && request.context.length > 0) {
        for (const msg of request.context) {
          if (msg.role === "system") continue;
          messages.push({
            role: msg.role === "assistant" || msg.role === "model" ? "assistant" : "user",
            content: msg.content,
          });
        }
      }
      messages.push({
        role: "user",
        content: request.message,
      });

      const stream = await this.client.messages.create({
        model: this.defaultModel,
        max_tokens: 4096,
        system: request.systemInstructions || "You are Claude, operating inside SARVAGYA AI's unified multi-model intelligence platform.",
        messages,
        stream: true,
      });

      let fullText = "";
      let sequence = 0;

      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          const token = chunk.delta.text;
          fullText += token;
          sequence++;
          onChunk({
            requestId: request.requestId || `req_${Date.now()}`,
            sequence,
            provider: "claude",
            model: this.defaultModel,
            token,
          });
        }
      }

      onChunk({
        requestId: request.requestId || `req_${Date.now()}`,
        sequence: sequence + 1,
        provider: "claude",
        model: this.defaultModel,
        isComplete: true,
      });

      return {
        provider: "claude",
        model: this.defaultModel,
        text: fullText,
        latencyMs: Date.now() - start,
        executionMode: "ANTHROPIC_STREAMING_API",
      };
    } catch (err: any) {
      const errMsg = `Anthropic Claude Streaming Error: ${err?.message || "Unknown error"}`;
      onChunk({
        requestId: request.requestId || `req_${Date.now()}`,
        sequence: 1,
        provider: "claude",
        model: this.defaultModel,
        token: errMsg,
        isComplete: true,
        error: errMsg,
      });
      return {
        provider: "claude",
        model: this.defaultModel,
        text: errMsg,
        latencyMs: Date.now() - start,
        executionMode: "ERROR",
      };
    }
  }
}

export const claudeProvider = new ClaudeProvider();
