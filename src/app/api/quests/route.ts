// src/app/api/quests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DIFFICULTY_CONFIG, DifficultyType, AttributeType, QuestType } from "@/lib/rpgEngine";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const attribute = searchParams.get("attribute");
    const completed = searchParams.get("completed");

    const whereClause: any = { userId: user.id };

    if (type && type !== "ALL") {
      whereClause.type = type;
    }
    if (attribute && attribute !== "ALL") {
      whereClause.attribute = attribute;
    }
    if (completed !== null && completed !== undefined && completed !== "") {
      whereClause.completed = completed === "true";
    }

    const quests = await prisma.quest.findMany({
      where: whereClause,
      orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, quests });
  } catch (error: any) {
    console.error("Fetch quests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quests" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, type, attribute, difficulty, dueDate } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Quest title cannot be empty" },
        { status: 400 }
      );
    }

    const validDifficulty = (difficulty || "MEDIUM").toUpperCase() as DifficultyType;
    const validAttribute = (attribute || "INTELLECT").toUpperCase() as AttributeType;
    const validType = (type || "DAILY").toUpperCase() as QuestType;

    const diffSettings = DIFFICULTY_CONFIG[validDifficulty] || DIFFICULTY_CONFIG.MEDIUM;

    const quest = await prisma.quest.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        type: validType,
        attribute: validAttribute,
        difficulty: validDifficulty,
        xpReward: diffSettings.xp,
        goldReward: diffSettings.gold,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json({ success: true, quest }, { status: 201 });
  } catch (error: any) {
    console.error("Create quest error:", error);
    return NextResponse.json(
      { error: "Failed to create quest" },
      { status: 500 }
    );
  }
}
