import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import ReportCard from "@/lib/models/ReportCard";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const studentId = searchParams.get("studentId") || "";
    const term = searchParams.get("term") || "";
    const academicYear = searchParams.get("academicYear") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { reportCardId: { $regex: search, $options: "i" } },
      ];
    }
    if (studentId) filter.studentId = studentId;
    if (term) filter.term = term;
    if (academicYear) filter.academicYear = academicYear;

    const total = await ReportCard.countDocuments(filter);
    const reportCards = await ReportCard.find(filter)
      .select("-pdfPath")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      reportCards,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    console.error("List report cards error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { ids } = await req.json();
    if (!ids?.length) return NextResponse.json({ error: "IDs required" }, { status: 400 });

    await connectDB();
    const result = await ReportCard.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ message: `${result.deletedCount} report card(s) deleted` });
  } catch (error: unknown) {
    console.error("Delete report cards error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
