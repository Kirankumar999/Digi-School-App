/**
 * Robustly extract a JSON object from AI text output.
 * Handles: markdown fences, trailing commentary, leading text before JSON.
 */
export function extractJSON(text: string): string {
  let cleaned = text.trim();

  // Strip markdown code fences
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```[\s\S]*$/, "");
  }

  // Find the first { and match to its closing }
  const start = cleaned.indexOf("{");
  if (start === -1) return cleaned;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (ch === "\\") {
      escape = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return cleaned.slice(start, i + 1);
      }
    }
  }

  // Fallback: return from first { to end
  return cleaned.slice(start);
}
