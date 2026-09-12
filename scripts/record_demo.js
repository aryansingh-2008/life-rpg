const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function recordDemo() {
  console.log("Starting demo video recording...");
  const projectDir = "c:\\Users\\dell\\Desktop\\life-rpg";
  const outputDir = path.join(projectDir, "public", "video-recordings");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  console.log("Navigating to https://life-rpg-nine-gules.vercel.app...");
  await page.goto("https://life-rpg-nine-gules.vercel.app", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);

  // 1. Landing Page / Demo Login (0 - 15s)
  console.log("Step 1: Demo Login...");
  const demoBtn = page.locator("button:has-text('1-CLICK DEMO CHARACTER LOGIN'), button:has-text('DEMO CHARACTER')");
  if ((await demoBtn.count()) > 0) {
    await demoBtn.first().click();
    await page.waitForTimeout(5000);
  }

  // 2. Explore 3D Hero Avatar / 2D Art (15 - 35s)
  console.log("Step 2: Inspecting Hero Card & View Modes...");
  await page.mouse.move(640, 360);
  await page.waitForTimeout(2500);

  // Switch to 3D Mesh
  const meshBtn = page.locator("button:has-text('3D Mesh')");
  if ((await meshBtn.count()) > 0) {
    await meshBtn.first().click();
    await page.waitForTimeout(3000);
    // Drag mouse across 3D canvas
    await page.mouse.move(400, 300);
    await page.mouse.down();
    await page.mouse.move(550, 280, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(2500);
  }

  // Switch back to 2D Ultra-HD Art
  const artBtn = page.locator("button:has-text('2D Art')");
  if ((await artBtn.count()) > 0) {
    await artBtn.first().click();
    await page.waitForTimeout(2500);
  }

  // 3. Open Adventurer Guild License & Profile Modal (35 - 48s)
  console.log("Step 3: Opening Adventurer ID Profile...");
  const profileTrigger = page.locator("button:has-text('Edit ID')");
  if ((await profileTrigger.count()) > 0) {
    await profileTrigger.first().click();
    await page.waitForTimeout(3500);
    // Close modal
    const closeBtn = page.locator("button:has(svg.lucide-x)").first();
    if ((await closeBtn.count()) > 0) {
      await closeBtn.click();
      await page.waitForTimeout(2500);
    }
  }

  // 4. Create New Quest (48 - 68s)
  console.log("Step 4: Creating a new Quest...");
  const newQuestBtn = page.locator("button:has-text('FORGE NEW QUEST'), button:has-text('NEW QUEST')").first();
  if ((await newQuestBtn.count()) > 0) {
    await newQuestBtn.click();
    await page.waitForTimeout(2000);

    const titleInput = page.locator("input[placeholder*='LeetCode'], input[placeholder*='pages']").first();
    if ((await titleInput.count()) > 0) {
      await titleInput.fill("LeetCode Hard Dynamic Programming");
      await page.waitForTimeout(1000);
    }

    const descInput = page.locator("textarea").first();
    if ((await descInput.count()) > 0) {
      await descInput.fill("Solve 2 complex graph & tree DP questions to unlock algorithmic transcendence.");
      await page.waitForTimeout(1000);
    }

    // Submit Quest
    const submitQuestBtn = page.locator("button[type='submit']:has-text('FORGE')").first();
    if ((await submitQuestBtn.count()) > 0) {
      await submitQuestBtn.click();
      await page.waitForTimeout(4000);
    }
  }

  // 5. Complete a Quest & Trigger Level Up / Boss Attack (68 - 85s)
  console.log("Step 5: Completing a Quest & Hitting Boss...");
  const checkbox = page.locator("button[aria-label*='complete']").first();
  if ((await checkbox.count()) > 0) {
    await checkbox.click({ force: true });
    console.log("Quest completed! Triggering celebration & boss damage...");
    await page.waitForTimeout(5000);
  }

  // If level up modal opened, close it
  const modalClose = page.locator("button:has-text('Claim Rewards'), button:has-text('Continue')").first();
  if ((await modalClose.count()) > 0 && (await modalClose.isVisible())) {
    await page.waitForTimeout(2500);
    await modalClose.click();
    await page.waitForTimeout(2000);
  }

  // 6. Visit Relic Armory & Shop (85 - 98s)
  console.log("Step 6: Visiting Armory & Shop...");
  const armoryTab = page.locator("button:has-text('Armory')").first();
  if ((await armoryTab.count()) > 0) {
    await armoryTab.click();
    await page.waitForTimeout(4000);
    await page.mouse.wheel(0, 250);
    await page.waitForTimeout(2500);
  }

  // 7. Visit 20 Heroes Roster (98 - 112s)
  console.log("Step 7: Viewing 20 Heroes Character Roster...");
  const heroesTab = page.locator("button:has-text('Heroes')").first();
  if ((await heroesTab.count()) > 0) {
    await heroesTab.click();
    await page.waitForTimeout(4000);
    await page.mouse.wheel(0, 350);
    await page.waitForTimeout(3500);
  }

  // 8. Page Refresh (F5) to Prove Database Persistence (112 - 128s)
  console.log("Step 8: Reloading page (F5) to demonstrate Supabase PostgreSQL persistence...");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);

  // Return to Quests tab
  const questsTab = page.locator("button:has-text('Quests')").first();
  if ((await questsTab.count()) > 0) {
    await questsTab.click();
    await page.waitForTimeout(4500);
  }

  console.log("Finished recording sequence! Finalizing video...");
  await page.close();
  await context.close();
  await browser.close();

  // Find saved video file
  const files = fs.readdirSync(outputDir);
  const videoFile = files.find((f) => f.endsWith(".webm"));
  if (videoFile) {
    const finalPath = path.join(projectDir, "public", "aetheria-demo-walkthrough.webm");
    fs.copyFileSync(path.join(outputDir, videoFile), finalPath);
    console.log(`Video recorded successfully! Saved to: ${finalPath}`);
    const stats = fs.statSync(finalPath);
    console.log(`Video size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  }
}

recordDemo().catch((err) => {
  console.error("Recording error:", err);
  process.exit(1);
});
