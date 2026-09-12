// src/app/api/character/unlock/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getCharacterById, CHARACTERS_ROSTER } from "@/lib/charactersConfig";
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

    // Parse current unlocked characters
    const unlockedList = Array.from(
      new Set([
        "aarav",
        "ananya",
        ...(user.unlockedCharacters
          ? user.unlockedCharacters.split(",").map((s) => s.trim()).filter(Boolean)
          : []),
      ])
    );

    // If already unlocked
    if (unlockedList.includes(characterId)) {
      return NextResponse.json({
        success: true,
        message: `${character.name} is already recruited.`,
        user: {
          ...user,
          nextLevelXp: getRequiredXpForNextLevel(user.level),
          unlockedCharacters: unlockedList,
        },
      });
    }

    // Check level requirement
    if (user.level < character.requiredLevel) {
      return NextResponse.json(
        {
          error: `Level requirement not met! ${character.name} requires Level ${character.requiredLevel} to recruit.`,
        },
        { status: 400 }
      );
    }

    // Check coin cost
    if (user.gold < character.coinCost) {
      return NextResponse.json(
        {
          error: `Insufficient gold! You need ${character.coinCost}g to recruit ${character.name} (Current: ${user.gold}g).`,
        },
        { status: 400 }
      );
    }

    // Deduct gold and add character to unlocked set
    const updatedUnlocked = Array.from(new Set([...unlockedList, characterId]));
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        gold: { decrement: character.coinCost },
        unlockedCharacters: updatedUnlocked.join(","),
        questLogs: {
          create: {
            questTitle: `Recruited Champion: ${character.name} - ${character.classTag}`,
            action: "COMPLETED",
            goldGained: -character.coinCost,
            xpGained: 50, // bonus XP for recruiting new hero!
          },
        },
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
      message: `Successfully recruited ${character.name}!`,
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
        unlockedCharacters: updatedUnlocked,
        inventory: updatedUser.inventory,
        bossState: updatedUser.bossState,
      },
    });
  } catch (error: any) {
    console.error("Character unlock error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to recruit character" },
      { status: 500 }
    );
  }
}
