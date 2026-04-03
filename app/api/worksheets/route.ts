import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Worksheet from "@/lib/models/Worksheet";

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
    const difficulty = searchParams.get("difficulty") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { worksheetId: { $regex: search, $options: "i" } },
        { chapter: { $regex: search, $options: "i" } },
        { topic: { $regex: search, $options: "i" } },
      ];
    }
    if (classNum) filter.classNum = parseInt(classNum, 10);
    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;

    const total = await Worksheet.countDocuments(filter);
    const worksheets = await Worksheet.find(filter)
      .select("-questions")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      worksheets,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    console.error("List worksheets error:", error);
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
      return NextResponse.json({ error: "Worksheet IDs are required" }, { status: 400 });
    }

    await connectDB();
    const result = await Worksheet.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      message: `${result.deletedCount} worksheet(s) deleted successfully`,
    });
  } catch (error: unknown) {
    console.error("Delete worksheets error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
