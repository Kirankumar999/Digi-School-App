import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getUsageSummary } from "@/lib/ai/client";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const usage = getUsageSummary();
  return NextResponse.json(usage);
}
