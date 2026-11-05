// ============================================================================
// SARVAGYA AI — MODEL ROUTER (`server/ai/orchestrator/ModelRouter.ts`)
// Evaluates Intent, Complexity, Capabilities & Availability to route Astra or Gemini
// ============================================================================

import type { AIProviderName } from "../providers/AIProvider.ts";
import type { IntentAnalysis } from "./IntentClassifier.ts";
import type { ComplexityMetrics } from "./ComplexityAnalyzer.ts";
import { providerRegistry } from "../providers/ProviderRegistry.ts";

export type OrchestrationMode = "auto" | "astra" | "gemini" | "multi" | "quick";

export interface RoutingDecision {
  selectedProvider: AIProviderName;
  selectedModel: string;
  mode: OrchestrationMode;
  reason: string;
  isMultiModel: boolean;
  contributingProviders: AIProviderName[];
  fallbackProvider?: AIProviderName;
  estimatedCostTier: "minimal" | "standard" | "premium";
  requiresHumanApproval: boolean;
  approvalActionType?: string;
}

export class ModelRouter {
  public async route(
    message: string,
    intent: IntentAnalysis,
    complexity: ComplexityMetrics,
    requestedMode: OrchestrationMode = "auto"
  ): Promise<RoutingDecision> {
    const astraAvailable = await providerRegistry.get("astra")?.isAvailable();
    const geminiAvailable = await providerRegistry.get("gemini")?.isAvailable();

    // 1. Explicit Manual Mode Overrides
    if (requestedMode === "astra") {
      return {
        selectedProvider: "astra",
        selectedModel: "gpt-6-astra",
        mode: "astra",
        reason: "User explicitly selected Astra Engine (gpt-6-astra)",
        isMultiModel: false,
        contributingProviders: ["astra"],
        fallbackProvider: geminiAvailable ? "gemini" : undefined,
        estimatedCostTier: "premium",
        requiresHumanApproval: intent.requiresHumanApproval,
        approvalActionType: intent.approvalActionType,
      };
    }

    if (requestedMode === "gemini") {
      const geminiModel = complexity.score >= 8 ? "gemini-4-argon" : "gemini-3.8-flash";
      return {
        selectedProvider: "gemini",
        selectedModel: geminiModel,
        mode: "gemini",
        reason: `User explicitly selected Gemini Engine (${geminiModel})`,
        isMultiModel: false,
        contributingProviders: ["gemini"],
        fallbackProvider: undefined,
        estimatedCostTier: complexity.score >= 8 ? "standard" : "minimal",
        requiresHumanApproval: intent.requiresHumanApproval,
        approvalActionType: intent.approvalActionType,
      };
    }

    if (requestedMode === "multi" || intent.isMultiModelRequested) {
      return {
        selectedProvider: "gemini", // Primary coordinator
        selectedModel: "gemini-4-argon + gpt-6-astra",
        mode: "multi",
        reason: "Multi-Model consensus mode activated for parallel cross-examination",
        isMultiModel: true,
        contributingProviders: ["gemini", "astra"],
        estimatedCostTier: "premium",
        requiresHumanApproval: intent.requiresHumanApproval,
        approvalActionType: intent.approvalActionType,
      };
    }

    if (requestedMode === "quick" || intent.category === "simple") {
      return {
        selectedProvider: "gemini",
        selectedModel: "gemini-3.8-flash",
        mode: "quick",
        reason: "Fast conversational routing for low-latency everyday tasks",
        isMultiModel: false,
        contributingProviders: ["gemini"],
        estimatedCostTier: "minimal",
        requiresHumanApproval: false,
      };
    }

    // 2. Automatic Intelligence Routing Policy
    // Table Policy:
    // - Complex math, Coding, Software architecture -> Astra
    // - High complexity (>= 8) -> Astra
    // - Education (Class 10 science, concepts) -> Gemini
    // - Web research with live grounding -> Gemini or Astra + search
    // - Travel planning -> Astra reasoning + Tool registry
    // - Vision -> Gemini (Native multimodal)

    if (intent.category === "reasoning" || intent.category === "coding" || complexity.score >= 8) {
      if (astraAvailable) {
        return {
          selectedProvider: "astra",
          selectedModel: "gpt-6-astra",
          mode: "auto",
          reason: `High complexity (${complexity.score}/10) in ${intent.category}. Selected Astra for deep reasoning & executable code.`,
          isMultiModel: false,
          contributingProviders: ["astra"],
          fallbackProvider: "gemini",
          estimatedCostTier: "premium",
          requiresHumanApproval: intent.requiresHumanApproval,
          approvalActionType: intent.approvalActionType,
        };
      } else {
        return {
          selectedProvider: "gemini",
          selectedModel: "gemini-4-argon",
          mode: "auto",
          reason: `High complexity (${complexity.score}/10) ${intent.category}. Routed to Gemini 4 Argon with High Thinking.`,
          isMultiModel: false,
          contributingProviders: ["gemini"],
          estimatedCostTier: "standard",
          requiresHumanApproval: intent.requiresHumanApproval,
          approvalActionType: intent.approvalActionType,
        };
      }
    }

    if (intent.category === "travel_planning" || intent.category === "booking_preparation") {
      return {
        selectedProvider: astraAvailable ? "astra" : "gemini",
        selectedModel: astraAvailable ? "gpt-6-astra" : "gemini-4-argon",
        mode: "auto",
        reason: "Travel planning and agentic booking workflow. Requires multi-step tool verification.",
        isMultiModel: false,
        contributingProviders: [astraAvailable ? "astra" : "gemini"],
        estimatedCostTier: "standard",
        requiresHumanApproval: intent.requiresHumanApproval,
        approvalActionType: intent.approvalActionType,
      };
    }

    if (intent.requiresVision) {
      return {
        selectedProvider: "gemini",
        selectedModel: "gemini-4-argon",
        mode: "auto",
        reason: "Visual perception and document parsing routed to native multimodal Gemini engine",
        isMultiModel: false,
        contributingProviders: ["gemini"],
        estimatedCostTier: "standard",
        requiresHumanApproval: false,
      };
    }

    // Default to Google Gemini 3.8 Flash / 4 Argon
    return {
      selectedProvider: "gemini",
      selectedModel: "gemini-3.8-flash",
      mode: "auto",
      reason: `Educational/General query routed to Gemini 3.8 Flash for instant search-grounded response`,
      isMultiModel: false,
      contributingProviders: ["gemini"],
      estimatedCostTier: "minimal",
      requiresHumanApproval: false,
    };
  }
}

export const modelRouter = new ModelRouter();
