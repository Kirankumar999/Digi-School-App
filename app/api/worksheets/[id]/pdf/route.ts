import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Worksheet from "@/lib/models/Worksheet";
import { WorksheetAIResponseSchema } from "@/lib/worksheet/schema";
import { generateWorksheetHTML, generatePDF } from "@/lib/worksheet/pdf-generator";
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

    const worksheet = await Worksheet.findById(id).lean();
    if (!worksheet) {
      return NextResponse.json({ error: "Worksheet not found" }, { status: 404 });
    }

    // Check if PDF already exists
    if (worksheet.pdfPath) {
      try {
        await access(worksheet.pdfPath);
        const existingPdf = await readFile(worksheet.pdfPath);
        return new NextResponse(new Uint8Array(existingPdf), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${worksheet.worksheetId}.pdf"`,
          },
        });
      } catch {
        // PDF file missing — regenerate
      }
    }

    // Validate questions structure
    const parsed = WorksheetAIResponseSchema.safeParse({
      title: worksheet.title,
      instructions: worksheet.instructions || "",
      questions: worksheet.questions,
      totalMarks: worksheet.totalMarks,
      estimatedTime: worksheet.estimatedTime || "30 minutes",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Worksheet data is malformed, cannot generate PDF" },
        { status: 422 }
      );
    }

    // Generate HTML then PDF
    const html = generateWorksheetHTML(parsed.data, {
      classNum: worksheet.classNum,
      subject: worksheet.subject,
      chapter: worksheet.chapter,
      difficulty: worksheet.difficulty,
      includeAnswerKey: worksheet.includeAnswerKey,
    });

    const pdfBuffer = await generatePDF(html);

    // Save to local storage
    const storagePath = path.join(process.cwd(), "storage", "worksheets");
    const filePath = path.join(storagePath, `${worksheet.worksheetId}.pdf`);
    await writeFile(filePath, pdfBuffer);

    // Update pdfPath in DB
    await Worksheet.findByIdAndUpdate(id, { pdfPath: filePath });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${worksheet.worksheetId}.pdf"`,
      },
    });
  } catch (error: unknown) {
    console.error("Generate PDF error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
