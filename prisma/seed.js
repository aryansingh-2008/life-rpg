// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEFAULT_SHOP_ITEMS = [
  {
    name: "Cyber Katana",
    description: "A hyper-frequency edge pulsing with azure plasma. Boosts physical strike power.",
    category: "WEAPON",
    cost: 25,
    rarity: "RARE",
    statBonusType: "STRENGTH",
    statBonusValue: 8,
    visualKey: "cyber_katana",
    icon: "Sword",
  },
  {
    name: "Plasma Buster Blade",
    description: "Forged in digital starlight. Radiates overwhelming kinetic energy.",
    category: "WEAPON",
    cost: 75,
    rarity: "EPIC",
    statBonusType: "STRENGTH",
    statBonusValue: 18,
    visualKey: "plasma_blade",
    icon: "Zap",
  },
  {
    name: "Quantum Hex Shield",
    description: "Hard-light projection barrier that absorbs real-world fatigue and stress.",
    category: "SHIELD",
    cost: 30,
    rarity: "RARE",
    statBonusType: "VITALITY",
    statBonusValue: 10,
    visualKey: "quantum_shield",
    icon: "Shield",
  },
  {
    name: "Void Aegis of Eternity",
    description: "A legendary artifact that bends temporal entropy around the wielder.",
    category: "SHIELD",
    cost: 90,
    rarity: "LEGENDARY",
    statBonusType: "VITALITY",
    statBonusValue: 24,
    visualKey: "void_aegis",
    icon: "ShieldAlert",
  },
  {
    name: "Neon Photon Wings",
    description: "Cybernetic propulsion wings allowing lightning-fast workflow transitions.",
    category: "WINGS",
    cost: 50,
    rarity: "RARE",
    statBonusType: "AGILITY",
    statBonusValue: 12,
    visualKey: "cyber_wings",
    icon: "Wind",
  },
  {
    name: "Chrono Archangel Wings",
    description: "Gleaming golden cyber-wings with particle trails for legendary achievers.",
    category: "WINGS",
    cost: 140,
    rarity: "LEGENDARY",
    statBonusType: "AGILITY",
    statBonusValue: 28,
    visualKey: "archangel_wings",
    icon: "Sparkles",
  },
  {
    name: "Neural Focus Visor",
    description: "Biometric HUD interface that filters distractions and boosts deep work.",
    category: "HELMET",
    cost: 35,
    rarity: "RARE",
    statBonusType: "INTELLECT",
    statBonusValue: 12,
    visualKey: "neural_crown",
    icon: "Cpu",
  },
  {
    name: "Crown of the Cyber Sovereign",
    description: "Imbued with ancient machine intelligence. Enhances all mental faculties.",
    category: "HELMET",
    cost: 110,
    rarity: "EPIC",
    statBonusType: "INTELLECT",
    statBonusValue: 22,
    visualKey: "sovereign_crown",
    icon: "Crown",
  },
  {
    name: "Elixir of Mind Clarity",
    description: "Instantly restores 50 Mana and boosts cognitive resonance.",
    category: "POTION",
    cost: 5,
    rarity: "COMMON",
    statBonusType: "SPIRIT",
    statBonusValue: 5,
    visualKey: "potion_mana",
    icon: "FlaskConical",
  },
  {
    name: "Vitality Nano-Infusion",
    description: "Heals 50 HP and cures physical exhaustion after strenuous workouts.",
    category: "POTION",
    cost: 6,
    rarity: "COMMON",
    statBonusType: "HP",
    statBonusValue: 50,
    visualKey: "potion_heal",
    icon: "HeartPulse",
  },
  {
    name: "Streak Aegis Rune",
    description: "Protects your daily activity streak if you miss a day due to unavoidable emergencies.",
    category: "BADGE",
    cost: 15,
    rarity: "EPIC",
    statBonusType: "SPIRIT",
    statBonusValue: 8,
    visualKey: "rune_streak",
    icon: "Flame",
  },
  {
    name: "Ascendant Crest of Mastery",
    description: "The ultimate emblem of discipline. Proof of unwavering real-life triumph.",
    category: "BADGE",
    cost: 200,
    rarity: "LEGENDARY",
    statBonusType: "SPIRIT",
    statBonusValue: 30,
    visualKey: "crest_mastery",
    icon: "Trophy",
  },
];

async function main() {
  console.log("Seeding database shop items...");

  for (const item of DEFAULT_SHOP_ITEMS) {
    const existing = await prisma.shopItem.findFirst({
      where: { name: item.name },
    });
    if (!existing) {
      await prisma.shopItem.create({ data: item });
      console.log(`Created shop item: ${item.name}`);
    }
  }

  // Create or update default demo user for instant guest evaluation
  const demoEmail = "hero@aetheria.rpg";
  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!existingUser) {
    console.log("Creating default demo hero account...");
    const passwordHash = await bcrypt.hash("demo1234", 10);
    const user = await prisma.user.create({
      data: {
        email: demoEmail,
        username: "CyberKnight_Alex",
        passwordHash,
        level: 3,
        xp: 140,
        gold: 280,
        hp: 100,
        maxHp: 100,
        mana: 60,
        maxMana: 60,
        streak: 5,
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
            isDefeated: false,
          },
        },
      },
    });

    // Seed starter quests
    const starterQuests = [
      {
        userId: user.id,
        title: "Master Next.js Fullstack Architecture",
        description: "Review API route safety, server-authoritative calculations, and database joins.",
        type: "DAILY",
        attribute: "INTELLECT",
        difficulty: "HARD",
        xpReward: 95,
        goldReward: 60,
        completed: false,
        streak: 4,
      },
      {
        userId: user.id,
        title: "Gym HIIT & Calisthenics Routine",
        description: "45 minutes high-intensity workout: pushups, squats, and core training.",
        type: "DAILY",
        attribute: "STRENGTH",
        difficulty: "MEDIUM",
        xpReward: 55,
        goldReward: 30,
        completed: true,
        streak: 5,
        completedAt: new Date(),
      },
      {
        userId: user.id,
        title: "Drink 2.5 Liters of Pure Water",
        description: "Stay hydrated throughout the workday for maximum mental clarity.",
        type: "HABIT",
        attribute: "VITALITY",
        difficulty: "EASY",
        xpReward: 30,
        goldReward: 15,
        completed: false,
        streak: 3,
      },
      {
        userId: user.id,
        title: "15-Minute Mindful Meditation & Deep Breathing",
        description: "Disconnect from screens, center breath, and reflect on daily goals.",
        type: "HABIT",
        attribute: "SPIRIT",
        difficulty: "EASY",
        xpReward: 30,
        goldReward: 15,
        completed: false,
        streak: 2,
      },
      {
        userId: user.id,
        title: "Deep Workspace Clean & Cable Management",
        description: "Organize desk, wipe down hardware, and reset workspace for flow state.",
        type: "BOUNTY",
        attribute: "AGILITY",
        difficulty: "MEDIUM",
        xpReward: 55,
        goldReward: 30,
        completed: false,
        streak: 1,
      },
    ];

    for (const q of starterQuests) {
      await prisma.quest.create({ data: q });
    }

    // Give demo user starter Cyber Katana and equip it
    const katana = await prisma.shopItem.findFirst({ where: { visualKey: "cyber_katana" } });
    if (katana) {
      await prisma.userInventory.create({
        data: {
          userId: user.id,
          itemId: katana.id,
          isEquipped: true,
        },
      });
    }

    console.log("Demo hero account successfully created with starter quests and equipped gear!");
  }

  console.log("Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
