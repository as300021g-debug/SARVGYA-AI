// ============================================================================
// SARVAGYA AI — PROVIDER REGISTRY (`server/ai/providers/ProviderRegistry.ts`)
// Manages and queries registered AI providers (Astra, Gemini, Fast)
// ============================================================================

import type { AIProvider, AIProviderName, ProviderHealth } from "./AIProvider.ts";
import { astraProvider } from "./AstraProvider.ts";
import { geminiProvider } from "./GeminiProvider.ts";
import { claudeProvider } from "./ClaudeProvider.ts";

export class ProviderRegistry {
  private providers = new Map<AIProviderName, AIProvider>();

  constructor() {
    this.register(astraProvider);
    this.register(geminiProvider);
    this.register(claudeProvider);
  }

  public register(provider: AIProvider): void {
    this.providers.set(provider.name, provider);
  }

  public get(name: AIProviderName): AIProvider | undefined {
    return this.providers.get(name);
  }

  public list(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  public async getOverallHealth(): Promise<Record<AIProviderName, ProviderHealth>> {
    const healthMap: any = {};
    for (const [name, provider] of this.providers.entries()) {
      healthMap[name] = await provider.getHealth();
    }
    return healthMap;
  }
}

export const providerRegistry = new ProviderRegistry();
