// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getRequiredXpForNextLevel } from "@/lib/rpgEngine";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Refresh user with full relational data
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        inventory: {
          include: { item: true },
          orderBy: { acquiredAt: "desc" },
        },
        bossState: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const nextLevelXp = getRequiredXpForNextLevel(fullUser.level);

    return NextResponse.json({
      success: true,
      user: {
        id: fullUser.id,
        username: fullUser.username,
        email: fullUser.email,
        level: fullUser.level,
        xp: fullUser.xp,
        nextLevelXp,
        gold: fullUser.gold,
        hp: fullUser.hp,
        maxHp: fullUser.maxHp,
        mana: fullUser.mana,
        maxMana: fullUser.maxMana,
        streak: fullUser.streak,
        strength: fullUser.strength,
        intellect: fullUser.intellect,
        agility: fullUser.agility,
        vitality: fullUser.vitality,
        spirit: fullUser.spirit,
        title: fullUser.title,
        unspentPoints: fullUser.unspentPoints,
        inventory: fullUser.inventory,
        bossState: fullUser.bossState,
      },
    });
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching character" },
      { status: 500 }
    );
  }
}
