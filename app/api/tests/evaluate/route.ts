import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Student from "@/lib/models/Student";
import TestResult from "@/lib/models/TestResult";
import { EvaluateRequestSchema, EvaluationAIResponseSchema } from "@/lib/test-evaluator/schema";
import { buildEvaluationPrompt, buildEvaluationRetryPrompt } from "@/lib/test-evaluator/prompt-engine";

function extractJSON(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned;
}

function inferMediaType(base64: string): "image/jpeg" | "image/png" | "image/gif" | "image/webp" {
  if (base64.startsWith("/9j/")) return "image/jpeg";
  if (base64.startsWith("iVBOR")) return "image/png";
  if (base64.startsWith("R0lGO")) return "image/gif";
  if (base64.startsWith("UklGR")) return "image/webp";
  return "image/jpeg";
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    const body = await req.json();
    const parsed = EvaluateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }
    const evalReq = parsed.data;

    await connectDB();

    const student = await Student.findById(evalReq.studentId).lean();
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Strip data URI prefix if present
    let imageBase64 = evalReq.imageBase64;
    if (imageBase64.includes(",")) {
      imageBase64 = imageBase64.split(",")[1];
    }

    const mediaType = inferMediaType(imageBase64);
    const prompt = buildEvaluationPrompt(evalReq);
    const anthropic = new Anthropic({ apiKey });

    let evalData;
    let attempts = 0;
    let lastError = "";

    while (attempts < 2) {
      attempts++;
      const currentPrompt = attempts === 1 ? prompt : buildEvaluationRetryPrompt(prompt, lastError);

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            { type: "text", text: currentPrompt },
          ],
        }],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        lastError = "AI returned non-text content";
        continue;
      }

      try {
        const jsonStr = extractJSON(content.text);
        const raw = JSON.parse(jsonStr);
        const validated = EvaluationAIResponseSchema.safeParse(raw);

        if (!validated.success) {
          lastError = validated.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
          if (attempts < 2) continue;
          return NextResponse.json({ error: "AI evaluation failed validation", details: lastError }, { status: 422 });
        }

        evalData = validated.data;
        break;
      } catch (parseErr) {
        lastError = parseErr instanceof Error ? parseErr.message : "JSON parse failed";
        if (attempts < 2) continue;
        return NextResponse.json({ error: "Failed to parse AI response", details: lastError }, { status: 422 });
      }
    }

    if (!evalData) {
      return NextResponse.json({ error: "Failed to evaluate answer sheet" }, { status: 500 });
    }

    const testResultId = `TR-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const saved = await TestResult.create({
      testResultId,
      studentId: student._id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentGrade: student.grade,
      studentSection: student.section,
      testName: evalData.testName || evalReq.testName,
      subject: evalData.subject || evalReq.subject,
      chapter: evalReq.chapter || "",
      classNum: evalReq.classNum,
      totalMarks: evalData.totalMarks,
      marksObtained: evalData.marksObtained,
      percentage: evalData.percentage,
      grade: evalData.grade,
      questions: evalData.questions,
      overallFeedback: evalData.overallFeedback,
      strengths: evalData.strengths,
      areasToImprove: evalData.areasToImprove,
      imageData: evalReq.imageBase64.length > 50000 ? "" : evalReq.imageBase64,
      evaluatedBy: user._id?.toString() || "",
    });

    return NextResponse.json({
      message: "Answer sheet evaluated successfully",
      testResult: {
        _id: saved._id,
        testResultId,
        studentName: `${student.firstName} ${student.lastName}`,
        studentGrade: student.grade,
        ...evalData,
        classNum: evalReq.classNum,
        chapter: evalReq.chapter || "",
      },
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("Evaluate test error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
