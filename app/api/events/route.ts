import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import SchoolEvent from "@/lib/models/SchoolEvent";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") || "";
    const eventType = searchParams.get("eventType") || "";

    const filter: Record<string, unknown> = {};
    if (month) filter.startDate = { $regex: `^${month}` };
    if (eventType) filter.eventType = eventType;

    const events = await SchoolEvent.find(filter).sort({ startDate: 1 }).lean();
    return NextResponse.json({ events });
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

    const event = await SchoolEvent.create({
      ...body,
      createdBy: user._id?.toString() || "",
    });

    return NextResponse.json({ message: "Event created", event }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
