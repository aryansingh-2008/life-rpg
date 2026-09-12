const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function injectVirtualCursor(page) {
  try {
    await page.evaluate(() => {
      if (document.getElementById("virtual-cursor")) return;
      const cursor = document.createElement("div");
      cursor.id = "virtual-cursor";
      cursor.style.position = "fixed";
      cursor.style.top = "100px";
      cursor.style.left = "100px";
      cursor.style.width = "28px";
      cursor.style.height = "28px";
      cursor.style.pointerEvents = "none";
      cursor.style.zIndex = "9999999";
      cursor.style.transform = "translate(-2px, -2px)";
      cursor.style.transition = "transform 0.08s ease-out";
      cursor.innerHTML = `
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 0 6px rgba(6,182,212,1)) drop-shadow(0 0 12px rgba(99,102,241,0.8));">
          <path d="M3 3l7 18 3.5-7.5L21 10 3 3z" fill="#22d3ee" stroke="#020617" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        <div id="cursor-ripple" style="position:absolute; top:3px; left:3px; width:0px; height:0px; border-radius:50%; border:2.5px solid #22d3ee; opacity:0; transition:all 0.35s ease-out; transform:translate(-50%, -50%); pointer-events:none; box-shadow:0 0 12px rgba(34,211,238,0.9);"></div>
      `;
      document.body.appendChild(cursor);

      window.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      });

      window.addEventListener("mousedown", () => {
        const ripple = document.getElementById("cursor-ripple");
        if (ripple) {
          ripple.style.width = "40px";
          ripple.style.height = "40px";
          ripple.style.opacity = "1";
        }
      });

      window.addEventListener("mouseup", () => {
        const ripple = document.getElementById("cursor-ripple");
        if (ripple) {
          setTimeout(() => {
            ripple.style.width = "0px";
            ripple.style.height = "0px";
            ripple.style.opacity = "0";
          }, 150);
        }
      });
    });
  } catch (e) {
    // Ignore context destruction errors
  }
}

async function smoothMove(page, targetX, targetY, steps = 20) {
  await page.mouse.move(targetX, targetY, { steps });
}

async function smoothClick(page, locator) {
  const box = await locator.boundingBox();
  if (box) {
    await smoothMove(page, box.x + box.width / 2, box.y + box.height / 2, 22);
    await page.waitForTimeout(200);
    await page.mouse.down();
    await page.waitForTimeout(150);
    await page.mouse.up();
    await page.waitForTimeout(350);
  } else {
    await locator.click({ force: true });
  }
}

