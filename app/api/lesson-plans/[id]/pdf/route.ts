import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import LessonPlan from "@/lib/models/LessonPlan";
import { LessonPlanAIResponseSchema } from "@/lib/lesson-plan/schema";
import { generateLessonPlanHTML, generateLessonPlanPDF } from "@/lib/lesson-plan/pdf-generator";
import { writeFile, readFile, access } from "fs/promises";
import path from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const plan = await LessonPlan.findById(id).lean();
    if (!plan) {
      return NextResponse.json({ error: "Lesson plan not found" }, { status: 404 });
    }

    if (plan.pdfPath) {
      try {
        await access(plan.pdfPath);
        const existing = await readFile(plan.pdfPath);
        return new NextResponse(new Uint8Array(existing), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${plan.lessonPlanId}.pdf"`,
          },
        });
      } catch {
        // file missing — regenerate
      }
    }

    const parsed = LessonPlanAIResponseSchema.safeParse({
      title: plan.title,
      learningObjectives: plan.learningObjectives,
      prerequisites: plan.prerequisites,
      materialsNeeded: plan.materialsNeeded,
      lessonFlow: plan.lessonFlow,
      differentiatedInstruction: plan.differentiatedInstruction,
      boardWork: plan.boardWork || " ",
      homework: plan.homework || " ",
      assessmentCriteria: plan.assessmentCriteria,
      crossCurricularLinks: plan.crossCurricularLinks || undefined,
      teacherReflection: plan.teacherReflection || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Lesson plan data is malformed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const html = generateLessonPlanHTML(parsed.data, {
      classNum: plan.classNum,
      subject: plan.subject,
      chapter: plan.chapter,
      topic: plan.topic || undefined,
      duration: plan.duration,
      teachingMethod: plan.teachingMethod,
    });

    const pdfBuffer = await generateLessonPlanPDF(html);

    const storagePath = path.join(process.cwd(), "storage", "worksheets");
    const filePath = path.join(storagePath, `${plan.lessonPlanId}.pdf`);
    await writeFile(filePath, pdfBuffer);
    await LessonPlan.findByIdAndUpdate(id, { pdfPath: filePath });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${plan.lessonPlanId}.pdf"`,
      },
    });
  } catch (error: unknown) {
    console.error("Generate lesson plan PDF error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
