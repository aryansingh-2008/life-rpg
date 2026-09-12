// src/lib/charactersConfig.ts

export type CharacterGender = "BOY" | "GIRL";

export interface CharacterAttributeBreakdown {
  intelligence: number; // 0-100
  strength: number;     // 0-100
  wisdom: number;       // 0-100
  creativity: number;   // 0-100
  focus: number;        // 0-100
}

export interface CharacterPerk {
  icon: string; // "star" | "coin" | "sparkles" | "gift" | "shield" | "flame" | "zap" | "crown"
  text: string;
}

export interface CharacterEvolutionTier {
  tierName: string;
  levelRange: string;
  minLevel: number;
}

export const EVOLUTION_TIERS: CharacterEvolutionTier[] = [
  { tierName: "Beginner", levelRange: "Lv. 1 - 5", minLevel: 1 },
  { tierName: "Adventurer", levelRange: "Lv. 6 - 10", minLevel: 6 },
  { tierName: "Warrior", levelRange: "Lv. 11 - 20", minLevel: 11 },
  { tierName: "Elite", levelRange: "Lv. 21 - 30", minLevel: 21 },
  { tierName: "Master", levelRange: "Lv. 31+", minLevel: 31 },
];

export interface CharacterConfig {
  id: string;
  name: string;
  gender: CharacterGender;
  classTag: string;
  archetype: string;
  motto: string;
  lore: string;
  requiredLevel: number;
  coinCost: number;
  isDefaultUnlocked: boolean;
  avatarGradient: string;
  accentColor: string;
  elementIcon: string;
  attributes: CharacterAttributeBreakdown;
  perks: CharacterPerk[];
  imageUrl: string;
  dashboardImageUrl?: string;
  // 3D Procedural Canvas Properties
  meshType:
    | "wanderer"
    | "shinobi"
    | "scholar"
    | "paladin"
    | "vanguard"
    | "phantom"
    | "berserker"
    | "ronin"
    | "colossus"
    | "sovereign"
    | "adventurer"
    | "ranger"
    | "sorceress"
    | "valkyrie"
    | "priestess"
    | "assassin"
    | "frostwarden"
    | "flame_empress"
    | "void_weaver"
    | "celestial_queen";
  primaryColor: number;
  secondaryColor: number;
  trimColor: number;
  emissiveColor: number;
}