async function recordDemo() {
  console.log("Starting 1080p Ultra-HD demo video recording...");
  const projectDir = "c:\\Users\\dell\\Desktop\\life-rpg";
  const outputDir = path.join(projectDir, "public", "video-recordings");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--enable-gpu-rasterization",
      "--enable-zero-copy",
      "--ignore-gpu-blocklist",
      "--enable-webgl",
      "--window-size=1920,1080",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  console.log("Navigating to https://life-rpg-nine-gules.vercel.app...");
  await page.goto("https://life-rpg-nine-gules.vercel.app", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  await injectVirtualCursor(page);

  // Initial smooth cursor motion
  await smoothMove(page, 960, 540, 20);
  await page.waitForTimeout(2000);

  // 1. Landing Page / Demo Login (0 - 15s)
  console.log("Step 1: Demo Login...");
  const demoBtn = page.locator("button:has-text('1-CLICK DEMO CHARACTER LOGIN'), button:has-text('DEMO CHARACTER')").first();
  if ((await demoBtn.count()) > 0) {
    await smoothClick(page, demoBtn);
    await page.waitForTimeout(5000);
    await injectVirtualCursor(page);
  }

  // 2. Explore 3D Hero Avatar / 2D Art (15 - 35s)
  console.log("Step 2: Inspecting Hero Card & View Modes...");
  await smoothMove(page, 450, 450, 25);
  await page.waitForTimeout(2500);

  // Switch to 3D Mesh
  const meshBtn = page.locator("button:has-text('3D Mesh')").first();
  if ((await meshBtn.count()) > 0) {
    await smoothClick(page, meshBtn);
    await page.waitForTimeout(3000);

    // Drag mouse across 3D canvas smoothly
    await smoothMove(page, 400, 380, 20);
    await page.mouse.down();
    await page.mouse.move(600, 360, { steps: 25 });
    await page.waitForTimeout(300);
    await page.mouse.move(380, 400, { steps: 25 });
    await page.mouse.up();
    await page.waitForTimeout(2500);
  }

  // Switch back to 2D Ultra-HD Art
  const artBtn = page.locator("button:has-text('2D Art')").first();
  if ((await artBtn.count()) > 0) {
    await smoothClick(page, artBtn);
    await page.waitForTimeout(3000);
  }

  // 3. Open Adventurer Guild License & Profile Modal (35 - 48s)
  console.log("Step 3: Opening Adventurer ID Profile...");
  const profileTrigger = page.locator("button:has-text('Edit ID')").first();
  if ((await profileTrigger.count()) > 0) {
    await smoothClick(page, profileTrigger);
    await page.waitForTimeout(3500);
    await injectVirtualCursor(page);

    // Hover over profile elements
    await smoothMove(page, 960, 500, 20);
    await page.waitForTimeout(2000);

    // Close modal
    const closeBtn = page.locator("button:has(svg.lucide-x)").first();
    if ((await closeBtn.count()) > 0) {
      await smoothClick(page, closeBtn);
      await page.waitForTimeout(2500);
    }
  }

  // 4. Create New Quest (48 - 68s)
  console.log("Step 4: Creating a new Quest...");
  const newQuestBtn = page.locator("button:has-text('FORGE NEW QUEST'), button:has-text('NEW QUEST')").first();
  if ((await newQuestBtn.count()) > 0) {
    await smoothClick(page, newQuestBtn);
    await page.waitForTimeout(2000);
    await injectVirtualCursor(page);

    const titleInput = page.locator("input[placeholder*='LeetCode'], input[placeholder*='pages']").first();
    if ((await titleInput.count()) > 0) {
      await smoothClick(page, titleInput);
      await titleInput.fill("LeetCode Hard Dynamic Programming Mastery");
      await page.waitForTimeout(1000);
    }

    const descInput = page.locator("textarea").first();
    if ((await descInput.count()) > 0) {
      await smoothClick(page, descInput);
      await descInput.fill("Solve 2 complex graph & tree DP questions to unlock algorithmic sovereign mastery.");
      await page.waitForTimeout(1000);
    }

    // Submit Quest
    const submitQuestBtn = page.locator("button[type='submit']:has-text('FORGE')").first();
    if ((await submitQuestBtn.count()) > 0) {
      await smoothClick(page, submitQuestBtn);
      await page.waitForTimeout(4000);
    }
  }

  // 5. Complete a Quest & Trigger Level Up / Boss Attack (68 - 85s)
  console.log("Step 5: Completing a Quest & Hitting Boss...");
  const checkbox = page.locator("button[aria-label*='complete']").first();
  if ((await checkbox.count()) > 0) {
    await smoothClick(page, checkbox);
    console.log("Quest completed! Triggering celebration & boss damage...");
    await page.waitForTimeout(5000);
  }

  // If level up modal opened, close it
  const modalClose = page.locator("button:has-text('Claim Rewards'), button:has-text('Continue')").first();
  if ((await modalClose.count()) > 0 && (await modalClose.isVisible())) {
    await page.waitForTimeout(2500);
    await smoothClick(page, modalClose);
    await page.waitForTimeout(2000);
  }

  // 6. Visit Relic Armory & Shop (85 - 98s)
  console.log("Step 6: Visiting Armory & Shop...");
  const armoryTab = page.locator("button:has-text('Armory')").first();
  if ((await armoryTab.count()) > 0) {
    await smoothClick(page, armoryTab);
    await page.waitForTimeout(4000);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(2500);
  }

  // 7. Visit 20 Heroes Roster (98 - 112s)
  console.log("Step 7: Viewing 20 Heroes Character Roster...");
  const heroesTab = page.locator("button:has-text('Heroes')").first();
  if ((await heroesTab.count()) > 0) {
    await smoothClick(page, heroesTab);
    await page.waitForTimeout(4000);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(3500);
  }

  // 8. Page Refresh (F5) to Prove Database Persistence (112 - 128s)
  console.log("Step 8: Reloading page (F5) to demonstrate Supabase PostgreSQL persistence...");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);
  await injectVirtualCursor(page);

  // Return to Quests tab
  const questsTab = page.locator("button:has-text('Quests')").first();
  if ((await questsTab.count()) > 0) {
    await smoothClick(page, questsTab);
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
    const finalWebm = path.join(projectDir, "public", "aetheria-demo-walkthrough.webm");
    fs.copyFileSync(path.join(outputDir, videoFile), finalWebm);
    console.log(`Video recorded successfully! Saved to: ${finalWebm}`);
    const stats = fs.statSync(finalWebm);
    console.log(`Video size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  }
}

recordDemo().catch((err) => {
  console.error("Recording error:", err);
  process.exit(1);
});
