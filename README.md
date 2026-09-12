# ⚡ Aetheria // Life RPG

> **Translate mundane real-world productivity into an immersive, tactile 3D cyber-fantasy progression system.**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-teal?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🌟 The Core Problem & Our Solution

Traditional habit trackers and to-do lists fail because they feel like chores. They suffer from the **"delayed gratification"** problem: reading a textbook or going to the gym takes months to show tangible results. In contrast, video games provide immediate dopamine through tactile feedback loops, clear leveling systems, and visual trophies.

**Aetheria** solves this problem by engineering a **production-grade, server-authoritative Life RPG**. Mundane checkmarks transform into visceral victories:

- 🎮 **Tactile Dopamine**: Earning XP triggers synthesized Web Audio chimes, particle confetti bursts, and celebratory level-up modals.
- 🛡️ **Interactive 3D Hero Avatar (Three.js)**: A live WebGL 3D character that updates visually whenever you equip weapons, shields, wings, or crowns in the shop.
- 🔒 **Server-Authoritative Anti-Cheat**: Stats, streaks, leveling curves, and gold transactions are strictly computed and verified on the backend to prevent client-side spoofing.
- 📜 **Real Database Persistence**: Backed by Prisma ORM and SQLite (local zero-setup) with seamless PostgreSQL support (Supabase/Neon) for production.
- ⚔️ **Boss Raid Dungeon Arena**: Completing real-world tasks deals direct attack damage to a dynamic raid boss monster!

---

## ⚔️ Core Features & Architecture

```
                                  ┌────────────────────────┐
                                  │   Next.js 14 Client    │
                                  │ (Tailwind + Three.js)  │
                                  └───────────┬────────────┘
                                              │ HTTP + JWT
                                  ┌───────────▼────────────┐
                                  │ Server Route Handlers  │
                                  │   (/api/* Endpoints)   │
                                  └───────────┬────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │                                               │
           ┌──────────▼──────────┐                         ┌──────────▼──────────┐
           │ Anti-Cheat Engine   │                         │  Prisma Database    │
           │ • Non-linear XP     │                         │ • Users & Quests    │
           │ • Streak Multiplier │                         │ • Inventory & Shop  │
           │ • Boss Damage Logic │                         │ • Immutable Logs    │
           └─────────────────────┘                         └─────────────────────┘
```

### 1. Interactive 3D Hero Avatar (Three.js)
- Procedural stylized cyber-warrior rendered directly in WebGL.
- Hovering idle animations with ambient particle vortex.
- Full 360-degree mouse-drag inspection.
- **Dynamic 3D Gear Swapping**: Equipping the *Cyber Katana*, *Quantum Hex Shield*, *Neon Photon Wings*, or *Crown of the Cyber Sovereign* alters the 3D model in real time!

### 2. The RPG Progression Engine
- **Non-Linear Leveling Formula**:
  $$\text{XP Required}(L) = \lfloor 100 \times L^{1.55} \rfloor$$
  Each subsequent rank demands exponentially greater real-world discipline.
- **5 Core Sovereign Attributes**:
  - ⚔️ **Strength**: Gym, workouts, posture. Boosts boss strike power.
  - 🧠 **Intellect**: Coding, study, reading. Enhances XP gains.
  - ⚡ **Agility**: Speed chores, inbox zero, organization. Multiplies streak rewards.
  - 🌿 **Vitality**: Water intake, 8h sleep, nutrition. Expands health pool.
  - 🔮 **Spirit**: Meditation, journaling, screen detox. Sharpens mental focus.
- **Interactive SVG Radar Pentagram**: Visualizes attribute balance and allows allocating unspent stat points.

### 3. Server-Authoritative Anti-Cheat Backend
- Zero client trust: the client cannot send forged XP or gold amounts.
- Atomic database transactions (`prisma.$transaction`) ensure data consistency across leveling, gold rewards, quest logs, and boss health.
- Streak multipliers automatically reward consecutive daily activity (+5% per consecutive day up to +50%).

### 4. Boss Raid Arena (Hackathon X-Factor)
- Active boss: **Malakor the Procrastinator** (Lord of Endless Delay).
- Every completed quest strikes the boss with kinetic damage.
- Slaying the boss triggers screen-wide celebratory fireworks and awards a +150 Coins victory bounty before spawning the next tier boss.

### 5. Web Audio API Sound Synthesizer
- Built-in zero-dependency sound engine. No missing audio files!
- Procedural 8-bit retro sounds for button ticks, quest completions, gold pickup, boss hits, and level-up victory fanfares.
- Persistent mute/unmute control.

### 6. Historical Audit Chronicles
- Full audit log of completed quests, timestamps, XP earned, and attributes boosted stored persistently in the database.

