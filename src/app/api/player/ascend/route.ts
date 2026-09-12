// src/app/api/player/ascend/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  getRequiredXpForNextLevel,
  getRequiredGoldForLevelUp,
  getPlayerTitle,
} from "@/lib/rpgEngine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: {
        inventory: { include: { item: true } },
        bossState: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const requiredXp = getRequiredXpForNextLevel(user.level);
    if (user.xp < requiredXp) {
      return NextResponse.json(
        {
          error: `XP requirement not met for Rank Ascension! Need ${requiredXp} XP (Current: ${user.xp} XP).`,
        },
        { status: 400 }
      );
    }

    const requiredGold = getRequiredGoldForLevelUp(user.level);
    if (user.gold < requiredGold) {
      return NextResponse.json(
        {
          error: `Insufficient coins for Rank Ascension! Requires ${requiredGold} coins (Current: ${user.gold} coins).`,
        },
        { status: 400 }
      );
    }

    const newLevel = user.level + 1;
    const newXp = user.xp - requiredXp;
    const newGold = user.gold - requiredGold;
    const newTitle = getPlayerTitle(newLevel);
    const statPointsAwarded = 2;

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          level: newLevel,
          xp: newXp,
          gold: newGold,
          title: newTitle,
          unspentPoints: { increment: statPointsAwarded },
          maxHp: { increment: 15 },
          hp: { increment: 15 },
          maxMana: { increment: 10 },
          mana: { increment: 10 },
          questLogs: {
            create: {
              questTitle: `Ascended to Level ${newLevel}! (${newTitle})`,
              action: "COMPLETED",
              goldGained: -requiredGold,
              xpGained: 0,
            },
          },
        },
        include: {
          inventory: { include: { item: true } },
          bossState: true,
        },
      }),
    ]);

    const unlockedCharacters = Array.from(
      new Set([
        "aarav",
        "ananya",
        ...(updatedUser.unlockedCharacters
          ? updatedUser.unlockedCharacters.split(",").map((s) => s.trim())
          : []),
      ])
    );

    return NextResponse.json({
      success: true,
      message: `Successfully ascended to Level ${newLevel}!`,
      progression: {
        didLevelUp: true,
        newLevel,
        statPointsAwarded,
        goldCost: requiredGold,
        title: newTitle,
      },
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        level: updatedUser.level,
        xp: updatedUser.xp,
        nextLevelXp: getRequiredXpForNextLevel(updatedUser.level),
        requiredGoldForLevelUp: getRequiredGoldForLevelUp(updatedUser.level),
        gold: updatedUser.gold,
        hp: updatedUser.hp,
        maxHp: updatedUser.maxHp,
        mana: updatedUser.mana,
        maxMana: updatedUser.maxMana,
        streak: updatedUser.streak,
        strength: updatedUser.strength,
        intellect: updatedUser.intellect,
        agility: updatedUser.agility,
        vitality: updatedUser.vitality,
        spirit: updatedUser.spirit,
        title: updatedUser.title,
        unspentPoints: updatedUser.unspentPoints,
        characterId: updatedUser.characterId || "aarav",
        unlockedCharacters,
        inventory: updatedUser.inventory,
        bossState: updatedUser.bossState,
      },
    });
  } catch (error: any) {
    console.error("Player ascension error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process Rank Ascension" },
      { status: 500 }
    );
  }
}
