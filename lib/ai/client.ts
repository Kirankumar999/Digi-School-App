import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";

// --- Gemini (FREE tier — used for all text generation) ---

let _gemini: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured. Add it to your .env file.");
  if (!_gemini) _gemini = new GoogleGenAI({ apiKey });
  return _gemini;
}

export const GEMINI_MODEL = "gemini-2.5-flash";

// --- Anthropic (paid — used ONLY for vision/image tasks) ---

let _anthropic: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured. Add it to your .env file.");
  if (!_anthropic) _anthropic = new Anthropic({ apiKey });
  return _anthropic;
}

export const ANTHROPIC_VISION_MODEL = "claude-sonnet-4-20250514";

// --- Token usage tracking ---

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
  if (usage.model.includes("gemini")) return 0; // Free tier
  const inputRate = 3.0 / 1_000_000;
  const outputRate = 15.0 / 1_000_000;
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
