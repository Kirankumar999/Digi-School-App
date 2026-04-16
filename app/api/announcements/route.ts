import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Announcement from "@/lib/models/Announcement";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const total = await Announcement.countDocuments(filter);
    const announcements = await Announcement.find(filter)
      .sort({ pinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ announcements, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
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

    const announcement = await Announcement.create({
      ...body,
      createdBy: user._id?.toString() || "",
      createdByName: user.name || "",
    });

    return NextResponse.json({ message: "Announcement created", announcement }, { status: 201 });
  } catch (error: unknown) {
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
    const result = await Announcement.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ message: `${result.deletedCount} announcement(s) deleted` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
