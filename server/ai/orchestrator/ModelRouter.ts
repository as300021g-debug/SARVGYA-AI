// ============================================================================
// SARVAGYA AI — MODEL ROUTER (`server/ai/orchestrator/ModelRouter.ts`)
// Evaluates Intent, Complexity, Capabilities & Availability to route Gemini, OpenAI, Claude
// ============================================================================

import type { AIProviderName } from "../providers/AIProvider.ts";
import type { IntentAnalysis } from "./IntentClassifier.ts";
import type { ComplexityMetrics } from "./ComplexityAnalyzer.ts";
import { providerRegistry } from "../providers/ProviderRegistry.ts";

export type OrchestrationMode =
  | "auto"
  | "quick"
  | "reasoning"
  | "research"
  | "creative"
  | "coding"
  | "vision"
  | "long_doc"
  | "council"
  | "astra"
  | "gemini"
  | "claude"
  | "multi";

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
    const claudeAvailable = await providerRegistry.get("claude")?.isAvailable();

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

    if (requestedMode === "claude") {
      return {
        selectedProvider: "claude",
        selectedModel: "claude-3-7-sonnet-20250219",
        mode: "claude",
        reason: "User explicitly selected Anthropic Claude 3.7 / 3.5 Sonnet",
        isMultiModel: false,
        contributingProviders: ["claude"],
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

    // 2. Multi-Model Council / Multi Mode
    if (requestedMode === "council" || requestedMode === "multi" || intent.isMultiModelRequested) {
      const activeContributors: AIProviderName[] = ["gemini"];
      if (astraAvailable) activeContributors.push("astra");
      if (claudeAvailable) activeContributors.push("claude");

      return {
        selectedProvider: "gemini",
        selectedModel: "SARVAGYA Multi-Model Council (Gemini + OpenAI + Claude)",
        mode: "council",
        reason: "Multi-Model Council consensus mode: Independent parallel cross-examination across all active frontier models",
        isMultiModel: true,
        contributingProviders: activeContributors,
        estimatedCostTier: "premium",
        requiresHumanApproval: intent.requiresHumanApproval,
        approvalActionType: intent.approvalActionType,
      };
    }

    // 3. Fast Response Mode
    if (requestedMode === "quick" || intent.category === "simple") {
      return {
        selectedProvider: "gemini",
        selectedModel: "gemini-3.8-flash",
        mode: "quick",
        reason: "Fast conversational routing for sub-second, low-latency responsiveness",
        isMultiModel: false,
        contributingProviders: ["gemini"],
        estimatedCostTier: "minimal",
        requiresHumanApproval: false,
      };
    }

    // 4. Advanced Reasoning Mode
    if (requestedMode === "reasoning") {
      if (claudeAvailable) {
        return {
          selectedProvider: "claude",
          selectedModel: "claude-3-7-sonnet-20250219",
          mode: "reasoning",
          reason: "Advanced Reasoning mode: Routed to Anthropic Claude for deep analytical thinking and step-by-step logic",
          isMultiModel: false,
          contributingProviders: ["claude"],
          fallbackProvider: "gemini",
          estimatedCostTier: "premium",
          requiresHumanApproval: intent.requiresHumanApproval,
        };
      }
      if (astraAvailable) {
        return {
          selectedProvider: "astra",
          selectedModel: "gpt-6-astra",
          mode: "reasoning",
          reason: "Advanced Reasoning mode: Routed to OpenAI GPT-6 Astra for test-time compute chain-of-thought",
          isMultiModel: false,
          contributingProviders: ["astra"],
          fallbackProvider: "gemini",
          estimatedCostTier: "premium",
          requiresHumanApproval: intent.requiresHumanApproval,
        };
      }
      return {
        selectedProvider: "gemini",
        selectedModel: "gemini-4-argon",
        mode: "reasoning",
        reason: "Advanced Reasoning mode: Routed to Gemini 4 Argon with High Thinking budget",
        isMultiModel: false,
        contributingProviders: ["gemini"],
        estimatedCostTier: "standard",
        requiresHumanApproval: intent.requiresHumanApproval,
      };
    }

    // 5. Deep Research Mode
    if (requestedMode === "research") {
      return {
        selectedProvider: "gemini",
        selectedModel: "gemini-4-argon",
        mode: "research",
        reason: "Deep Research mode: Live Google Search grounding with verifiable source citations and cross-checking",
        isMultiModel: false,
        contributingProviders: ["gemini"],
        estimatedCostTier: "standard",
        requiresHumanApproval: false,
      };
    }

    // 6. Coding Intelligence Mode
    if (requestedMode === "coding" || intent.category === "coding") {
      if (claudeAvailable) {
        return {
          selectedProvider: "claude",
          selectedModel: "claude-3-7-sonnet-20250219",
          mode: "coding",
          reason: "Coding Intelligence mode: Routed to Anthropic Claude for architectural refactoring & bug-free code",
          isMultiModel: false,
          contributingProviders: ["claude"],
          fallbackProvider: "gemini",
          estimatedCostTier: "premium",
          requiresHumanApproval: intent.requiresHumanApproval,
        };
      }
      if (astraAvailable) {
        return {
          selectedProvider: "astra",
          selectedModel: "gpt-6-astra",
          mode: "coding",
          reason: "Coding Intelligence mode: Routed to OpenAI GPT-6 Astra for full-stack software generation",
          isMultiModel: false,
          contributingProviders: ["astra"],
          fallbackProvider: "gemini",
          estimatedCostTier: "premium",
          requiresHumanApproval: intent.requiresHumanApproval,
        };
      }
      return {
        selectedProvider: "gemini",
        selectedModel: "gemini-4-argon",
        mode: "coding",
        reason: "Coding Intelligence mode: Routed to Gemini 4 Argon with integrated code execution sandbox",
        isMultiModel: false,
        contributingProviders: ["gemini"],
        estimatedCostTier: "standard",
        requiresHumanApproval: intent.requiresHumanApproval,
      };
    }

    // 7. Long-Document Analysis Mode
    if (requestedMode === "long_doc") {
      if (claudeAvailable) {
        return {
          selectedProvider: "claude",
          selectedModel: "claude-3-7-sonnet-20250219",
          mode: "long_doc",
          reason: "Long-Document Analysis mode: Routed to Anthropic Claude for massive context comprehension and document parsing",
          isMultiModel: false,
          contributingProviders: ["claude"],
          fallbackProvider: "gemini",
          estimatedCostTier: "premium",
          requiresHumanApproval: false,
        };
      }
      return {
        selectedProvider: "gemini",
        selectedModel: "gemini-4-argon",
        mode: "long_doc",
        reason: "Long-Document Analysis mode: Routed to Gemini 4 Argon with 1M+ token context window",
        isMultiModel: false,
        contributingProviders: ["gemini"],
        estimatedCostTier: "standard",
        requiresHumanApproval: false,
      };
    }

    // 8. Vision Intelligence Mode
    if (requestedMode === "vision" || intent.requiresVision) {
      return {
        selectedProvider: "gemini",
        selectedModel: "gemini-4-argon",
        mode: "vision",
        reason: "Vision Intelligence: Native multimodal image, diagram, and screenshot comprehension",
        isMultiModel: false,
        contributingProviders: ["gemini"],
        estimatedCostTier: "standard",
        requiresHumanApproval: false,
      };
    }

    // 9. Creative Intelligence Mode
    if (requestedMode === "creative") {
      return {
        selectedProvider: "gemini",
        selectedModel: "gemini-3.8-flash",
        mode: "creative",
        reason: "Creative Intelligence: Narrative synthesis, brainstorming, and media prompt design",
        isMultiModel: false,
        contributingProviders: ["gemini"],
        estimatedCostTier: "minimal",
        requiresHumanApproval: false,
      };
    }

    // 10. Travel & Booking Automation
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

    // 11. Default Intelligent Auto Selection
    if (complexity.score >= 8) {
      if (claudeAvailable) {
        return {
          selectedProvider: "claude",
          selectedModel: "claude-3-7-sonnet-20250219",
          mode: "auto",
          reason: `High complexity task (${complexity.score}/10). Auto-routed to Anthropic Claude 3.7 Sonnet.`,
          isMultiModel: false,
          contributingProviders: ["claude"],
          fallbackProvider: "gemini",
          estimatedCostTier: "premium",
          requiresHumanApproval: intent.requiresHumanApproval,
          approvalActionType: intent.approvalActionType,
        };
      }
      return {
        selectedProvider: "gemini",
        selectedModel: "gemini-4-argon",
        mode: "auto",
        reason: `High complexity task (${complexity.score}/10). Auto-routed to Gemini 4 Argon with High Thinking.`,
        isMultiModel: false,
        contributingProviders: ["gemini"],
        estimatedCostTier: "standard",
        requiresHumanApproval: intent.requiresHumanApproval,
        approvalActionType: intent.approvalActionType,
      };
    }

    return {
      selectedProvider: "gemini",
      selectedModel: "gemini-3.8-flash",
      mode: "auto",
      reason: "Everyday query routed to Gemini 3.8 Flash for instant search-grounded response",
      isMultiModel: false,
      contributingProviders: ["gemini"],
      estimatedCostTier: "minimal",
      requiresHumanApproval: false,
    };
  }
}

export const modelRouter = new ModelRouter();
