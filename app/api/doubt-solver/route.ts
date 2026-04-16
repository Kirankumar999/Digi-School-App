import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import DoubtQuestion from "@/lib/models/DoubtQuestion";
import { getGeminiClient, GEMINI_MODEL, logTokenUsage } from "@/lib/ai/client";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};
    if (studentId) filter.studentId = studentId;

    const total = await DoubtQuestion.countDocuments(filter);
    const questions = await DoubtQuestion.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ questions, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { studentId, studentName, classGrade, subject, chapter, question, language } = body;

    if (!question && !body.questionImage) {
      return NextResponse.json({ error: "Question text or image required" }, { status: 400 });
    }

    await connectDB();

    const doubt = await DoubtQuestion.create({
      studentId: studentId || user._id?.toString() || "",
      studentName: studentName || user.name || "",
      classGrade: classGrade || "",
      subject: subject || "",
      chapter: chapter || "",
      question: question || "",
      questionImage: body.questionImage || "",
      language: language || "English",
      status: "Pending",
    });

    try {
      const ai = getGeminiClient();
      const langInstructions: Record<string, string> = {
        English: "Respond in English.",
        Marathi: "Respond in Marathi (मराठी). Use Devanagari script.",
        Hindi: "Respond in Hindi (हिंदी). Use Devanagari script.",
      };

      const prompt = `You are a friendly, patient MSCERT curriculum tutor for Class ${classGrade || "5"} students in Maharashtra.
${subject ? `Subject: ${subject}` : ""}${chapter ? `, Chapter: ${chapter}` : ""}
${langInstructions[language] || langInstructions.English}

Student's question: ${question || "See the image for the question."}

Provide a clear, step-by-step explanation that a child can understand.
Use simple language, examples, and analogies.
If it's a math problem, show each step clearly.
End with a brief summary of the key concept.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const answer = response.text || "Could not generate answer. Please try again.";

      if (response.usageMetadata) {
        logTokenUsage({
          model: GEMINI_MODEL,
          feature: "doubt-solver",
          inputTokens: response.usageMetadata.promptTokenCount || 0,
          outputTokens: response.usageMetadata.candidatesTokenCount || 0,
        });
      }

      doubt.answer = answer;
      doubt.status = "Answered";
      doubt.answeredBy = "AI";
      await doubt.save();

      return NextResponse.json({ message: "Answer generated", doubt }, { status: 201 });
    } catch (aiError) {
      console.error("AI doubt solver error:", aiError);
      doubt.status = "Failed";
      await doubt.save();
      return NextResponse.json({ message: "Question saved but AI failed", doubt }, { status: 201 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
