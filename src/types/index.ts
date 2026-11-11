export type ActiveTab =
  | "chat"
  | "astra"
  | "omni-core"
  | "vision-lab"
  | "live-agent"
  | "creative"
  | "agent-workbench"
  | "software-studio"
  | "speech-translate"
  | "mcp"
  | "universal"
  | "matrix"
  | "science"
  | "student"
  | "stocks"
  | "buyhatke"
  | "workspace"
  | "maps"
  | "space"
  | "labs"
  | "business"
  | "memory"
  | "plugins"
  | "evolution";

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  model: string;
  mode:
    | "standard"
    | "astra"
    | "thinking"
    | "pro"
    | "auto"
    | "claude_fable"
    | "gemini_carbon"
    | "claude_opus"
    | "claude_mythos"
    | "claude_sonnet"
    | "kimi_pro";
  pinned?: boolean;
}

export interface ArtifactItem {
  id: string;
  title: string;
  type: "html" | "react" | "svg" | "markdown" | "code";
  language: string;
  content: string;
}

export type CompanionProfileType = "MENTOR" | "CREATOR" | "ANALYST";

export interface ModelParameters {
  model: string;
  temperature: number;
  topP: number;
  thinkingBudget: number;
  systemInstruction: string;
  deepThinkingEnabled: boolean;
  searchGroundingEnabled: boolean;
  activePersona: CompanionProfileType;
}


export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  modelUsed?: string;
  sources?: Array<{ title: string; uri: string }>;
  telemetry?: {
    sentimentLabel?: string;
    sentimentScore?: number;
    rapportLevel?: string;
    bondLevel?: number;
    latencyMs?: number;
  };
}

export interface MatrixResponseItem {
  name: string;
  slug: string;
  provider: string;
  answer: string;
  success: boolean;
  latencyMs: number;
  mode: string;
  sources?: Array<{ title: string; uri: string }>;
}

export interface AIPlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  iconName: string;
  category: "Tool" | "Module" | "AI Capability";
  enabled: boolean;
  systemPromptModifier: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  theme: "dark" | "light";
  goal: string;
  interests: string;
  created: string;
  learningStyle: string;
  pacing: string;
  allowGoogleSearch: boolean;
  allowOfficeFeed: boolean;
  allowSelfUpdates: boolean;
  communicationStyle: string;
  sentimentLabel: string;
  sentimentScore: number;
  rapportLevel: string;
  bondLevel: number;
  interactionCount: number;
  brainwaveProfile: "Delta" | "Theta" | "Alpha" | "Beta" | "Gamma";
  soundscapeEnabled: boolean;
  soundscapeVolume: number;
  pinnedApps: string[];
}
