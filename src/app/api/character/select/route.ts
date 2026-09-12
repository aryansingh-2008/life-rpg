// src/app/api/character/select/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CHARACTERS_ROSTER } from "@/lib/charactersConfig";
import { getRequiredXpForNextLevel } from "@/lib/rpgEngine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { characterId } = body;

    if (!characterId) {
      return NextResponse.json(
        { error: "Character ID is required" },
        { status: 400 }
      );
    }

    const character = CHARACTERS_ROSTER.find((c) => c.id === characterId);
    if (!character) {
      return NextResponse.json(
        { error: "Character archetype not found in Aetheria roster" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: {
        inventory: {
          include: { item: true },
        },
        bossState: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse unlocked characters (aarav and ananya are always default unlocked)
    const unlockedList = Array.from(
      new Set([
        "aarav",
        "ananya",
        ...(user.unlockedCharacters
          ? user.unlockedCharacters.split(",").map((s) => s.trim()).filter(Boolean)
          : []),
      ])
    );

    if (!unlockedList.includes(characterId)) {
      return NextResponse.json(
        {
          error: `You have not yet recruited ${character.name}. Unlock them with ${character.coinCost} coins at Level ${character.requiredLevel}!`,
        },
        { status: 403 }
      );
    }

    // Update active equipped character
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        characterId,
      },
      include: {
        inventory: {
          include: { item: true },
          orderBy: { acquiredAt: "desc" },
        },
        bossState: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Equipped ${character.name} (${character.classTag})!`,
      character,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        level: updatedUser.level,
        xp: updatedUser.xp,
        nextLevelXp: getRequiredXpForNextLevel(updatedUser.level),
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
        unlockedCharacters: unlockedList,
        inventory: updatedUser.inventory,
        bossState: updatedUser.bossState,
      },
    });
  } catch (error: any) {
    console.error("Character selection error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to equip character" },
      { status: 500 }
    );
  }
}
