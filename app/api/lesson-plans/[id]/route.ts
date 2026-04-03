import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import LessonPlan from "@/lib/models/LessonPlan";

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

    return NextResponse.json({ lessonPlan: plan });
  } catch (error: unknown) {
    console.error("Get lesson plan error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
