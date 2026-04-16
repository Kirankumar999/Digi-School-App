import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import NotificationModel from "@/lib/models/Notification";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const total = await NotificationModel.countDocuments(filter);
    const notifications = await NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ notifications, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
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

    if (Array.isArray(body)) {
      const notifications = await NotificationModel.insertMany(
        body.map((n) => ({ ...n, status: "pending" }))
      );
      return NextResponse.json({ message: `${notifications.length} notifications queued`, count: notifications.length }, { status: 201 });
    }

    const notification = await NotificationModel.create({ ...body, status: "pending" });
    return NextResponse.json({ message: "Notification queued", notification }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
