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

    // Authoritatively reset DAILY quests that were completed on previous calendar days
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const userDailies = await prisma.quest.findMany({
      where: {
        userId: user.id,
        type: "DAILY",
      },
    });

    for (const daily of userDailies) {
      if (daily.completedAt) {
        const compDate = new Date(daily.completedAt);
        const compMidnight = new Date(
          compDate.getFullYear(),
          compDate.getMonth(),
          compDate.getDate()
        ).getTime();
        const daysDiff = Math.round((todayMidnight - compMidnight) / (1000 * 60 * 60 * 24));

        if (daily.completed && daysDiff >= 1) {
          // Completed on a previous day -> Reset for today!
          // If daysDiff === 1, streak is intact from yesterday.
          // If daysDiff >= 2, missed 1+ days -> streak resets to 0.
          const newStreak = daysDiff === 1 ? daily.streak : 0;
          await prisma.quest.update({
            where: { id: daily.id },
            data: {
              completed: false,
              streak: newStreak,
            },
          });
        } else if (!daily.completed && daysDiff >= 2 && daily.streak > 0) {
          // Missed completing yesterday -> streak broken
          await prisma.quest.update({
            where: { id: daily.id },
            data: {
              streak: 0,
            },
          });
        }
      }
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
