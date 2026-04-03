import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Worksheet from "@/lib/models/Worksheet";
import { GenerateRequestSchema, WorksheetAIResponseSchema } from "@/lib/worksheet/schema";
import { buildPrompt, buildRetryPrompt } from "@/lib/worksheet/prompt-engine";
import { buildCacheKey, getCached, setCache } from "@/lib/worksheet/cache";

function extractJSON(text: string): string {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured. Add it to your .env file." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const parsed = GenerateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const genReq = parsed.data;

    // Check cache first
    const cacheKey = buildCacheKey(genReq);
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      const cachedWorksheet = JSON.parse(cachedData);
      return NextResponse.json({
        message: "Worksheet retrieved from cache",
        worksheet: cachedWorksheet,
        cached: true,
      });
    }

    // Build prompt and call Claude
    const prompt = buildPrompt(genReq);
    const anthropic = new Anthropic({ apiKey });

    let worksheetData;
    let attempts = 0;
    let lastError = "";

    while (attempts < 2) {
      attempts++;
      const currentPrompt = attempts === 1 ? prompt : buildRetryPrompt(prompt, lastError);

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: currentPrompt }],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        lastError = "AI returned non-text content";
        continue;
      }

      try {
        const jsonStr = extractJSON(content.text);
        const raw = JSON.parse(jsonStr);
        const validated = WorksheetAIResponseSchema.safeParse(raw);

        if (!validated.success) {
          lastError = validated.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
          if (attempts < 2) continue;
          return NextResponse.json(
            { error: "AI output failed validation after retry", details: lastError },
            { status: 422 }
          );
        }

        worksheetData = validated.data;
        break;
      } catch (parseErr) {
        lastError = parseErr instanceof Error ? parseErr.message : "JSON parse failed";
        if (attempts < 2) continue;
        return NextResponse.json(
          { error: "Failed to parse AI response as JSON after retry", details: lastError },
          { status: 422 }
        );
      }
    }

    if (!worksheetData) {
      return NextResponse.json({ error: "Failed to generate worksheet" }, { status: 500 });
    }

    // Save to MongoDB
    await connectDB();
    const worksheetId = `WS-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const saved = await Worksheet.create({
      worksheetId,
      title: worksheetData.title,
      classNum: genReq.classNum,
      subject: genReq.subject,
      chapter: genReq.chapter,
      topic: genReq.topic || "",
      difficulty: genReq.difficulty,
      language: genReq.language,
      questionTypes: genReq.questionTypes,
      numQuestions: genReq.numQuestions,
      totalMarks: worksheetData.totalMarks,
      estimatedTime: worksheetData.estimatedTime,
      instructions: worksheetData.instructions,
      questions: worksheetData.questions,
      includeAnswerKey: genReq.includeAnswerKey,
      generatedBy: user._id?.toString() || "",
      cached: false,
    });

    // Cache the result
    const cachePayload = JSON.stringify({
      _id: saved._id,
      ...worksheetData,
      worksheetId,
      classNum: genReq.classNum,
      subject: genReq.subject,
      chapter: genReq.chapter,
      topic: genReq.topic || "",
      difficulty: genReq.difficulty,
    });
    await setCache(cacheKey, cachePayload);

    return NextResponse.json(
      {
        message: "Worksheet generated successfully",
        worksheet: {
          _id: saved._id,
          worksheetId,
          ...worksheetData,
          classNum: genReq.classNum,
          subject: genReq.subject,
          chapter: genReq.chapter,
          topic: genReq.topic || "",
          difficulty: genReq.difficulty,
        },
        cached: false,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Generate worksheet error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
