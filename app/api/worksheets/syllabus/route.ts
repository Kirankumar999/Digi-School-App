import { NextRequest, NextResponse } from "next/server";
import { getSubjects, getChapters, getTopics } from "@/lib/data/ncert-syllabus";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classNum = parseInt(searchParams.get("class") || "0", 10);
  const subject = searchParams.get("subject") || "";
  const chapter = searchParams.get("chapter") || "";

  if (chapter && subject && classNum) {
    return NextResponse.json({ topics: getTopics(classNum, subject, chapter) });
  }

  if (subject && classNum) {
    return NextResponse.json({ chapters: getChapters(classNum, subject) });
  }

  if (classNum) {
    return NextResponse.json({ subjects: getSubjects(classNum) });
  }

  return NextResponse.json({ classes: [1, 2, 3, 4, 5, 6, 7, 8] });
}
