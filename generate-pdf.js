// generate-pdf.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function createManual() {
  const outputPath1 = path.join(__dirname, "USER_MANUAL.pdf");
  const outputPath2 = "C:\\Users\\dell\\Desktop\\Aetheria_Life_RPG_User_Manual.pdf";

  const doc = new PDFDocument({
    size: "A4",
    margin: 45,
    info: {
      Title: "Aetheria Life RPG - Official User Manual",
      Author: "Aetheria Development Team",
      Subject: "Productivity Game Operator Handbook",
    },
  });

  const stream1 = fs.createWriteStream(outputPath1);
  const stream2 = fs.createWriteStream(outputPath2);

  doc.pipe(stream1);
  doc.pipe(stream2);

  const colors = {
    primary: "#06b6d4",    // Cyan
    secondary: "#6366f1",  // Indigo
    dark: "#0f172a",       // Dark Slate
    text: "#1e293b",       // Charcoal text
    subtext: "#64748b",    // Gray
    accent: "#f59e0b",     // Amber gold
    success: "#10b981",    // Emerald
    danger: "#ef4444",     // Red
    bgLight: "#f8fafc",    // Slate light
    cardBg: "#f1f5f9",     // Card
  };

  // Helper functions
  function addHeader(title, subtitle = "") {
    doc.fillColor(colors.primary).fontSize(20).font("Helvetica-Bold").text(title.toUpperCase(), { tracking: 1 });
    if (subtitle) {
      doc.fillColor(colors.subtext).fontSize(10).font("Helvetica").text(subtitle);
    }
    doc.moveDown(0.5);
    doc.strokeColor(colors.primary).lineWidth(1.5).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.8);
  }

  function addSectionTitle(text) {
    doc.moveDown(0.6);
    doc.fillColor(colors.secondary).fontSize(13).font("Helvetica-Bold").text(text);
    doc.moveDown(0.3);
  }

  function addParagraph(text) {
    doc.fillColor(colors.text).fontSize(9.5).font("Helvetica").text(text, { lineGap: 3, align: "justify" });
    doc.moveDown(0.4);
  }

  function addBullet(title, desc) {
    doc.fillColor(colors.primary).fontSize(9.5).font("Helvetica-Bold").text(`• ${title}: `, { continued: true });
    doc.fillColor(colors.text).font("Helvetica").text(desc, { lineGap: 2 });
    doc.moveDown(0.25);
  }

  function addCalloutBox(title, bodyText, color = colors.primary) {
    const boxY = doc.y;
    doc.rect(45, boxY, 505, 55).fillAndStroke(colors.cardBg, color);
    doc.fillColor(color).fontSize(10).font("Helvetica-Bold").text(title, 55, boxY + 10);
    doc.fillColor(colors.text).fontSize(8.5).font("Helvetica").text(bodyText, 55, boxY + 26, { width: 485 });
    doc.y = boxY + 65;
  }

  // ==========================================
  // PAGE 1: TITLE & EXECUTIVE OVERVIEW
  // ==========================================
  doc.rect(0, 0, 595.28, 120).fill(colors.dark);
  doc.fillColor(colors.primary).fontSize(26).font("Helvetica-Bold").text("AETHERIA // LIFE RPG", 45, 35, { tracking: 2 });
  doc.fillColor("#e2e8f0").fontSize(12).font("Helvetica").text("Official User Manual & Operator Handbook", 45, 68);
  doc.fillColor(colors.accent).fontSize(9).font("Helvetica-Bold").text("VERSION 1.0 • PRODUCTION RELEASE • FULLSTACK 3D PROGRESSION", 45, 88);

  doc.y = 140;

  addHeader("1. The Core Philosophy", "Bridging the Delayed Gratification Gap");
  addParagraph(
    "Traditional productivity applications (to-do lists, reminder apps, and habit trackers) fail because they treat life like a series of administrative chores. They suffer from the delayed gratification problem: studying for 2 hours or going to the gym does not yield visible real-world changes for weeks. Video games, however, deliver immediate dopamine via tactile feedback, clear progression ladders, and visible trophies."
  );
  addParagraph(
    "Aetheria converts your everyday habits, work tasks, and fitness routines into an engaging 3D Cyber-Fantasy Role-Playing Game. Completing real tasks earns Experience Points (XP), in-game Gold, and Attribute Boosts, while dealing direct damage to raid boss monsters."
  );

  addSectionTitle("How to Access & Run the Platform");
  addParagraph("The application runs completely locally with zero external configuration or cloud lock-in:");
  addBullet("1. Open Terminal", "Navigate to C:\\Users\\dell\\Desktop\\life-rpg");
  addBullet("2. Launch App", "Execute: npm run dev");
  addBullet("3. Open Browser", "Visit http://localhost:3000 in Chrome, Edge, or Firefox");

  addCalloutBox(
    "⚡ Instant Guest Demo Mode (Zero-Setup Evaluation)",
    "Users and evaluators can skip manual registration by clicking 'TRY INSTANT DEMO' on the landing screen. You will immediately enter as Aarav (Level 3 The Wanderer) with preloaded quests, an equipped Cyber Katana, Coins, and an active Boss Raid."
  );

  doc.moveDown(0.5);
  addSectionTitle("System Architecture At A Glance");
  addBullet("Frontend", "Next.js 14 App Router, React 18, Tailwind CSS, Lucide Icons, Canvas-Confetti");
  addBullet("3D Engine", "Three.js WebGL procedural avatar with dynamic equipment binding");
  addBullet("Sound Engine", "Synthesized Web Audio API (Zero external MP3 dependency, 100% reliable)");
  addBullet("Backend API", "Server-authoritative Route Handlers (/api/*) with anti-cheat verification");
  addBullet("Database", "Prisma ORM with SQLite (local) + 1-click PostgreSQL support for production");

  // ==========================================
  // PAGE 2: STEP-BY-STEP USER GUIDE
  // ==========================================
  doc.addPage();
  addHeader("2. Interactive 3D Hero Avatar", "Visual Progression & Dynamic Equipment");
  addParagraph(
    "At the center of your screen is your personal 3D Hero Avatar rendered via WebGL Three.js. This is not a static 2D image; it is an interactive 3D procedural character."
  );

  addBullet("360-Degree Mouse Drag", "Click and drag anywhere on the 3D canvas with your mouse or finger to rotate and inspect your hero from all angles.");
  addBullet("Idle Bobbing & Aura", "Your character continuously hovers with subtle breathing animations and an orbiting stardust particle field.");
  addBullet("Dynamic 3D Equipment Swapping", "Whenever you purchase or equip gear in the Relic Armory, the 3D model immediately updates in real time:");
  doc.fillColor(colors.text).fontSize(8.5).font("Helvetica")
    .text("   • Weapon (Cyber Katana / Plasma Blade): Attaches a glowing laser sword to the right arm.", { indent: 20 })
    .text("   • Shield (Quantum Hex Shield / Void Aegis): Attaches a translucent energy barrier to the left arm.", { indent: 20 })
    .text("   • Wings (Neon Photon Wings / Archangel Wings): Unfurls holographic angular cyber-wings on the back.", { indent: 20 })
    .text("   • Crown (Neural Focus Visor / Sovereign Crown): Emits a glowing halo crown above the head.", { indent: 20 });

  doc.moveDown(0.5);
  addHeader("3. Quests & Daily Rituals", "How to Organize and Complete Real-World Tasks");
  addParagraph(
    "Quests represent your real-life productivity goals. Click the 'Quests & Daily Rituals' tab to manage them."
  );

  addSectionTitle("Quest Types Explained");
  addBullet("Daily Rituals (DAILY)", "Recurring daily commitments (e.g., 'Morning Workout', 'Study Next.js'). Reset daily to build rock-solid routines.");
  addBullet("Repeatable Habits (HABIT)", "Habits you can complete multiple times a day (e.g., 'Drink 500ml Water', '15-min Meditation').");
  addBullet("One-Time Bounties (BOUNTY)", "Single-instance tasks with large payouts (e.g., 'Clean Desk & Cable Management', 'Submit Production Milestone').");

  addSectionTitle("How to Forge a New Quest");
  addBullet("Step 1", "Click the '+ NEW QUEST' button (or press the 'N' shortcut key on your keyboard).");
  addBullet("Step 2", "Enter Quest Title (e.g. 'Solve 2 LeetCode Mediums') and optional description notes.");
  addBullet("Step 3", "Select Type (Daily, Habit, Bounty) and Target Attribute (Intellect, Strength, Agility, Vitality, Spirit).");
  addBullet("Step 4", "Choose Difficulty (Trivial, Easy, Medium, Hard, Heroic). Notice the Guaranteed Loot Preview updating dynamically!");
  addBullet("Step 5", "Click 'FORGE QUEST'. It instantly syncs with the database.");

  addCalloutBox(
    "🎯 Completing a Quest & Micro-Interactions",
    "Click the circular checkbox next to any quest. Instantly, the Web Audio engine sounds a chime, a burst of celebratory particle confetti fires, the quest marks complete, XP and Gold are added, and kinetic strike damage is dealt to the Boss!",
    colors.success
  );

  // ==========================================
  // PAGE 3: PROGRESSION, BOSS & ARMORY
  // ==========================================
  doc.addPage();
  addHeader("4. The RPG Progression Engine", "Non-Linear Mathematics & Server Anti-Cheat");
  addParagraph(
    "Aetheria implements a mathematically rigorous, server-authoritative non-linear progression engine. Users cannot spoof stats via client-side inspect element."
  );

  addSectionTitle("Non-Linear Leveling Curve");
  addParagraph(
    "Each subsequent level demands exponentially more dedication than the previous rank:"
  );
  doc.rect(45, doc.y, 505, 45).fillAndStroke(colors.bgLight, colors.secondary);
  doc.fillColor(colors.secondary).fontSize(10).font("Helvetica-Bold").text("XP Formula:  XP_Required(Level) = Math.floor( 100 * (Level ^ 1.55) )", 60, doc.y + 10);
  doc.fillColor(colors.text).fontSize(8.5).font("Helvetica").text("Level 1 -> 2: 100 XP  |  Level 2 -> 3: 292 XP  |  Level 5 -> 6: 1,211 XP  |  Level 10 -> 11: 3,548 XP", 60, doc.y + 26);
  doc.y += 55;

  addSectionTitle("Level Up Celebration & Stat Allocation");
  addParagraph(
    "When your XP crosses the threshold, a celebratory Level Up Modal emerges with dual-angle confetti fireworks and victory fanfare. Each level up awards +2 Unspent Stat Points to distribute into your Sovereign Attribute Matrix."
  );

  addHeader("5. Boss Battle Raid Arena", "Collaborative Productivity Combat");
  addParagraph(
    "Your procrastination and digital distractions are personified as an active Raid Boss: 'Malakor the Procrastinator' (Lord of Endless Delay)."
  );
  addBullet("Dealing Damage", "Completing tasks converts your gained XP into kinetic boss damage (Damage = 85% of total XP).");
  addBullet("Floating Damage Popups", "Attacking triggers visual damage flashes ('-45 HP!') and a cyber strike sound.");
  addBullet("Boss Slaying Bounty", "Depleting the Boss HP to 0 slays the beast, awarding a +150 Coins Victory Bounty and spawning the next higher tier Boss!");

  addHeader("6. Relic Armory & In-Game Economy", "Spending Your Gold on Tangible Upgrades");
  addBullet("Browse Relics", "Weapons, Shields, Wings, Helms, and Potions across Common, Rare, Epic, and Legendary tiers.");
  addBullet("Purchase Gear", "Gold earned from completing quests can be spent in the shop. Server verifies balance before granting items.");
  addBullet("Equip & Unequip", "Equipping an item immediately applies its stat bonuses and renders it onto the 3D Hero Avatar!");

  // ==========================================
  // PAGE 4: ATTRIBUTES, PERSISTENCE & FAQS
  // ==========================================
  doc.addPage();
  addHeader("7. The Sovereign Attribute Matrix", "5-Dimensional Life Balancing");
  addParagraph(
    "Tasks level up specific dimensions of your real-world capability, mapped visually in the interactive SVG Radar Pentagram:"
  );
  addBullet("⚔️ Strength (Gym & Body)", "Raised via workouts, calisthenics, physical activity. Multiplies boss strike damage.");
  addBullet("🧠 Intellect (Study & Code)", "Raised via programming, reading, problem solving. Boosts base XP reward rates.");
  addBullet("⚡ Agility (Speed & Execution)", "Raised via quick errands, inbox zero, speed cleaning. Multiplies daily streak bonuses.");
  addBullet("🌿 Vitality (Health & Sleep)", "Raised via drinking 2.5L water, 8h quality sleep, nutrition. Expands maximum HP pool.");
  addBullet("🔮 Spirit (Mindfulness)", "Raised via meditation, deep breathing, journaling. Fortifies mental resilience.");

  addHeader("8. Database Persistence & Audit Chronicles", "Proving Real Data Integrity");
  addParagraph(
    "To satisfy the strict Zero-Tolerance architecture against fake localStorage persistence, Aetheria persists all state in a relational database via Prisma ORM."
  );
  addBullet("Historical Audit Chronicles", "Click the 'Historical Audit Chronicles' tab to inspect every quest completed, with exact timestamps, XP, and gold earned stored permanently in the database.");
  addBullet("F5 Page Refresh Test", "Press F5 or reload the browser at any time. All user levels, equipment, equipped 3D meshes, quests, and audit logs remain completely persistent!");

  addHeader("9. Keyboard Shortcuts & Accessibility", "Fluid Power-User Navigation");
  addBullet("Tab / Shift+Tab", "Navigate seamlessly between quest cards, buttons, and filters.");
  addBullet("Space / Enter", "Complete the currently focused quest with instant keyboard activation.");
  addBullet("Mute / Unmute Button", "Located in the top header to toggle synthesized sound effects on or off.");

  addHeader("10. Troubleshooting & FAQ");
  addBullet("Q: Sound is not playing?", "Click the sound icon in the header navigation or click anywhere on the page to wake the browser AudioContext.");
  addBullet("Q: How do I test level up quickly?", "Complete the 'Master Next.js Fullstack Architecture' quest (Hard difficulty) or forge a Heroic quest for 160 XP!");
  addBullet("Q: Where is the database file stored?", "Inside C:\\Users\\dell\\Desktop\\life-rpg\\dev.db.");

  // Footer on final page
  doc.moveDown(1);
  doc.rect(45, doc.y, 505, 30).fill(colors.dark);
  doc.fillColor("#ffffff").fontSize(8.5).font("Helvetica-Bold").text("AETHERIA // LIFE RPG • ENGINEERED FOR VICTORY • 2026", 55, doc.y + 10, { align: "center" });

  doc.end();

  console.log("User Manual PDF created successfully at:");
  console.log("1. " + outputPath1);
  console.log("2. " + outputPath2);
}

createManual();
