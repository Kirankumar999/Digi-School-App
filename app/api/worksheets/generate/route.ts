import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Worksheet from "@/lib/models/Worksheet";
import { GenerateRequestSchema, WorksheetAIResponseSchema } from "@/lib/worksheet/schema";
import { buildPrompt, buildRetryPrompt } from "@/lib/worksheet/prompt-engine";
import { buildCacheKey, getCached, setCache } from "@/lib/worksheet/cache";
import { getGeminiClient, GEMINI_MODEL, logTokenUsage } from "@/lib/ai/client";
import { extractJSON } from "@/lib/ai/extract-json";
import { normalizeWorksheet } from "@/lib/ai/normalize";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let ai;
    try { ai = getGeminiClient(); } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 500 });
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

    const cacheKey = buildCacheKey(genReq);
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      return NextResponse.json({
        message: "Worksheet retrieved from cache",
        worksheet: JSON.parse(cachedData),
        cached: true,
      });
    }

    const prompt = buildPrompt(genReq);

    let worksheetData;
    let attempts = 0;
    let lastError = "";

    while (attempts < 2) {
      attempts++;
      const currentPrompt = attempts === 1 ? prompt : buildRetryPrompt(prompt, lastError);

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: currentPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text ?? "";

      logTokenUsage({
        inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        model: GEMINI_MODEL,
        feature: "worksheet",
        cached: attempts > 1,
      });

      try {
        const jsonStr = extractJSON(text);
        const raw = normalizeWorksheet(JSON.parse(jsonStr));
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
