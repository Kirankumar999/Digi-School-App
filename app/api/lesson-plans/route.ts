import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import LessonPlan from "@/lib/models/LessonPlan";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const classNum = searchParams.get("classNum") || "";
    const subject = searchParams.get("subject") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { lessonPlanId: { $regex: search, $options: "i" } },
        { chapter: { $regex: search, $options: "i" } },
        { topic: { $regex: search, $options: "i" } },
      ];
    }
    if (classNum) filter.classNum = parseInt(classNum, 10);
    if (subject) filter.subject = subject;

    const total = await LessonPlan.countDocuments(filter);
    const plans = await LessonPlan.find(filter)
      .select("-lessonFlow -differentiatedInstruction -boardWork -assessmentCriteria")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      lessonPlans: plans,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    console.error("List lesson plans error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "IDs are required" }, { status: 400 });
    }

    await connectDB();
    const result = await LessonPlan.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      message: `${result.deletedCount} lesson plan(s) deleted`,
    });
  } catch (error: unknown) {
    console.error("Delete lesson plans error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
