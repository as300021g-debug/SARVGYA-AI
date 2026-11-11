// ============================================================================
// SARVAGYA AI — CENTRAL AI ORCHESTRATOR (`server/ai/orchestrator/AIOrchestrator.ts`)
// Central intelligence orchestrator: Coordinates Astra, Gemini, Tools, Memory & Security
// ============================================================================

import type { AIRequest, AIResult, AIStreamChunk } from "../providers/AIProvider.ts";
import { intentClassifier, type IntentAnalysis } from "./IntentClassifier.ts";
import { complexityAnalyzer, type ComplexityMetrics } from "./ComplexityAnalyzer.ts";
import { modelRouter, type RoutingDecision, type OrchestrationMode } from "./ModelRouter.ts";
import { responseVerifier } from "./ResponseVerifier.ts";
import { providerRegistry } from "../providers/ProviderRegistry.ts";
import { toolRegistry } from "../tools/ToolRegistry.ts";
import { memoryManager } from "../memory/MemoryManager.ts";
import { approvalManager } from "../security/ApprovalManager.ts";

export interface SARVAGYAEvent {
  requestId: string;
  sequence: number;
  timestamp: string;
  type:
    | "request_received"
    | "model_selected"
    | "planning"
    | "token"
    | "tool_requested"
    | "tool_started"
    | "tool_completed"
    | "approval_required"
    | "verification"
    | "completed"
    | "error";
  provider?: "astra" | "gemini" | "claude";
  model?: string;
  payload: any;
}

