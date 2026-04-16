import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Timetable from "@/lib/models/Timetable";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade") || "";
    const section = searchParams.get("section") || "";
    const status = searchParams.get("status") || "Active";

    const filter: Record<string, unknown> = {};
    if (grade) filter.grade = grade;
    if (section) filter.section = section;
    if (status) filter.status = status;

    const timetables = await Timetable.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ timetables });
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
    await connectDB();

    const timetableId = `TT-${body.grade}-${body.section}-${Date.now().toString(36).toUpperCase()}`;

    const timetable = await Timetable.findOneAndUpdate(
      { grade: body.grade, section: body.section, status: "Active" },
      {
        ...body,
        timetableId,
        createdBy: user.name || "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: "Timetable saved", timetable }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
