// src/lib/streakEngine.ts
import prisma from "@/lib/prisma";

export interface StreakUpdateResult {
  streak: number;
  streakShields: number;
  lastShieldGrantedStreak: number;
  lastActiveDate: Date;
  status: "SAME_DAY" | "CONSECUTIVE_LOGIN" | "SHIELD_PROTECTED" | "STREAK_BROKEN";
  shieldEarned: boolean;
  shieldsUsed: number;
  message: string;
}

/**
 * Authoritative Server-Side Streak & Shield Calculator
 * Rules:
 * 1. Missing a day without protection breaks the streak.
 * 2. Logging in consecutively for 7 days grants +1 Streak Protection Shield.
 * 3. Max cap is strictly 2 Streak Protection Shields (never exceeds 2).
 * 4. Missing 1 day consumes 1 shield to protect and preserve the streak.
 * 5. After consuming a shield, maintaining another 7 consecutive days re-earns a shield up to max 2.
 */
export function evaluateStreakOnLogin(
  currentStreak: number,
  currentShields: number,
  lastShieldGrantedStreak: number,
  lastActiveDate: Date | string,
  now: Date = new Date()
): StreakUpdateResult {
  const lastActive = new Date(lastActiveDate);

  // Normalize to calendar days (midnight to midnight)
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const lastDate = new Date(
    lastActive.getFullYear(),
    lastActive.getMonth(),
    lastActive.getDate()
  ).getTime();

  const diffDays = Math.round((nowDate - lastDate) / (1000 * 60 * 60 * 24));

  // Case 0: Same Calendar Day -> No streak change
  if (diffDays <= 0) {
    return {
      streak: currentStreak,
      streakShields: currentShields,
      lastShieldGrantedStreak,
      lastActiveDate: now,
      status: "SAME_DAY",
      shieldEarned: false,
      shieldsUsed: 0,
      message: `Streak maintained (${currentStreak}d)`,
    };
  }

  // Case 1: Next Consecutive Day -> Streak increases!
  if (diffDays === 1) {
    const newStreak = currentStreak + 1;
    let newShields = currentShields;
    let newLastShieldGranted = lastShieldGrantedStreak;
    let shieldEarned = false;

    // Check if a 7-day milestone is reached
    // Grants 1 shield for every 7 consecutive days (e.g. 7, 14, 21, 28...)
    // Strictly capped at MAX 2 shields!
    if (newStreak % 7 === 0 || newStreak - lastShieldGrantedStreak >= 7) {
      if (newShields < 2) {
        newShields = Math.min(2, newShields + 1);
        shieldEarned = true;
      }
      newLastShieldGranted = newStreak;
    }

    return {
      streak: newStreak,
      streakShields: newShields,
      lastShieldGrantedStreak: newLastShieldGranted,
      lastActiveDate: now,
      status: "CONSECUTIVE_LOGIN",
      shieldEarned,
      shieldsUsed: 0,
      message: shieldEarned
        ? `🔥 ${newStreak}d Streak! You earned +1 Streak Protection Shield! (${newShields}/2)`
        : `🔥 Streak increased to ${newStreak} days!`,
    };
  }

  // Case 2: Missed Day(s) (diffDays >= 2)
  const missedDays = diffDays - 1;

  // Check if user has enough shields to absorb the missed day(s)
  if (currentShields > 0 && missedDays <= currentShields) {
    // Shields protect the streak!
    const shieldsUsed = missedDays;
    const remainingShields = currentShields - shieldsUsed;

    return {
      streak: currentStreak, // Streak is preserved!
      streakShields: remainingShields,
      lastShieldGrantedStreak,
      lastActiveDate: now,
      status: "SHIELD_PROTECTED",
      shieldEarned: false,
      shieldsUsed,
      message: `🛡️ Streak Shield Activated! ${shieldsUsed} missed day protected. Your ${currentStreak}d streak was saved! (${remainingShields}/2 shields left)`,
    };
  }

  // Case 3: Missed Day without enough shields -> Streak Broken!
  return {
    streak: 1, // Reset to Day 1
    streakShields: 0,
    lastShieldGrantedStreak: 0,
    lastActiveDate: now,
    status: "STREAK_BROKEN",
    shieldEarned: false,
    shieldsUsed: currentShields,
    message: `💔 Streak Broken! You missed ${missedDays} day(s) without a Streak Shield. Streak reset to 1.`,
  };
}

/**
 * Evaluates and atomically updates the user's streak in the database on login or app open
 */
export async function updateUserStreakAuthoritative(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      streak: true,
      streakShields: true,
      lastShieldGrantedStreak: true,
      lastActiveDate: true,
    },
  });

  if (!user) return null;

  const result = evaluateStreakOnLogin(
    user.streak,
    user.streakShields || 0,
    user.lastShieldGrantedStreak || 0,
    user.lastActiveDate
  );

  // If status changed, update database
  if (result.status !== "SAME_DAY") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        streak: result.streak,
        streakShields: result.streakShields,
        lastShieldGrantedStreak: result.lastShieldGrantedStreak,
        lastActiveDate: result.lastActiveDate,
      },
    });
  }

  return result;
}
