// src/app/api/auth/demo/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken, TOKEN_COOKIE_NAME } from "@/lib/auth";
import { getRequiredXpForNextLevel, getRequiredGoldForLevelUp } from "@/lib/rpgEngine";
import { updateUserStreakAuthoritative } from "@/lib/streakEngine";

export async function POST() {
  try {
    const demoEmail = "hero@aetheria.rpg";
    let user = await prisma.user.findUnique({
      where: { email: demoEmail },
      include: {
        bossState: true,
        inventory: { include: { item: true } },
      },
    });

    if (!user) {
      // Fallback create demo user if not present
      user = await prisma.user.create({
        data: {
          email: demoEmail,
          username: "CyberKnight_Alex",
          passwordHash: "demo_auto_hash",
          level: 3,
          xp: 140,
          gold: 280,
          hp: 100,
          maxHp: 100,
          mana: 60,
          maxMana: 60,
          streak: 5,
          streakShields: 1,
          lastShieldGrantedStreak: 0,
          strength: 18,
          intellect: 24,
          agility: 15,
          vitality: 20,
          spirit: 16,
          unspentPoints: 4,
          title: "Aether Initiate",
          bossState: {
            create: {
              bossName: "Malakor the Procrastinator",
              bossTitle: "Lord of Endless Delay",
              bossHp: 380,
              bossMaxHp: 500,
              bossLevel: 1,
            },
          },
        },
        include: {
          bossState: true,
          inventory: { include: { item: true } },
        },
      });
    }

    // Evaluate authoritative streak and shields for demo user
    const streakResult = await updateUserStreakAuthoritative(user.id);
    const effectiveStreak = streakResult?.streak ?? user.streak;
    const effectiveShields = streakResult?.streakShields ?? (user as any).streakShields ?? 1;

    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        nextLevelXp: getRequiredXpForNextLevel(user.level),
        requiredGoldForLevelUp: getRequiredGoldForLevelUp(user.level),
        gold: user.gold,
        hp: user.hp,
        maxHp: user.maxHp,
        mana: user.mana,
        maxMana: user.maxMana,
        streak: effectiveStreak,
        streakShields: effectiveShields,
        streakNotification: streakResult?.message ?? null,
        strength: user.strength,
        intellect: user.intellect,
        agility: user.agility,
        vitality: user.vitality,
        spirit: user.spirit,
        title: user.title,
        unspentPoints: user.unspentPoints,
        characterId: user.characterId || "aarav",
        unlockedCharacters: Array.from(
          new Set([
            "aarav",
            "ananya",
            ...(user.unlockedCharacters
              ? user.unlockedCharacters.split(",").map((s) => s.trim())
              : []),
          ])
        ),
        bossState: user.bossState,
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
    console.error("Demo login error:", error);
    return NextResponse.json(
      { error: "Failed to initialize demo character" },
      { status: 500 }
    );
  }
}
