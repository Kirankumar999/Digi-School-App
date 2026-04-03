import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import TestResult from "@/lib/models/TestResult";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const studentId = searchParams.get("studentId") || "";
    const subject = searchParams.get("subject") || "";
    const classNum = searchParams.get("classNum") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { testName: { $regex: search, $options: "i" } },
        { studentName: { $regex: search, $options: "i" } },
        { testResultId: { $regex: search, $options: "i" } },
      ];
    }
    if (studentId) filter.studentId = studentId;
    if (subject) filter.subject = subject;
    if (classNum) filter.classNum = parseInt(classNum, 10);

    const total = await TestResult.countDocuments(filter);
    const results = await TestResult.find(filter)
      .select("-questions -imageData")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      testResults: results,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    console.error("List test results error:", error);
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
    const result = await TestResult.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ message: `${result.deletedCount} result(s) deleted` });
  } catch (error: unknown) {
    console.error("Delete test results error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
