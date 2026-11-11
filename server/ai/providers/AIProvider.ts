// ============================================================================
// SARVAGYA AI — COMMON AI PROVIDER INTERFACE (`server/ai/providers/AIProvider.ts`)
// Defines unified request, response, streaming and health contracts for all models
// ============================================================================

export type AIProviderName = "astra" | "gemini" | "claude" | "fast_engine" | "multi_synthesis";

export type ReasoningEffort = "low" | "medium" | "high" | "xhigh" | "max";

export interface AIRequest {
  message: string;
  conversationId?: string;
  requestId?: string;
  systemInstructions?: string;
  context?: Array<{ role: "user" | "model" | "assistant" | "system"; content: string }>;
  reasoningEffort?: ReasoningEffort;
  enableSearch?: boolean;
  enableCodeExecution?: boolean;
  tools?: any[];
  attachments?: Array<{ data: string; mimeType: string }>;
  temperature?: number;
  model?: string;
}

export interface AIResult {
  provider: AIProviderName;
  model: string;
  text: string;
  responseId?: string;
  sources?: Array<{ title: string; uri: string }>;
  toolCalls?: Array<{ id: string; name: string; args: any }>;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    costUsd?: number;
  };
  latencyMs: number;
  executionMode: string;
  reasoningSummary?: string;
  approvalRequired?: {
    actionType: string;
    details: string;
    requiresAdultSupervision: boolean;
  };
}

export interface AIStreamChunk {
  requestId: string;
  sequence: number;
  provider: AIProviderName;
  model: string;
  token?: string;
  isComplete?: boolean;
  sources?: Array<{ title: string; uri: string }>;
  toolActivity?: {
    toolName: string;
    status: "requested" | "executing" | "completed" | "error";
    detail?: string;
  };
  error?: string;
}

export interface ProviderHealth {
  provider: AIProviderName;
  name: string;
  isConfigured: boolean;
  isHealthy: boolean;
  preferredModel: string;
  supportedCapabilities: string[];
  latencyBenchmarkMs?: number;
  lastChecked: string;
  statusMessage: string;
}

export interface AIProvider {
  readonly name: AIProviderName;
  readonly defaultModel: string;

  isAvailable(): Promise<boolean>;
  getHealth(): Promise<ProviderHealth>;
  generate(request: AIRequest): Promise<AIResult>;
  generateStream(
    request: AIRequest,
    onChunk: (chunk: AIStreamChunk) => void
  ): Promise<AIResult>;
}
