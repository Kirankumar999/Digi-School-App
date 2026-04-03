import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import LessonPlan from "@/lib/models/LessonPlan";
import { GenerateLessonPlanRequestSchema, LessonPlanAIResponseSchema } from "@/lib/lesson-plan/schema";
import { buildLessonPlanPrompt, buildLessonPlanRetryPrompt } from "@/lib/lesson-plan/prompt-engine";
import { buildCacheKey, getCached, setCache } from "@/lib/worksheet/cache";

function extractJSON(text: string): string {
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
    const parsed = GenerateLessonPlanRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const genReq = parsed.data;

    // Build cache key (reuse worksheet cache infra with "lp:" prefix)
    const cacheKey = `lp:${genReq.classNum}:${genReq.subject}:${genReq.chapter}:${genReq.topic || "all"}:${genReq.duration}:${genReq.teachingMethod}:${new Date().toISOString().split("T")[0]}`;
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      return NextResponse.json({
        message: "Lesson plan retrieved from cache",
        lessonPlan: JSON.parse(cachedData),
        cached: true,
      });
    }

    const prompt = buildLessonPlanPrompt(genReq);
    const anthropic = new Anthropic({ apiKey });

    let planData;
    let attempts = 0;
    let lastError = "";

    while (attempts < 2) {
      attempts++;
      const currentPrompt = attempts === 1 ? prompt : buildLessonPlanRetryPrompt(prompt, lastError);

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
        const validated = LessonPlanAIResponseSchema.safeParse(raw);

        if (!validated.success) {
          lastError = validated.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
          if (attempts < 2) continue;
          return NextResponse.json(
            { error: "AI output failed validation after retry", details: lastError },
            { status: 422 }
          );
        }

        planData = validated.data;
        break;
      } catch (parseErr) {
        lastError = parseErr instanceof Error ? parseErr.message : "JSON parse failed";
        if (attempts < 2) continue;
        return NextResponse.json(
          { error: "Failed to parse AI response after retry", details: lastError },
          { status: 422 }
        );
      }
    }

    if (!planData) {
      return NextResponse.json({ error: "Failed to generate lesson plan" }, { status: 500 });
    }

    await connectDB();
    const lessonPlanId = `LP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const saved = await LessonPlan.create({
      lessonPlanId,
      title: planData.title,
      classNum: genReq.classNum,
      subject: genReq.subject,
      chapter: genReq.chapter,
      topic: genReq.topic || "",
      duration: genReq.duration,
      teachingMethod: genReq.teachingMethod,
      language: genReq.language,
      learningObjectives: planData.learningObjectives,
      prerequisites: planData.prerequisites,
      materialsNeeded: planData.materialsNeeded,
      lessonFlow: planData.lessonFlow,
      differentiatedInstruction: planData.differentiatedInstruction,
      boardWork: planData.boardWork,
      homework: planData.homework,
      assessmentCriteria: planData.assessmentCriteria,
      crossCurricularLinks: planData.crossCurricularLinks || "",
      teacherReflection: planData.teacherReflection || "",
      generatedBy: user._id?.toString() || "",
      cached: false,
    });

    const responsePayload = {
      _id: saved._id,
      lessonPlanId,
      ...planData,
      classNum: genReq.classNum,
      subject: genReq.subject,
      chapter: genReq.chapter,
      topic: genReq.topic || "",
      duration: genReq.duration,
      teachingMethod: genReq.teachingMethod,
    };

    await setCache(cacheKey, JSON.stringify(responsePayload));

    return NextResponse.json(
      { message: "Lesson plan generated successfully", lessonPlan: responsePayload, cached: false },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Generate lesson plan error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