### 7. Authoritative Streak Protection Shield System
- **Streak Break Prevention**: 1 missed day consumes 1 shield instead of resetting your streak.
- **7-Day Milestone Reward**: Earn +1 Streak Protection Shield every 7 consecutive days of activity.
- **Strict Cap of 2**: Shield inventory is strictly capped at a maximum of 2 shields (never overflows).
- **Header Badge & Visual Indicators**: Live shield slot pips and informative tooltips in the top navigation.

### 8. 20-Hero Character Roster & Dynamic Evolution
- **Diverse Roster**: 20 distinct hero identities (10 male, 10 female) each with custom HD portrait art, background lore, class tags, and attribute specializations.
- **4 Evolution Tiers**: Characters visually advance from *Novice (Tier I)* to *Ascended Sovereign (Tier IV)* as the player levels up.
- **Coin & Level Recruitment**: Recruit new heroes from the character selection screen using accumulated in-game Coins and disciplined level milestones.

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18.17 or higher
- npm v9 or higher

### Step 1: Clone and Install Dependencies
```bash
git clone https://github.com/your-username/life-rpg.git
cd life-rpg
npm install
```

### Step 2: Configure Environment
Copy the environment template:
```bash
cp .env.example .env
```
*(The default `.env` is preconfigured for zero-setup SQLite out of the box).*

### Step 3: Initialize Database & Seed Starter Data
```bash
npm run db:push
npm run db:seed
```
This prepares the SQLite database and populates default armory relics, starter quests, and the **Demo Hero** account.

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 1-Click Judge Evaluation Mode
To evaluate the project instantly without signing up:
1. Open the web app.
2. Click **"1-CLICK DEMO CHARACTER LOGIN"**.
3. You will immediately enter as `CyberKnight_Alex` (Level 3 Aether Initiate) with preloaded quests, equipped Cyber Katana, 280 Coins, and an active Boss Raid.

---

## 🚢 Production Cloud Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Under Environment Variables:
   - `DATABASE_URL`: Add your PostgreSQL connection string (from free [Neon](https://neon.tech) or [Supabase](https://supabase.com)).
   - `JWT_SECRET`: Any random 32-character secret string.
   - `NEXT_PUBLIC_APP_URL`: Your live production domain.
4. If using PostgreSQL for production, set `provider = "postgresql"` in `prisma/schema.prisma`.
5. Deploy! The project builds with zero errors.

---

## 🎥 Demonstration Video Walkthrough Script (90–180s)

| Time Window | Visual Action | Narrative Point |
| :--- | :--- | :--- |
| **0:00 - 0:25** | Open app, show Auth screen, click **"1-Click Demo Character Login"** or Sign Up. | Introduce Aetheria: Solving the delayed gratification problem of habit trackers with a full-stack 3D Life RPG. |
| **0:25 - 0:50** | Inspect the **3D Hero Avatar** by dragging with the mouse. Show the equipped weapon/shield. | Highlight Three.js integration, WebGL rendering, and responsive controls. |
| **0:50 - 1:15** | Click **"NEW QUEST"**, create a Hard Intellect quest (e.g. "LeetCode Grind"). Show instant XP/Gold preview. | Demonstrate full CRUD and server-side difficulty-to-reward calculation. |
| **1:15 - 1:40** | Complete a quest! Sound chime plays, confetti bursts, boss takes -45 HP damage, and **Level Up Modal** pops up. | Showcase tactile micro-interactions, Web Audio synth, non-linear leveling, and boss damage. |
| **1:40 - 2:05** | Open **Relic Armory & Shop**. Buy and equip **"Neon Photon Wings"**. Switch back and show wings rendered on the 3D hero! | Demonstrate in-game economy, gold verification, and dynamic 3D equipment binding. |
| **2:05 - 2:30** | Press **F5 (Page Refresh)**. | **Zero-Tolerance Compliance**: Prove all stats, equipped gear, quests, and historical logs remain completely intact via real database persistence! |

---

## 🛡️ Hackathon Compliance Matrix

| Disqualification Rule | Status | Proof |
| :--- | :---: | :--- |
| **Broken Links** | ✅ PASS | Zero external audio or image dependencies. Self-contained synthesized audio and procedural 3D WebGL. |
| **Fake Data Persistence** | ✅ PASS | Strict server-side database persistence using Prisma ORM & SQLite/PostgreSQL. Zero reliance on `localStorage` for primary data. |
| **Build Failure** | ✅ PASS | Verified clean Next.js 14 production build (`npm run build`) with zero compile or type errors. |
| **Console/Runtime Crashes** | ✅ PASS | Defensive error boundaries, typed API responses, and zero runtime crashes. |
| **Invalid Repository** | ✅ PASS | Granular, chronological Git commit history ($\ge 4$ commits) documenting architectural milestones. |

---

## 📜 License
MIT License. Created for the Life RPG Hackathon 2026.
