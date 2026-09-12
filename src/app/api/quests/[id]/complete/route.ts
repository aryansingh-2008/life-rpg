// src/app/api/quests/[id]/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  calculateQuestRewards,
  calculateLevelProgression,
  getPlayerTitle,
  getRequiredXpForNextLevel,
  getRequiredGoldForLevelUp,
  DifficultyType,
  AttributeType,
} from "@/lib/rpgEngine";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const quest = await prisma.quest.findUnique({
      where: { id },
    });

    if (!quest || quest.userId !== user.id) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    // Toggle complete: if already completed and user clicks again, allow toggle or reject
    const body = await req.json().catch(() => ({}));
    const forceToggle = body.forceToggle ?? false;

    if (quest.completed && !forceToggle) {
      return NextResponse.json(
        { error: "Quest is already completed" },
        { status: 400 }
      );
    }

    // If already completed and forceToggle is true -> uncomplete
    if (quest.completed && forceToggle) {
      const updatedQuest = await prisma.quest.update({
        where: { id },
        data: { completed: false, completedAt: null },
      });
      return NextResponse.json({
        success: true,
        quest: updatedQuest,
        message: "Quest uncompleted",
      });
    }

    // 1. Calculate Streak logic based on last active date
    const now = new Date();
    const lastActive = new Date(user.lastActiveDate);
    const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

    let newStreak = user.streak;
    if (diffHours >= 20 && diffHours < 48) {
      // Completed on next day -> increase streak
      newStreak += 1;
    } else if (diffHours >= 48) {
      // Missed more than a day -> reset to 1
      newStreak = 1;
    } else if (newStreak === 0) {
      newStreak = 1;
    }

    // 2. Server-Authoritative Reward Calculation
    const rewards = calculateQuestRewards(
      quest.difficulty as DifficultyType,
      quest.attribute as AttributeType,
      newStreak
    );

    // 3. Non-linear Level Progression Evaluation with Gold Requirement
    const totalPotentialGold = user.gold + rewards.totalGold;
    const progression = calculateLevelProgression(
      user.level,
      user.xp,
      rewards.totalXp,
      totalPotentialGold
    );

    // 4. Attribute & Stat Point updates
    const attributeToIncrement = quest.attribute.toLowerCase();
    const statUpdates: Record<string, number> = {};
    if (attributeToIncrement === "strength") statUpdates.strength = user.strength + 1;
    else if (attributeToIncrement === "intellect") statUpdates.intellect = user.intellect + 1;
    else if (attributeToIncrement === "agility") statUpdates.agility = user.agility + 1;
    else if (attributeToIncrement === "vitality") statUpdates.vitality = user.vitality + 1;
    else if (attributeToIncrement === "spirit") statUpdates.spirit = user.spirit + 1;

    // 5. Boss Damage logic
    let bossBonusGold = 0;
    let bossDefeatedNow = false;
    let currentBoss = await prisma.bossState.findUnique({
      where: { userId: user.id },
    });

    if (!currentBoss) {
      currentBoss = await prisma.bossState.create({
        data: {
          userId: user.id,
          bossName: "Malakor the Procrastinator",
          bossTitle: "Lord of Endless Delay",
          bossHp: 500,
          bossMaxHp: 500,
          bossLevel: 1,
        },
      });
    }

    let updatedBossHp = Math.max(0, currentBoss.bossHp - rewards.bossDamage);
    let updatedBossLevel = currentBoss.bossLevel;
    let updatedBossMaxHp = currentBoss.bossMaxHp;
    let updatedBossName = currentBoss.bossName;
    let updatedBossTitle = currentBoss.bossTitle;

    if (updatedBossHp === 0) {
      bossDefeatedNow = true;
      bossBonusGold = 15 + updatedBossLevel * 5;
      // Respawn next boss tier
      updatedBossLevel += 1;
      updatedBossMaxHp = 500 + updatedBossLevel * 250;
      updatedBossHp = updatedBossMaxHp;

      const bossNames = [
        { name: "Malakor the Procrastinator", title: "Lord of Endless Delay" },
        { name: "Siren of the Infinite Scroll", title: "Queen of Digital Distraction" },
        { name: "Chronos Devourer", title: "Entity of Lost Hours" },
        { name: "Apex Entropy", title: "Cosmic Master of Sloth" },
      ];
      const nextBossInfo = bossNames[(updatedBossLevel - 1) % bossNames.length];
      updatedBossName = nextBossInfo.name;
      updatedBossTitle = nextBossInfo.title;
    }

    // Execute atomic transaction for persistence
    const [updatedUser, updatedQuest, updatedBoss] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          level: progression.newLevel,
          xp: progression.newXp,
          gold: totalPotentialGold + bossBonusGold - progression.goldCost,
          streak: newStreak,
          lastActiveDate: now,
          title: getPlayerTitle(progression.newLevel),
          unspentPoints: user.unspentPoints + progression.statPointsAwarded,
          ...statUpdates,
        },
        include: {
          inventory: { include: { item: true } },
          bossState: true,
        },
      }),

      prisma.quest.update({
        where: { id },
        data: {
          completed: quest.type === "HABIT" ? false : true, // Habits stay active for repeating
          streak: quest.streak + 1,
          completedAt: now,
        },
      }),

      prisma.bossState.update({
        where: { userId: user.id },
        data: {
          bossName: updatedBossName,
          bossTitle: updatedBossTitle,
          bossHp: updatedBossHp,
          bossMaxHp: updatedBossMaxHp,
          bossLevel: updatedBossLevel,
          isDefeated: false,
        },
      }),

      prisma.questLog.create({
        data: {
          userId: user.id,
          questId: quest.id,
          questTitle: quest.title,
          action: "COMPLETED",
          xpGained: rewards.totalXp,
          goldGained: rewards.totalGold + bossBonusGold - progression.goldCost,
          attributeGained: quest.attribute,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      quest: updatedQuest,
      user: {
        ...updatedUser,
        nextLevelXp: getRequiredXpForNextLevel(updatedUser.level),
        requiredGoldForLevelUp: getRequiredGoldForLevelUp(updatedUser.level),
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
      },
      rewards: {
        ...rewards,
        bossBonusGold,
      },
      progression: {
        didLevelUp: progression.didLevelUp,
        levelsGained: progression.levelsGained,
        newLevel: progression.newLevel,
        statPointsAwarded: progression.statPointsAwarded,
        goldCost: progression.goldCost,
        pendingAscension: progression.pendingAscension,
        goldNeeded: progression.goldNeeded,
      },
      boss: {
        bossDamageDealt: rewards.bossDamage,
        bossDefeated: bossDefeatedNow,
        currentHp: updatedBoss.bossHp,
        maxHp: updatedBoss.bossMaxHp,
        bossName: updatedBoss.bossName,
        bossLevel: updatedBoss.bossLevel,
      },
    });
  } catch (error: any) {
    console.error("Quest completion error:", error);
    return NextResponse.json(
      { error: "Failed to process quest completion" },
      { status: 500 }
    );
  }
}