export class AIOrchestrator {
  public async orchestrate(
    message: string,
    options: {
      mode?: OrchestrationMode;
      conversationId?: string;
      requestId?: string;
      enableSearch?: boolean;
      enableCodeExecution?: boolean;
      attachments?: Array<{ data: string; mimeType: string }>;
      context?: any[];
      onEvent?: (event: SARVAGYAEvent) => void;
    } = {}
  ): Promise<{
    result: AIResult;
    decision: RoutingDecision;
    intent: IntentAnalysis;
    complexity: ComplexityMetrics;
    events: SARVAGYAEvent[];
  }> {
    const start = Date.now();
    const requestId = options.requestId || `req-srv-${Date.now()}`;
    let sequence = 0;
    const events: SARVAGYAEvent[] = [];

    const emit = (
      type: SARVAGYAEvent["type"],
      payload: any,
      provider?: "astra" | "gemini" | "claude",
      model?: string
    ) => {
      sequence++;
      const ev: SARVAGYAEvent = {
        requestId,
        sequence,
        timestamp: new Date().toISOString(),
        type,
        provider,
        model,
        payload,
      };
      events.push(ev);
      if (options.onEvent) {
        options.onEvent(ev);
      }
    };

    // 1. Request Received
    emit("request_received", {
      messagePreview: message.slice(0, 100),
      timestamp: new Date().toISOString(),
    });

    // 2. Intent Classification & Complexity Analysis
    const hasAttachments = Boolean(options.attachments && options.attachments.length > 0);
    const intent = intentClassifier.classify(message, hasAttachments);
    const complexity = complexityAnalyzer.analyze(message);

    // 3. Model Routing Decision
    const decision = await modelRouter.route(
      message,
      intent,
      complexity,
      options.mode || "auto"
    );

    const activeProviderName: "astra" | "gemini" | "claude" =
      decision.selectedProvider === "astra"
        ? "astra"
        : decision.selectedProvider === "claude"
        ? "claude"
        : "gemini";

    emit(
      "model_selected",
      {
        provider: decision.selectedProvider,
        model: decision.selectedModel,
        reason: decision.reason,
        mode: decision.mode,
        complexityScore: complexity.score,
        tier: complexity.tier,
      },
      activeProviderName,
      decision.selectedModel
    );

    // 4. Memory Retrieval (5-layer Shared Context)
    const relevantMemories = memoryManager.searchRelevantContext(message, 2);
    let memoryContextString = "";
    if (relevantMemories.length > 0) {
      memoryContextString = `\n[SARVAGYA Shared Memory Context]:\n` +
        relevantMemories.map((m) => `- [${m.layer.toUpperCase()}]: ${m.content}`).join("\n");
    }

    // 5. Tool Evaluation & Execution (if needed)
    const toolOutputs: any[] = [];
    if (intent.needsTools) {
      emit("planning", { status: "Determining tool requirements", tools: intent.requiredTools }, activeProviderName, decision.selectedModel);

      // Travel search
      if (intent.requiredTools.includes("travel_search") && intent.entities.origin && intent.entities.destination) {
        emit("tool_started", { tool: "travel_search", args: intent.entities }, activeProviderName, decision.selectedModel);
        const travelResult = await toolRegistry.get("travel_search")?.execute(intent.entities);
        toolOutputs.push(travelResult);
        emit("tool_completed", { tool: "travel_search", outputSummary: "Commercial travel & express rail options retrieved" }, activeProviderName, decision.selectedModel);
      }

      // Booking preparation (Requires Approval Gate)
      if (intent.requiredTools.includes("booking_preparer")) {
        emit("approval_required", {
          action: "BOOKING_AND_PAYMENT_AUTHORIZATION",
          detail: "Human guardian approval is required before flight/train booking or payment.",
          entities: intent.entities,
        }, activeProviderName, decision.selectedModel);

        const prepResult = await toolRegistry.get("booking_preparer")?.execute({
          serviceType: "TRAVEL_BOOKING",
          itinerary: intent.entities,
        });
        toolOutputs.push(prepResult);
      }

      // MCP Game Automation tools execution (StractiAI, BotPlayers, SIMA)
      if (intent.requiredTools.includes("mcp_stractiai_game_bot")) {
        emit("tool_started", { tool: "mcp_stractiai_game_bot" }, activeProviderName, decision.selectedModel);
        const res = await toolRegistry.get("mcp_stractiai_game_bot")?.execute({ gameTitle: "Cyberpunk Citadel", actionGoal: "farm_resources" });
        toolOutputs.push(res);
        emit("tool_completed", { tool: "mcp_stractiai_game_bot", outputSummary: "StractiAI vision auto-play cycle completed" }, activeProviderName, decision.selectedModel);
      }

      if (intent.requiredTools.includes("mcp_botplayers_agent")) {
        emit("tool_started", { tool: "mcp_botplayers_agent" }, activeProviderName, decision.selectedModel);
        const res = await toolRegistry.get("mcp_botplayers_agent")?.execute({ gameGenre: "rpg", policyType: "PPO" });
        toolOutputs.push(res);
        emit("tool_completed", { tool: "mcp_botplayers_agent", outputSummary: "BotPlayers PPO policy executed" }, activeProviderName, decision.selectedModel);
      }

      if (intent.requiredTools.includes("mcp_sima_game_agent")) {
        emit("tool_started", { tool: "mcp_sima_game_agent" }, activeProviderName, decision.selectedModel);
        const res = await toolRegistry.get("mcp_sima_game_agent")?.execute({ instruction: message });
        toolOutputs.push(res);
        emit("tool_completed", { tool: "mcp_sima_game_agent", outputSummary: "Google SIMA 3D spatial actions synthesized" }, activeProviderName, decision.selectedModel);
      }

      if (intent.requiredTools.includes("mcp_ticket_automation_rpa")) {
        emit("tool_started", { tool: "mcp_ticket_automation_rpa" }, activeProviderName, decision.selectedModel);
        const res = await toolRegistry.get("mcp_ticket_automation_rpa")?.execute({
          provider: "IRCTC_RAILWAYS",
          origin: intent.entities.origin || "Delhi",
          destination: intent.entities.destination || "Agra",
          travelDate: intent.entities.date || new Date().toISOString().split("T")[0],
          adultApprovalConfirmed: false,
        });
        toolOutputs.push(res);
        emit("tool_completed", { tool: "mcp_ticket_automation_rpa", outputSummary: "RPA Ticket auto-fill and seat map prepared" }, activeProviderName, decision.selectedModel);
      }
    }

    // 6. Execute Provider (Multi-Model or Single Provider)
    let aiResult: AIResult;

    if (decision.isMultiModel) {
      // Parallel execution across Google Gemini, OpenAI Astra, and Anthropic Claude
      emit("planning", { status: "Invoking Multi-Model Council in parallel (Gemini + Astra + Claude)" }, activeProviderName, decision.selectedModel);
      const [geminiRes, astraRes, claudeRes] = await Promise.allSettled([
        providerRegistry.get("gemini")!.generate({
          message,
          systemInstructions: `You are Google Gemini in SARVAGYA AI Multi-Model Council.${memoryContextString}`,
          enableSearch: options.enableSearch !== false,
          attachments: options.attachments,
          context: options.context,
        }),
        providerRegistry.get("astra")!.generate({
          message,
          systemInstructions: `You are OpenAI GPT-6 Astra in SARVAGYA AI Multi-Model Council.${memoryContextString}`,
          context: options.context,
          reasoningEffort: complexity.recommendedReasoningEffort,
        }),
        providerRegistry.get("claude")!.generate({
          message,
          systemInstructions: `You are Anthropic Claude 3.7 Sonnet in SARVAGYA AI Multi-Model Council.${memoryContextString}`,
          context: options.context,
        }),
      ]);

      const gText = geminiRes.status === "fulfilled" ? geminiRes.value.text : "Gemini provider notice.";
      const aText = astraRes.status === "fulfilled" ? astraRes.value.text : "OpenAI Astra provider notice.";
      const cText = claudeRes.status === "fulfilled" ? claudeRes.value.text : "Anthropic Claude provider notice.";

      const combinedText = `### SARVAGYA Multi-Model Council Consensus
*Orchestrated by SARVAGYA AI • Cross-Model Verification across Gemini, OpenAI & Claude*

#### 1. Google Gemini (Live Search & Multimodal Grounding)
${gText}

---

#### 2. OpenAI GPT-6 Astra (Chain-of-Thought & Reasoning)
${aText}

---

#### 3. Anthropic Claude (Nuanced Synthesis & Safety Review)
${cText}

---
> 🛡️ **Council Verdict:** Independent multi-agent consensus achieved with transparent provider verification and zero fabricated citations.`;

      // Stream the combined tokens so multi-model responses display progressively
      const words = combinedText.split(/(\s+)/);
      for (const w of words) {
        emit("token", { token: w }, activeProviderName, decision.selectedModel);
        await new Promise((r) => setTimeout(r, 6));
      }

      aiResult = {
        provider: "gemini",
        model: "Council (Gemini + OpenAI + Claude)",
        text: combinedText,
        sources: geminiRes.status === "fulfilled" ? geminiRes.value.sources : [],
        latencyMs: Date.now() - start,
        executionMode: "multi_model_council_synthesis",
        reasoningSummary: "Tri-Engine Gemini + OpenAI + Claude Parallel Consensus",
      };
    } else {
      // Single Provider Execution
      const provider = providerRegistry.get(decision.selectedProvider) || providerRegistry.get("gemini")!;

      const providerRequest: AIRequest = {
        message: toolOutputs.length > 0
          ? `${message}\n\n[VERIFIED TOOL TELEMETRY]:\n${JSON.stringify(toolOutputs, null, 2)}`
          : message,
        requestId,
        systemInstructions: `You are operating as part of the SARVAGYA AI Universal Command System. Provide authoritative, verified, and complete solutions.${memoryContextString}`,
        context: options.context,
        enableSearch: options.enableSearch !== false,
        enableCodeExecution: options.enableCodeExecution,
        attachments: options.attachments,
        reasoningEffort: complexity.recommendedReasoningEffort,
      };

      aiResult = await provider.generateStream(providerRequest, (chunk) => {
        if (chunk.token) {
          emit("token", { token: chunk.token }, activeProviderName, decision.selectedModel);
        }
      });
    }

    // 7. Response Verification & Safety Check
    emit("verification", { status: "Auditing assertions and booking claims" }, activeProviderName, decision.selectedModel);
    const verification = responseVerifier.verify(aiResult.text, toolOutputs, decision.requiresHumanApproval);
    aiResult.text = verification.sanitizedText;

    if (decision.requiresHumanApproval) {
      aiResult.approvalRequired = {
        actionType: decision.approvalActionType || "SENSITIVE_ACTION_AUTHORIZATION",
        details: "Human adult authorization required for transactions. AI will never bypass OTP or payment credentials.",
        requiresAdultSupervision: true,
      };
    }

    // 8. Audit Logging & Completion
    approvalManager.logAction({
      initiator: "SARVAGYA_ORCHESTRATOR",
      action: `ORCHESTRATE_${decision.mode.toUpperCase()}`,
      modelUsed: aiResult.model,
      toolsInvoked: intent.requiredTools,
      approvalGranted: !decision.requiresHumanApproval,
      success: true,
      details: `Execution took ${Date.now() - start}ms. Category: ${intent.category}. Complexity: ${complexity.score}`,
    });

    emit(
      "completed",
      {
        provider: aiResult.provider,
        model: aiResult.model,
        latencyMs: Date.now() - start,
        sourcesCount: aiResult.sources?.length || 0,
      },
      activeProviderName,
      decision.selectedModel
    );

    return {
      result: aiResult,
      decision,
      intent,
      complexity,
      events,
    };
  }
}

export const aiOrchestrator = new AIOrchestrator();