export const CHARACTERS_ROSTER: CharacterConfig[] = [
  // ==========================================
  // 10 BOYS
  // ==========================================
  {
    id: "aarav",
    name: "Aarav",
    gender: "BOY",
    classTag: "The Wanderer",
    archetype: "Balanced",
    motto: "Explores, learns, grows.",
    lore: "A mindful traveler who sees every habit as a step on the path of self-discovery. Grounded, balanced, and endlessly resilient.",
    requiredLevel: 1,
    coinCost: 0,
    isDefaultUnlocked: true,
    imageUrl: "/characters/aarav.jpg",
    avatarGradient: "from-sky-500 to-indigo-600",
    accentColor: "#38bdf8",
    elementIcon: "Compass",
    attributes: {
      intelligence: 50,
      strength: 50,
      wisdom: 55,
      creativity: 50,
      focus: 50,
    },
    perks: [
      { icon: "star", text: "+10 XP per completed task" },
      { icon: "coin", text: "+1 Coin per task reward" },
      { icon: "sparkles", text: "Balanced attribute growth across all categories" },
      { icon: "gift", text: "Standard Armory weapon & shield access" },
    ],
    meshType: "wanderer",
    primaryColor: 0x1e293b,
    secondaryColor: 0x0284c7,
    trimColor: 0x38bdf8,
    emissiveColor: 0x38bdf8,
  },
  {
    id: "kaelen",
    name: "Kaelen",
    gender: "BOY",
    classTag: "The Shinobi",
    archetype: "Agility & Stealth",
    motto: "Move in silence. Strike with purpose.",
    lore: "Trained in surgical focus and rapid habit blitzing. Slices through procrastination before hesitation can take root.",
    requiredLevel: 3,
    coinCost: 200,
    isDefaultUnlocked: false,
    imageUrl: "/characters/kaelen.jpg",
    avatarGradient: "from-emerald-500 to-teal-700",
    accentColor: "#10b981",
    elementIcon: "Wind",
    attributes: {
      intelligence: 55,
      strength: 45,
      wisdom: 40,
      creativity: 60,
      focus: 75,
    },
    perks: [
      { icon: "zap", text: "+15% Speed bonus on daily morning habits" },
      { icon: "star", text: "+10 Agility permanent stat bonus" },
      { icon: "shield", text: "Silent Step: Streak shield prevents 1 missed day penalty" },
      { icon: "sparkles", text: "Neon dual-edge holographic blade aura" },
    ],
    meshType: "shinobi",
    primaryColor: 0x0f172a,
    secondaryColor: 0x064e3b,
    trimColor: 0x10b981,
    emissiveColor: 0x34d399,
  },
  {
    id: "zephyr",
    name: "Zephyr",
    gender: "BOY",
    classTag: "The Scholar",
    archetype: "Intellect",
    motto: "Knowledge is the ultimate power.",
    lore: "An insatiable researcher and code architect. Translates dense textbooks and difficult exams into effortless mastery.",
    requiredLevel: 5,
    coinCost: 500,
    isDefaultUnlocked: false,
    imageUrl: "/characters/zephyr.jpg",
    avatarGradient: "from-violet-500 to-purple-800",
    accentColor: "#a855f7",
    elementIcon: "BookOpen",
    attributes: {
      intelligence: 85,
      strength: 35,
      wisdom: 80,
      creativity: 65,
      focus: 70,
    },
    perks: [
      { icon: "star", text: "+25% XP from study, coding, and reading tasks" },
      { icon: "sparkles", text: "+15 Intellect attribute amplification" },
      { icon: "gift", text: "Unlocks Arcane Codex in the Armory" },
      { icon: "coin", text: "Bonus 1 Coin on deep work completion" },
    ],
    meshType: "scholar",
    primaryColor: 0x1e1b4b,
    secondaryColor: 0x581c87,
    trimColor: 0xa855f7,
    emissiveColor: 0xc084fc,
  },
  {
    id: "valen",
    name: "Valen",
    gender: "BOY",
    classTag: "The Sun Champion",
    archetype: "Vitality & Light",
    motto: "Bring warmth to darkness. Stand unbroken.",
    lore: "An unwavering defender of physical wellness and optimistic discipline. Morning sunlight and healthy hydration fuel his radiance.",
    requiredLevel: 8,
    coinCost: 950,
    isDefaultUnlocked: false,
    imageUrl: "/characters/valen.jpg",
    avatarGradient: "from-amber-400 to-yellow-600",
    accentColor: "#f59e0b",
    elementIcon: "Sun",
    attributes: {
      intelligence: 50,
      strength: 70,
      wisdom: 65,
      creativity: 45,
      focus: 75,
    },
    perks: [
      { icon: "shield", text: "+20 Max HP permanent expansion" },
      { icon: "star", text: "+15 Vitality attribute reinforcement" },
      { icon: "zap", text: "Morning rituals (before 9 AM) yield 2x XP" },
      { icon: "sparkles", text: "Solar Aura shields against burnout fatigue" },
    ],
    meshType: "paladin",
    primaryColor: 0xffffff,
    secondaryColor: 0xd97706,
    trimColor: 0xf59e0b,
    emissiveColor: 0xfde047,
  },
  {
    id: "torin",
    name: "Torin",
    gender: "BOY",
    classTag: "The Warrior",
    archetype: "Strength",
    motto: "Discipline builds an empire of will.",
    lore: "Forged in heavy iron and physical endurance. Never skips gym days; transforms sweat and effort into unbreakable character.",
    requiredLevel: 11,
    coinCost: 1600,
    isDefaultUnlocked: false,
    imageUrl: "/characters/torin.jpg",
    avatarGradient: "from-rose-500 to-red-800",
    accentColor: "#ef4444",
    elementIcon: "Swords",
    attributes: {
      intelligence: 40,
      strength: 90,
      wisdom: 50,
      creativity: 35,
      focus: 70,
    },
    perks: [
      { icon: "flame", text: "+30% Boss damage from workout tasks" },
      { icon: "star", text: "+20 Strength attribute dominance" },
      { icon: "shield", text: "Iron Vanguard heavy armor deflection" },
      { icon: "coin", text: "+1 Coin per physical bounty quest" },
    ],
    meshType: "vanguard",
    primaryColor: 0x1c1917,
    secondaryColor: 0x991b1b,
    trimColor: 0xef4444,
    emissiveColor: 0xf87171,
  },
  {
    id: "lucian",
    name: "Lucian",
    gender: "BOY",
    classTag: "The Phantom",
    archetype: "Focus & Precision",
    motto: "One clean cut through hesitation.",
    lore: "Operates with surgical focus. Treats each backlog item as an assassination target to be cleanly eliminated without delay.",
    requiredLevel: 14,
    coinCost: 2500,
    isDefaultUnlocked: false,
    imageUrl: "/characters/lucian.jpg",
    avatarGradient: "from-slate-700 to-zinc-900",
    accentColor: "#94a3b8",
    elementIcon: "Target",
    attributes: {
      intelligence: 65,
      strength: 60,
      wisdom: 55,
      creativity: 50,
      focus: 92,
    },
    perks: [
      { icon: "zap", text: "+35% Critical strike chance on tasks (2x rewards)" },
      { icon: "star", text: "+18 Focus mastery" },
      { icon: "shield", text: "Dark Matter stealth cape cloaks distractions" },
      { icon: "sparkles", text: "Phantom shadow trail behind 3D avatar" },
    ],
    meshType: "phantom",
    primaryColor: 0x09090b,
    secondaryColor: 0x3b0764,
    trimColor: 0xa855f7,
    emissiveColor: 0xc084fc,
  },
  {
    id: "boran",
    name: "Boran",
    gender: "BOY",
    classTag: "The Berserker",
    archetype: "Raw Power",
    motto: "Turn struggle into fuel.",
    lore: "Channels frustration and tough obstacles into volcanic energy. When the workload grows immense, his resolve explodes.",
    requiredLevel: 18,
    coinCost: 3800,
    isDefaultUnlocked: false,
    imageUrl: "/characters/boran.jpg",
    avatarGradient: "from-orange-600 to-red-900",
    accentColor: "#ea580c",
    elementIcon: "Flame",
    attributes: {
      intelligence: 45,
      strength: 98,
      wisdom: 40,
      creativity: 40,
      focus: 80,
    },
    perks: [
      { icon: "flame", text: "+1 Extra Coin on Hard & Heroic quests" },
      { icon: "star", text: "+25 Strength explosive surge" },
      { icon: "zap", text: "Rage Momentum: +10% XP per active habit streak" },
      { icon: "gift", text: "Unlocks Dual Magma Axes in Armory" },
    ],
    meshType: "berserker",
    primaryColor: 0x450a0a,
    secondaryColor: 0x9a3412,
    trimColor: 0xf97316,
    emissiveColor: 0xfb923c,
  },
  {
    id: "kaito",
    name: "Kaito",
    gender: "BOY",
    classTag: "The Ronin",
    archetype: "Speed & Cyber Blade",
    motto: "Master the code, command reality.",
    lore: "A lone high-tech swordsman wandering the cyber frontier. Decimates bugs and algorithms with quantum katana precision.",
    requiredLevel: 22,
    coinCost: 5500,
    isDefaultUnlocked: false,
    imageUrl: "/characters/kaito.jpg",
    avatarGradient: "from-cyan-500 to-blue-800",
    accentColor: "#06b6d4",
    elementIcon: "Cpu",
    attributes: {
      intelligence: 85,
      strength: 75,
      wisdom: 60,
      creativity: 80,
      focus: 85,
    },
    perks: [
      { icon: "zap", text: "+30% Coding & Engineering quest XP" },
      { icon: "star", text: "+20 Agility cybernetics" },
      { icon: "sparkles", text: "Matrix Glitch cyber particle trail" },
      { icon: "shield", text: "Quantum Parrying: Prevents streak loss once a week" },
    ],
    meshType: "ronin",
    primaryColor: 0x022c22,
    secondaryColor: 0x0e7490,
    trimColor: 0x06b6d4,
    emissiveColor: 0x22d3ee,
  },
  {
    id: "gideon",
    name: "Gideon",
    gender: "BOY",
    classTag: "The Colossus",
    archetype: "Titan Defense",
    motto: "Stand immovable against the storm.",
    lore: "Pilots a heavy autonomous titanium exoskeleton. Engineered to absorb the heaviest workloads and longest study marathons without fatigue.",
    requiredLevel: 26,
    coinCost: 8000,
    isDefaultUnlocked: false,
    imageUrl: "/characters/gideon.jpg",
    avatarGradient: "from-blue-600 to-slate-900",
    accentColor: "#3b82f6",
    elementIcon: "ShieldAlert",
    attributes: {
      intelligence: 70,
      strength: 95,
      wisdom: 65,
      creativity: 60,
      focus: 90,
    },
    perks: [
      { icon: "shield", text: "+50 Max HP & Mana expansion" },
      { icon: "star", text: "+25 Vitality titanium plating" },
      { icon: "flame", text: "Colossus Strike: Massive boss raid damage" },
      { icon: "sparkles", text: "Hydraulic thruster jump and plasma shield" },
    ],
    meshType: "colossus",
    primaryColor: 0x1e3a5f,
    secondaryColor: 0x1d4ed8,
    trimColor: 0x60a5fa,
    emissiveColor: 0x93c5fd,
  },
  {
    id: "orion",
    name: "Orion",
    gender: "BOY",
    classTag: "The Sovereign",
    archetype: "Cosmic Mastery",
    motto: "Command the stars of your destiny.",
    lore: "The ultimate male avatar of life mastery. Physical strength, intellectual depth, and inner calmness harmonized in celestial unity.",
    requiredLevel: 30,
    coinCost: 12000,
    isDefaultUnlocked: false,
    imageUrl: "/characters/orion.jpg",
    avatarGradient: "from-amber-300 via-purple-600 to-indigo-950",
    accentColor: "#fbbf24",
    elementIcon: "Crown",
    attributes: {
      intelligence: 99,
      strength: 95,
      wisdom: 98,
      creativity: 90,
      focus: 99,
    },
    perks: [
      { icon: "star", text: "+50% All XP and Coin quest gains permanently" },
      { icon: "sparkles", text: "+30 to ALL Attribute stats" },
      { icon: "crown", text: "Cosmic Sovereign Crown & galaxy orbital vortex" },
      { icon: "zap", text: "Instant boss raid execution below 25% HP" },
    ],
    meshType: "sovereign",
    primaryColor: 0x18181b,
    secondaryColor: 0x7c3aed,
    trimColor: 0xf59e0b,
    emissiveColor: 0xfef08a,
  },

  // ==========================================
  // 10 GIRLS
  // ==========================================
  {
    id: "ananya",
    name: "Ananya",
    gender: "GIRL",
    classTag: "The Adventurer",
    archetype: "All-Rounder",
    motto: "Small steps. Big dreams.",
    lore: "A natural explorer — curious, determined, and always ready for the next challenge. Balance and grit are her superpowers.",
    requiredLevel: 1,
    coinCost: 0,
    isDefaultUnlocked: true,
    imageUrl: "/characters/ananya.jpg",
    dashboardImageUrl: "/characters/ananya_dashboard.jpg",
    avatarGradient: "from-blue-500 to-indigo-700",
    accentColor: "#60a5fa",
    elementIcon: "Sparkles",
    attributes: {
      intelligence: 50,
      strength: 45,
      wisdom: 55,
      creativity: 50,
      focus: 50,
    },
    perks: [
      { icon: "star", text: "+10 XP per completed task" },
      { icon: "coin", text: "+1 Coin per task reward" },
      { icon: "sparkles", text: "Balanced attribute growth across all categories" },
      { icon: "gift", text: "Access to all basic starter items" },
    ],
    meshType: "adventurer",
    primaryColor: 0x1e3a8a,
    secondaryColor: 0x3b82f6,
    trimColor: 0x93c5fd,
    emissiveColor: 0xbfdbfe,
  },
  {
    id: "lyra",
    name: "Lyra",
    gender: "GIRL",
    classTag: "The Ranger",
    archetype: "Focus",
    motto: "Stay present. Stay sharp.",
    lore: "A cyber-archer with hawk-like focus. Locks onto daily goals with zero hesitation, hitting every target dead-center.",
    requiredLevel: 3,
    coinCost: 200,
    isDefaultUnlocked: false,
    imageUrl: "/characters/lyra.jpg",
    avatarGradient: "from-emerald-500 to-green-800",
    accentColor: "#10b981",
    elementIcon: "Target",
    attributes: {
      intelligence: 60,
      strength: 40,
      wisdom: 60,
      creativity: 55,
      focus: 80,
    },
    perks: [
      { icon: "zap", text: "+15% Streak bonus multiplier" },
      { icon: "star", text: "+12 Focus precision amplification" },
      { icon: "shield", text: "Eagle Eye: Highlights high-priority quests" },
      { icon: "sparkles", text: "Neon composite recurve bow glow" },
    ],
    meshType: "ranger",
    primaryColor: 0x14532d,
    secondaryColor: 0x15803d,
    trimColor: 0x4ade80,
    emissiveColor: 0x86efac,
  },
  {
    id: "elaria",
    name: "Elaria",
    gender: "GIRL",
    classTag: "The Sorceress",
    archetype: "Intellect",
    motto: "Every word read is a spark of magic.",
    lore: "Weaves deep academic study and abstract thinking into effortless problem-solving. Breaks mental blocks with arcane grace.",
    requiredLevel: 5,
    coinCost: 500,
    isDefaultUnlocked: false,
    imageUrl: "/characters/elaria.jpg",
    avatarGradient: "from-purple-600 to-indigo-900",
    accentColor: "#a855f7",
    elementIcon: "Wand2",
    attributes: {
      intelligence: 88,
      strength: 30,
      wisdom: 82,
      creativity: 70,
      focus: 65,
    },
    perks: [
      { icon: "star", text: "+25% Intellect quest rewards" },
      { icon: "sparkles", text: "+15 Intellect attribute amplification" },
      { icon: "shield", text: "Arcane Mind Shield eliminates test anxiety" },
      { icon: "coin", text: "+1 Coin on study & reading sessions" },
    ],
    meshType: "sorceress",
    primaryColor: 0x2e1065,
    secondaryColor: 0x6b21a8,
    trimColor: 0xa855f7,
    emissiveColor: 0xd8b4fe,
  },
  {
    id: "valkyria",
    name: "Valkyria",
    gender: "GIRL",
    classTag: "The Valkyrie",
    archetype: "Strength & Lightning",
    motto: "Ride the tempest of change.",
    lore: "An electrified champion who charges into heavy workouts and intense challenges with roaring confidence and electric vigor.",
    requiredLevel: 8,
    coinCost: 950,
    isDefaultUnlocked: false,
    imageUrl: "/characters/valkyria.jpg",
    avatarGradient: "from-cyan-400 to-sky-700",
    accentColor: "#38bdf8",
    elementIcon: "Zap",
    attributes: {
      intelligence: 50,
      strength: 85,
      wisdom: 60,
      creativity: 50,
      focus: 75,
    },
    perks: [
      { icon: "flame", text: "+25% Boss attack damage on gym routines" },
      { icon: "star", text: "+16 Strength lightning empowerment" },
      { icon: "zap", text: "Storm Dash: +20% movement in all habit streaks" },
      { icon: "sparkles", text: "Twin silver Valkyrie wings & lightning spear" },
    ],
    meshType: "valkyrie",
    primaryColor: 0x0f172a,
    secondaryColor: 0x0284c7,
    trimColor: 0x38bdf8,
    emissiveColor: 0x7dd3fc,
  },
  {
    id: "seraphina",
    name: "Seraphina",
    gender: "GIRL",
    classTag: "The Priestess",
    archetype: "Wisdom & Healing",
    motto: "Peace of mind is supreme power.",
    lore: "The sanctuary of calm. Excels at meditation, stress reduction, and healthy recovery rituals, ensuring vitality never runs dry.",
    requiredLevel: 11,
    coinCost: 1600,
    isDefaultUnlocked: false,
    imageUrl: "/characters/seraphina.jpg",
    avatarGradient: "from-rose-400 to-pink-700",
    accentColor: "#f43f5e",
    elementIcon: "Heart",
    attributes: {
      intelligence: 70,
      strength: 35,
      wisdom: 92,
      creativity: 65,
      focus: 85,
    },
    perks: [
      { icon: "shield", text: "+30 HP restored per completed mindfulness quest" },
      { icon: "star", text: "+20 Wisdom inner peace amplification" },
      { icon: "sparkles", text: "Lotus Dawn aura protects streak against stress" },
      { icon: "gift", text: "Unlocks Celestial Priestess Silk Robes" },
    ],
    meshType: "priestess",
    primaryColor: 0xfdf2f8,
    secondaryColor: 0xf43f5e,
    trimColor: 0xfb7185,
    emissiveColor: 0xfecdd3,
  },
  {
    id: "kira",
    name: "Kira",
    gender: "GIRL",
    classTag: "The Assassin",
    archetype: "Agility & Speed",
    motto: "Speed eliminates all doubt.",
    lore: "Swift as a phantom blade. Dashes between deadlines and micro-habits with surgical precision, leaving zero unfinished tasks.",
    requiredLevel: 14,
    coinCost: 2500,
    isDefaultUnlocked: false,
    imageUrl: "/characters/kira.jpg",
    avatarGradient: "from-fuchsia-600 to-purple-950",
    accentColor: "#d946ef",
    elementIcon: "Sparkles",
    attributes: {
      intelligence: 65,
      strength: 65,
      wisdom: 50,
      creativity: 60,
      focus: 90,
    },
    perks: [
      { icon: "zap", text: "+30% Habit completion speed multiplier" },
      { icon: "star", text: "+20 Agility phantom agility" },
      { icon: "flame", text: "Dual Plasma Dagger strikes deal +1 Coin" },
      { icon: "sparkles", text: "Violet mirror blink teleport effect" },
    ],
    meshType: "assassin",
    primaryColor: 0x18181b,
    secondaryColor: 0x86198f,
    trimColor: 0xd946ef,
    emissiveColor: 0xf0abfc,
  },
  {
    id: "freya",
    name: "Freya",
    gender: "GIRL",
    classTag: "The Frost Warden",
    archetype: "Vitality & Calm",
    motto: "Cool heads conquer burning chaos.",
    lore: "Maintains absolute composure under high-pressure exams and tight work deadlines. Her glacial calm freezes burnout in its tracks.",
    requiredLevel: 18,
    coinCost: 3800,
    isDefaultUnlocked: false,
    imageUrl: "/characters/freya.jpg",
    avatarGradient: "from-cyan-300 to-teal-800",
    accentColor: "#22d3ee",
    elementIcon: "Snowflake",
    attributes: {
      intelligence: 60,
      strength: 75,
      wisdom: 75,
      creativity: 55,
      focus: 85,
    },
    perks: [
      { icon: "shield", text: "+40 Max HP reservoir" },
      { icon: "star", text: "+22 Vitality glacial endurance" },
      { icon: "shield", text: "Frost Aegis absorbs failure damage penalties" },
      { icon: "sparkles", text: "Crystalline Ice wings and Frosted Rune shield" },
    ],
    meshType: "frostwarden",
    primaryColor: 0x083344,
    secondaryColor: 0x0891b2,
    trimColor: 0x22d3ee,
    emissiveColor: 0xa5f3fc,
  },
  {
    id: "ignis",
    name: "Ignis",
    gender: "GIRL",
    classTag: "The Flame Empress",
    archetype: "Creativity",
    motto: "Ignite your world with imagination.",
    lore: "A radiant volcano of creative energy, art, design, and inspiring storytelling. Turns blank pages into award-winning masterpieces.",
    requiredLevel: 22,
    coinCost: 5500,
    isDefaultUnlocked: false,
    imageUrl: "/characters/ignis.jpg",
    avatarGradient: "from-rose-500 via-amber-500 to-red-800",
    accentColor: "#f43f5e",
    elementIcon: "Flame",
    attributes: {
      intelligence: 80,
      strength: 60,
      wisdom: 70,
      creativity: 95,
      focus: 80,
    },
    perks: [
      { icon: "star", text: "+35% Creativity & Design quest XP" },
      { icon: "sparkles", text: "+25 Creativity genius surge" },
      { icon: "flame", text: "Phoenix Fire: Rebounds immediately from failed goals" },
      { icon: "gift", text: "Blazing Phoenix feather fan & flaming crown" },
    ],
    meshType: "flame_empress",
    primaryColor: 0x881337,
    secondaryColor: 0xe11d48,
    trimColor: 0xfb7185,
    emissiveColor: 0xfecdd3,
  },
  {
    id: "nyx",
    name: "Nyx",
    gender: "GIRL",
    classTag: "The Void Weaver",
    archetype: "Spirit",
    motto: "Embrace the infinite unknown.",
    lore: "Transmutes deep fears, procrastination, and self-doubt into boundless spiritual stamina. She weaves dreams and ambition into reality.",
    requiredLevel: 26,
    coinCost: 8000,
    isDefaultUnlocked: false,
    imageUrl: "/characters/nyx.jpg",
    avatarGradient: "from-indigo-700 via-purple-900 to-black",
    accentColor: "#818cf8",
    elementIcon: "Moon",
    attributes: {
      intelligence: 85,
      strength: 50,
      wisdom: 90,
      creativity: 85,
      focus: 92,
    },
    perks: [
      { icon: "shield", text: "+40 Mana maximum capacity" },
      { icon: "star", text: "+25 Spirit cosmic transcendence" },
      { icon: "sparkles", text: "Nebula trail and orbiting void satellites" },
      { icon: "zap", text: "Shadow Warp: Instant quest completion without mana cost once a day" },
    ],
    meshType: "void_weaver",
    primaryColor: 0x030712,
    secondaryColor: 0x312e81,
    trimColor: 0x818cf8,
    emissiveColor: 0xc7d2fe,
  },
  {
    id: "aethelgard",
    name: "Aethelgard",
    gender: "GIRL",
    classTag: "The Celestial Queen",
    archetype: "Supreme Sovereign",
    motto: "Your will shapes the universe.",
    lore: "The supreme matriarch of Aetheria. Conquered every trial, habit, and boss; radiates divine platinum light, grace, and eternal poise.",
    requiredLevel: 30,
    coinCost: 12000,
    isDefaultUnlocked: false,
    imageUrl: "/characters/aethelgard.jpg",
    avatarGradient: "from-yellow-200 via-pink-400 to-purple-900",
    accentColor: "#fde047",
    elementIcon: "Crown",
    attributes: {
      intelligence: 99,
      strength: 92,
      wisdom: 99,
      creativity: 95,
      focus: 99,
    },
    perks: [
      { icon: "star", text: "+50% All XP and Coin quest gains permanently" },
      { icon: "sparkles", text: "+30 to ALL Attribute stats" },
      { icon: "crown", text: "Divine Diamond Crown & 6 Angelic Wings of Light" },
      { icon: "zap", text: "Celestial Blessing: 100% streak shield protection" },
    ],
    meshType: "celestial_queen",
    primaryColor: 0xffffff,
    secondaryColor: 0xf59e0b,
    trimColor: 0xfde047,
    emissiveColor: 0xfef9c3,
  },
];

// Helper functions
export function getCharacterById(id: string): CharacterConfig {
  return (
    CHARACTERS_ROSTER.find((c) => c.id === id) || CHARACTERS_ROSTER[0] // fallback to Aarav
  );
}

export function getEvolutionTier(level: number): CharacterEvolutionTier {
  if (level >= 31) return EVOLUTION_TIERS[4];
  if (level >= 21) return EVOLUTION_TIERS[3];
  if (level >= 11) return EVOLUTION_TIERS[2];
  if (level >= 6) return EVOLUTION_TIERS[1];
  return EVOLUTION_TIERS[0];
}
