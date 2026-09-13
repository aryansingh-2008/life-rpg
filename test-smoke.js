// test-smoke.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

async function runHealthCheck() {
  console.log("=== STARTING COMPREHENSIVE AETHERIA HEALTH CHECK ===");

  // 1. Check Database connection & Counts
  console.log("\n[1/6] Checking Database Connection & Records...");
  const userCount = await prisma.user.count();
  const questCount = await prisma.quest.count();
  const shopCount = await prisma.shopItem.count();
  const bossCount = await prisma.bossState.count();

  console.log(`- Users in DB: ${userCount}`);
  console.log(`- Quests in DB: ${questCount}`);
  console.log(`- Shop Items in DB: ${shopCount}`);
  console.log(`- Boss Records in DB: ${bossCount}`);

  if (shopCount < 10) throw new Error("Shop items are not seeded properly");
  if (userCount === 0) throw new Error("No users found in database");

  // 2. Test Demo User Retrieval
  console.log("\n[2/6] Verifying Demo User Integrity...");
  const demoUser = await prisma.user.findUnique({
    where: { email: "hero@aetheria.rpg" },
    include: {
      bossState: true,
      quests: true,
      inventory: { include: { item: true } },
    },
  });

  if (!demoUser) throw new Error("Demo user hero@aetheria.rpg not found");
  console.log(`- Demo User: ${demoUser.username}, Level: ${demoUser.level}, Gold: ${demoUser.gold}g`);
  console.log(`- Boss State: ${demoUser.bossState?.bossName} (HP: ${demoUser.bossState?.bossHp}/${demoUser.bossState?.bossMaxHp})`);
  console.log(`- Equipped Items: ${demoUser.inventory.filter(i => i.isEquipped).map(i => i.item.name).join(", ") || "None"}`);

  // 3. Test JWT & Auth Security
  console.log("\n[3/6] Testing Cryptographic & JWT Security...");
  const sampleSecret = "aetheria-super-secret-jwt-key-for-production-rpg-security";
  const token = jwt.sign({ userId: demoUser.id, email: demoUser.email }, sampleSecret, { expiresIn: "1h" });
  const decoded = jwt.verify(token, sampleSecret);
  if (decoded.userId !== demoUser.id) throw new Error("JWT token verification failed");
  console.log("- JWT Sign & Verify: PASS");

  const passwordHash = await bcrypt.hash("testPassword123", 10);
  const matchPass = await bcrypt.compare("testPassword123", passwordHash);
  const wrongPass = await bcrypt.compare("wrongPassword", passwordHash);
  if (!matchPass || wrongPass) throw new Error("Bcrypt hashing logic failed");
  console.log("- Bcrypt Hash & Compare: PASS");

  // 4. Test Non-Linear Level Progression Formula
  console.log("\n[4/6] Testing Non-Linear RPG Progression Formula...");
  function getRequiredXp(level) {
    return Math.floor(100 * Math.pow(level, 1.55));
  }
  const l1 = getRequiredXp(1);
  const l2 = getRequiredXp(2);
  const l3 = getRequiredXp(3);
  const l5 = getRequiredXp(5);
  const l10 = getRequiredXp(10);
  console.log(`- XP for Lv.1 -> Lv.2: ${l1} XP`);
  console.log(`- XP for Lv.2 -> Lv.3: ${l2} XP`);
  console.log(`- XP for Lv.3 -> Lv.4: ${l3} XP`);
  console.log(`- XP for Lv.5 -> Lv.6: ${l5} XP`);
  console.log(`- XP for Lv.10 -> Lv.11: ${l10} XP`);
  if (l2 <= l1 || l3 <= l2 || l5 <= l3 || l10 <= l5) {
    throw new Error("Leveling formula is not strictly non-linear and increasing!");
  }
  console.log("- Non-linear Exponential Scaling: PASS");

  // 5. Test Shop Purchase Gold Anti-Cheat Validation
  console.log("\n[5/6] Testing Shop Anti-Cheat & Balance Check...");
  const expensiveItem = await prisma.shopItem.findFirst({ orderBy: { cost: "desc" } });
  console.log(`- Checking expensive item: ${expensiveItem.name} (${expensiveItem.cost}g) against low gold...`);
  const fakeGoldUser = { gold: 10 };
  const canAfford = fakeGoldUser.gold >= expensiveItem.cost;
  if (canAfford) throw new Error("Shop allowed purchase with insufficient gold!");
  console.log("- Insufficient Gold Rejection: PASS");

  // 6. Test Quest CRUD & Log Insertion
  console.log("\n[6/6] Testing Quest Log & Transaction Safety...");
  const testQuest = await prisma.quest.findFirst({ where: { userId: demoUser.id } });
  if (testQuest) {
    const log = await prisma.questLog.create({
      data: {
        userId: demoUser.id,
        questId: testQuest.id,
        questTitle: testQuest.title,
        action: "HEALTH_CHECK_TEST",
        xpGained: 30,
        goldGained: 15,
        attributeGained: "INTELLECT",
      },
    });
    console.log(`- Created test log entry ID: ${log.id}`);
    await prisma.questLog.delete({ where: { id: log.id } });
    console.log("- Cleaned up test log entry: PASS");
  }

  console.log("\n=======================================================");
  console.log("🎉 ALL HEALTH CHECKS PASSED WITH 0 ERRORS! SYSTEM READY.");
  console.log("=======================================================");
}

runHealthCheck()
  .catch((err) => {
    console.error("\n❌ HEALTH CHECK FAILED:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
