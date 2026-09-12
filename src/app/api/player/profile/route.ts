// src/app/api/player/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, signToken, TOKEN_COOKIE_NAME } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getRequiredXpForNextLevel, getRequiredGoldForLevelUp } from "@/lib/rpgEngine";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: {
        _count: {
          select: {
            quests: { where: { completed: true } },
            questLogs: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        title: user.title,
        level: user.level,
        xp: user.xp,
        nextLevelXp: getRequiredXpForNextLevel(user.level),
        gold: user.gold,
        hp: user.hp,
        maxHp: user.maxHp,
        mana: user.mana,
        maxMana: user.maxMana,
        streak: user.streak,
        streakShields: user.streakShields,
        characterId: user.characterId,
        createdAt: user.createdAt,
        totalCompletedQuests: user._count.quests,
        strength: user.strength,
        intellect: user.intellect,
        agility: user.agility,
        vitality: user.vitality,
        spirit: user.spirit,
        unspentPoints: user.unspentPoints,
      },
    });
  } catch (error: any) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, title } = body;

    // Validation
    if (username !== undefined) {
      const cleanUsername = username.trim();
      if (cleanUsername.length < 2 || cleanUsername.length > 32) {
        return NextResponse.json(
          { error: "Username must be between 2 and 32 characters." },
          { status: 400 }
        );
      }

      // Check for unique username
      const existing = await prisma.user.findFirst({
        where: {
          username: cleanUsername,
          NOT: { id: authUser.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "This character name is already claimed by another adventurer." },
          { status: 409 }
        );
      }
    }

    const dataToUpdate: any = {};
    if (username !== undefined) dataToUpdate.username = username.trim();
    if (title !== undefined) dataToUpdate.title = title.trim();

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: dataToUpdate,
      include: {
        inventory: { include: { item: true } },
        bossState: true,
        _count: {
          select: {
            quests: { where: { completed: true } },
          },
        },
      },
    });

    // Re-issue JWT token if username changed
    const token = signToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    });

    const response = NextResponse.json({
      success: true,
      message: "Hero identity successfully updated!",
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
        streakShields: updatedUser.streakShields,
        strength: updatedUser.strength,
        intellect: updatedUser.intellect,
        agility: updatedUser.agility,
        vitality: updatedUser.vitality,
        spirit: updatedUser.spirit,
        title: updatedUser.title,
        unspentPoints: updatedUser.unspentPoints,
        characterId: updatedUser.characterId || "aarav",
        unlockedCharacters: Array.from(
          new Set([
            "aarav",
            "ananya",
            ...(updatedUser.unlockedCharacters
              ? updatedUser.unlockedCharacters.split(",").map((s) => s.trim())
              : []),
          ])
        ),
        bossState: updatedUser.bossState,
        inventory: updatedUser.inventory,
        createdAt: updatedUser.createdAt,
        totalCompletedQuests: updatedUser._count.quests,
      },
    });

    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
