// ============================================================================
// SARVAGYA AI — INTENT CLASSIFIER (`server/ai/orchestrator/IntentClassifier.ts`)
// Identifies intent, category, tool needs, and sensitive action flags
// ============================================================================

export type TaskCategory =
  | "simple"
  | "education"
  | "reasoning"
  | "coding"
  | "research"
  | "vision"
  | "travel_planning"
  | "booking_preparation"
  | "game_automation"
  | "agent"
  | "multi_model_comparison";

export interface IntentAnalysis {
  category: TaskCategory;
  primaryIntent: string;
  needsTools: boolean;
  requiredTools: string[];
  requiresVision: boolean;
  requiresHumanApproval: boolean;
  approvalActionType?: string;
  isMultiModelRequested: boolean;
  entities: {
    origin?: string;
    destination?: string;
    date?: string;
    language?: string;
    stockTicker?: string;
    technology?: string;
  };
}

export class IntentClassifier {
  public classify(message: string, hasAttachments: boolean = false): IntentAnalysis {
    const text = message.toLowerCase().trim();
    const entities: IntentAnalysis["entities"] = {};

    // 1. Check Vision requirements
    if (hasAttachments || /\b(image|photo|picture|screenshot|diagram|viewfinder|camera)\b/i.test(text)) {
      if (hasAttachments) {
        return {
          category: "vision",
          primaryIntent: "visual_analysis",
          needsTools: false,
          requiredTools: [],
          requiresVision: true,
          requiresHumanApproval: false,
          isMultiModelRequested: false,
          entities,
        };
      }
    }

    // 2. Check Comparison / Multi-Model Intent
    if (
      /\b(compare|comparison|versus|vs|both models|all models|cross-evaluate|consensus)\b/i.test(text) &&
      /\b(gemini|astra|gpt|claude|deepseek|model|ai)\b/i.test(text)
    ) {
      return {
        category: "multi_model_comparison",
        primaryIntent: "cross_model_evaluation",
        needsTools: true,
        requiredTools: ["web_search"],
        requiresVision: false,
        requiresHumanApproval: false,
        isMultiModelRequested: true,
        entities,
      };
    }

    // 3. Check Travel Planning & Booking Workflow
    const travelMatch = text.match(/\b(flight|fly|travel|journey|train|trip)\b.*\b(?:from|between)\s+([a-zA-Z\s]+?)\s+(?:to|and)\s+([a-zA-Z\s]+)/i);
    if (travelMatch) {
      entities.origin = travelMatch[2].trim();
      entities.destination = travelMatch[3].trim();
    }

    if (/\b(book|reserve|purchase|buy ticket|checkout|pay for)\b/i.test(text)) {
      return {
        category: "booking_preparation",
        primaryIntent: "prepare_booking_workflow",
        needsTools: true,
        requiredTools: ["travel_search", "booking_preparer", "mcp_ticket_automation_rpa"],
        requiresVision: false,
        requiresHumanApproval: true,
        approvalActionType: "BOOKING_AND_PAYMENT_AUTHORIZATION",
        isMultiModelRequested: false,
        entities,
      };
    }

    // 4. Check Game Automation & MCP Agents (StractiAI, BotPlayers, SIMA)
    if (
      /\b(game|play game|gaming|botplayers|sima|stractiai|auto play|farm resources|grind levels|screen automation|vision bot|game agent|virtual environment)\b/i.test(
        text
      )
    ) {
      const requiredTools: string[] = [];
      if (/stractiai|vision bot|screen-reading|object detection/i.test(text)) {
        requiredTools.push("mcp_stractiai_game_bot");
      } else if (/botplayers|reinforcement learning|ppo|dqn|farm/i.test(text)) {
        requiredTools.push("mcp_botplayers_agent");
      } else if (/sima|multiworld|3d game|natural language instruction/i.test(text)) {
        requiredTools.push("mcp_sima_game_agent");
      } else {
        requiredTools.push("mcp_stractiai_game_bot", "mcp_sima_game_agent", "mcp_botplayers_agent");
      }

      return {
        category: "game_automation",
        primaryIntent: "autonomous_gameplay_automation",
        needsTools: true,
        requiredTools,
        requiresVision: true,
        requiresHumanApproval: false,
        isMultiModelRequested: false,
        entities,
      };
    }

    if (/\b(flight|flights|travel|train|trip|itinerary|journey|fare|schedule)\b/i.test(text)) {
      return {
        category: "travel_planning",
        primaryIntent: "plan_travel_itinerary",
        needsTools: true,
        requiredTools: ["travel_search", "web_search", "mcp_ticket_automation_rpa"],
        requiresVision: false,
        requiresHumanApproval: false,
        isMultiModelRequested: false,
        entities,
      };
    }

    // 4. Check Coding & Software Architecture
    if (
      /\b(code|build|app|application|function|class|debug|refactor|error|bug|typescript|python|react|express|api|sql|database|repository|git)\b/i.test(
        text
      )
    ) {
      return {
        category: "coding",
        primaryIntent: "software_engineering",
        needsTools: true,
        requiredTools: ["code_execution"],
        requiresVision: false,
        requiresHumanApproval: false,
        isMultiModelRequested: false,
        entities,
      };
    }

    // 5. Check Complex Mathematical & Logic Reasoning
    if (
      /\b(solve|math|equation|calculate|proof|theorem|differential|matrix|algebra|integral|algorithm|complexity|np-hard|logic puzzle)\b/i.test(
        text
      )
    ) {
      return {
        category: "reasoning",
        primaryIntent: "mathematical_logical_reasoning",
        needsTools: true,
        requiredTools: ["code_execution"],
        requiresVision: false,
        requiresHumanApproval: false,
        isMultiModelRequested: false,
        entities,
      };
    }

    // 6. Check Deep Research & Real-time Info
    if (
      /\b(research|paper|study|latest|current|news|market|stock|weather|today|price|who is|what happened|verify)\b/i.test(
        text
      )
    ) {
      return {
        category: "research",
        primaryIntent: "deep_web_research",
        needsTools: true,
        requiredTools: ["web_search"],
        requiresVision: false,
        requiresHumanApproval: false,
        isMultiModelRequested: false,
        entities,
      };
    }

    // 7. Check Educational & Concept Explanation
    if (
      /\b(explain|teach|what is|how does|class 10|class 12|cbse|ncert|biology|chemistry|physics|history|concept|summary)\b/i.test(
        text
      )
    ) {
      return {
        category: "education",
        primaryIntent: "concept_explanation",
        needsTools: false,
        requiredTools: [],
        requiresVision: false,
        requiresHumanApproval: false,
        isMultiModelRequested: false,
        entities,
      };
    }

    // 8. Default to Simple / Conversational
    return {
      category: "simple",
      primaryIntent: "general_conversation",
      needsTools: false,
      requiredTools: [],
      requiresVision: false,
      requiresHumanApproval: false,
      isMultiModelRequested: false,
      entities,
    };
  }
}

export const intentClassifier = new IntentClassifier();
