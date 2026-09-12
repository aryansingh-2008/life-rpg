// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signToken, TOKEN_COOKIE_NAME } from "@/lib/auth";
import { getRequiredXpForNextLevel, getRequiredGoldForLevelUp } from "@/lib/rpgEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(),
        passwordHash,
        level: 1,
        xp: 0,
        gold: 100,
        hp: 100,
        maxHp: 100,
        mana: 50,
        maxMana: 50,
        streak: 1,
        strength: 10,
        intellect: 10,
        agility: 10,
        vitality: 10,
        spirit: 10,
        title: "Novice Awakened",
        bossState: {
          create: {
            bossName: "Malakor the Procrastinator",
            bossTitle: "Lord of Endless Delay",
            bossHp: 500,
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

    // Create starter quests for new user
    const starterQuests = [
      {
        userId: user.id,
        title: "Welcome to Aetheria - First Daily Ritual",
        description: "Review your quest log, configure your profile, and embark on your journey.",
        type: "DAILY",
        attribute: "INTELLECT",
        difficulty: "EASY",
        xpReward: 20,
        goldReward: 1,
      },
      {
        userId: user.id,
        title: "Morning Physical Stretches & Hydration",
        description: "Drink 500ml water and do 10 minutes of active morning stretching.",
        type: "HABIT",
        attribute: "VITALITY",
        difficulty: "EASY",
        xpReward: 20,
        goldReward: 1,
      },
    ];

    for (const q of starterQuests) {
      await prisma.quest.create({ data: q });
    }

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
        streak: user.streak,
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error during account creation" },
      { status: 500 }
    );
  }
}
