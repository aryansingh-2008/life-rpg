// src/lib/rpgEngine.ts

export type AttributeType = "STRENGTH" | "INTELLECT" | "AGILITY" | "VITALITY" | "SPIRIT";
export type DifficultyType = "TRIVIAL" | "EASY" | "MEDIUM" | "HARD" | "HEROIC";
export type QuestType = "HABIT" | "DAILY" | "BOUNTY";

export interface QuestRewardCalc {
  baseXp: number;
  baseGold: number;
  streakBonusXp: number;
  streakBonusGold: number;
  totalXp: number;
  totalGold: number;
  bossDamage: number;
  attribute: AttributeType;
}

export const DIFFICULTY_CONFIG: Record<
  DifficultyType,
  { xp: number; gold: number; label: string; color: string }
> = {
  TRIVIAL: { xp: 15, gold: 8, label: "Trivial", color: "text-slate-400" },
  EASY: { xp: 30, gold: 15, label: "Easy", color: "text-emerald-400" },
  MEDIUM: { xp: 55, gold: 30, label: "Medium", color: "text-cyan-400" },
  HARD: { xp: 95, gold: 60, label: "Hard", color: "text-amber-400" },
  HEROIC: { xp: 160, gold: 110, label: "Heroic", color: "text-purple-400" },
};

export const ATTRIBUTES_CONFIG: Record<
  AttributeType,
  { label: string; icon: string; color: string; bg: string; description: string }
> = {
  STRENGTH: {
    label: "Strength",
    icon: "Dumbbell",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/30",
    description: "Physical fitness, workouts, posture & energy",
  },
  INTELLECT: {
    label: "Intellect",
    icon: "Brain",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/30",
    description: "Coding, studying, reading & skill mastery",
  },
  AGILITY: {
    label: "Agility",
    icon: "Zap",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    description: "Speed, quick chores, focus & efficiency",
  },
  VITALITY: {
    label: "Vitality",
    icon: "Heart",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    description: "Sleep, hydration, nutrition & body health",
  },
  SPIRIT: {
    label: "Spirit",
    icon: "Sparkles",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    description: "Mindfulness, meditation, discipline & clarity",
  },
};

/**
 * Non-Linear Level Progression Formula
 * XP required to advance from `level` to `level + 1`.
 * Each level requires exponentially more XP than the last.
 */
export function getRequiredXpForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.55));
}

/**
 * Computes progressive level-ups.
 * If user gains enough XP to skip multiple levels, it processes all thresholds.
 */
export function calculateLevelProgression(
  currentLevel: number,
  currentXp: number,
  gainedXp: number
): {
  newLevel: number;
  newXp: number;
  didLevelUp: boolean;
  levelsGained: number;
  statPointsAwarded: number;
} {
  let level = currentLevel;
  let xp = currentXp + gainedXp;
  let didLevelUp = false;
  let levelsGained = 0;

  while (true) {
    const requiredXp = getRequiredXpForNextLevel(level);
    if (xp >= requiredXp) {
      xp -= requiredXp;
      level += 1;
      didLevelUp = true;
      levelsGained += 1;
    } else {
      break;
    }
  }

  return {
    newLevel: level,
    newXp: xp,
    didLevelUp,
    levelsGained,
    statPointsAwarded: levelsGained * 2, // 2 unspent points per level
  };
}

/**
 * Calculates authoritatively on server rewards based on difficulty and streak
 */
export function calculateQuestRewards(
  difficulty: DifficultyType,
  attribute: AttributeType,
  streak: number
): QuestRewardCalc {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.MEDIUM;
  const baseXp = config.xp;
  const baseGold = config.gold;

  // Streak multiplier: 5% extra per streak day up to max 50% extra
  const streakMultiplier = Math.min(streak * 0.05, 0.5);
  const streakBonusXp = Math.round(baseXp * streakMultiplier);
  const streakBonusGold = Math.round(baseGold * streakMultiplier);

  const totalXp = baseXp + streakBonusXp;
  const totalGold = baseGold + streakBonusGold;
  const bossDamage = Math.floor(totalXp * 0.85);

  return {
    baseXp,
    baseGold,
    streakBonusXp,
    streakBonusGold,
    totalXp,
    totalGold,
    bossDamage,
    attribute,
  };
}

/**
 * Get title by level
 */
export function getPlayerTitle(level: number): string {
  if (level >= 30) return "Transcendent Legend";
  if (level >= 20) return "Sovereign Vanguard";
  if (level >= 15) return "Arcane Architect";
  if (level >= 10) return "Cyber Ronin";
  if (level >= 5) return "Aether Initiate";
  return "Novice Awakened";
}
