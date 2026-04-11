import Anthropic from "@anthropic-ai/sdk";

export type AIModel = "fast" | "standard" | "vision";

const MODEL_MAP: Record<AIModel, string> = {
  fast: "claude-haiku-4-20250414",
  standard: "claude-haiku-4-20250414",
  vision: "claude-sonnet-4-20250514",
};

const MAX_TOKENS_MAP: Record<AIModel, number> = {
  fast: 2048,
  standard: 3072,
  vision: 4096,
};

let _client: Anthropic | null = null;

export function getAIClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured. Add it to your .env file.");
  if (!_client) _client = new Anthropic({ apiKey });
  return _client;
}

export function getModelId(tier: AIModel): string {
  return MODEL_MAP[tier];
}

export function getMaxTokens(tier: AIModel): number {
  return MAX_TOKENS_MAP[tier];
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  model: string;
  feature: string;
  cached: boolean;
}

const usageLog: TokenUsage[] = [];

export function logTokenUsage(usage: TokenUsage): void {
  usageLog.push(usage);
  const cost = estimateCost(usage);
  console.log(
    `[AI Usage] ${usage.feature} | ${usage.model} | in:${usage.inputTokens} out:${usage.outputTokens} | ~$${cost.toFixed(5)}${usage.cached ? " (retry)" : ""}`
  );
}

function estimateCost(usage: TokenUsage): number {
  const isHaiku = usage.model.includes("haiku");
  const inputRate = isHaiku ? 0.80 / 1_000_000 : 3.0 / 1_000_000;
  const outputRate = isHaiku ? 4.0 / 1_000_000 : 15.0 / 1_000_000;
  return usage.inputTokens * inputRate + usage.outputTokens * outputRate;
}

export function getUsageSummary(): { total: number; breakdown: Record<string, number> } {
  let total = 0;
  const breakdown: Record<string, number> = {};
  for (const u of usageLog) {
    const cost = estimateCost(u);
    total += cost;
    breakdown[u.feature] = (breakdown[u.feature] || 0) + cost;
  }
  return { total, breakdown };
}
