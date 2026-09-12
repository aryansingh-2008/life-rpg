// src/app/api/quests/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DIFFICULTY_CONFIG, DifficultyType, AttributeType, QuestType } from "@/lib/rpgEngine";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const existingQuest = await prisma.quest.findUnique({
      where: { id },
    });

    if (!existingQuest || existingQuest.userId !== user.id) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, description, type, attribute, difficulty, dueDate } = body;

    const validDifficulty = (difficulty || existingQuest.difficulty).toUpperCase() as DifficultyType;
    const validAttribute = (attribute || existingQuest.attribute).toUpperCase() as AttributeType;
    const validType = (type || existingQuest.type).toUpperCase() as QuestType;

    const diffSettings = DIFFICULTY_CONFIG[validDifficulty] || DIFFICULTY_CONFIG.MEDIUM;

    const updated = await prisma.quest.update({
      where: { id },
      data: {
        title: title ? title.trim() : existingQuest.title,
        description: description !== undefined ? description?.trim() : existingQuest.description,
        type: validType,
        attribute: validAttribute,
        difficulty: validDifficulty,
        xpReward: diffSettings.xp,
        goldReward: diffSettings.gold,
        dueDate: dueDate ? new Date(dueDate) : existingQuest.dueDate,
      },
    });

    return NextResponse.json({ success: true, quest: updated });
  } catch (error: any) {
    console.error("Update quest error:", error);
    return NextResponse.json(
      { error: "Failed to update quest" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const existingQuest = await prisma.quest.findUnique({
      where: { id },
    });

    if (!existingQuest || existingQuest.userId !== user.id) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    await prisma.quest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Quest removed" });
  } catch (error: any) {
    console.error("Delete quest error:", error);
    return NextResponse.json(
      { error: "Failed to delete quest" },
      { status: 500 }
    );
  }
}
