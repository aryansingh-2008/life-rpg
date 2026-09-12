// src/app/api/stats/logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.questLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 25,
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}
