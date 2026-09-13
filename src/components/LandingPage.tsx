"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Shield,
  Zap,
  Swords,
  Brain,
  Dumbbell,
  Heart,
  Play,
  ArrowRight,
  Lock,
  Database,
  Volume2,
  CheckCircle2,
  FileText,
  Layers,
} from "lucide-react";
import { HeroShowcaseCard } from "@/components/HeroShowcaseCard";
import { AuthModal } from "@/components/AuthModal";
import { sounds } from "@/lib/soundEffects";

interface LandingPageProps {
  currentUser?: any;
  onEnterRealm?: () => void;
  onBackToLogin?: () => void;
  onLoginSuccess: (user: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  onEnterRealm,
  onBackToLogin,
  onLoginSuccess,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    sounds.playClick();
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo login failed");
      sounds.playQuestComplete();
      onLoginSuccess(data.user);
    } catch (err: any) {
      alert(err.message || "Failed to initialize demo character");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const openAuth = (mode: "LOGIN" | "SIGNUP") => {
    sounds.playClick();
    setAuthInitialMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Public Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black tracking-wider text-white">
                  AETHERIA
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LIFE RPG
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Sovereign Productivity Realm
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onBackToLogin && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onBackToLogin();
                }}
                className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-400 hover:text-white transition flex items-center gap-1"
              >
                <span>← Back to Login</span>
              </button>
            )}

            {/* Quick Demo Play Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10 active:scale-95 transition"
              title="Enter immediately as Level 3 demo hero"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>{isDemoLoading ? "CONNECTING..." : "TRY INSTANT DEMO"}</span>
            </button>

            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  sounds.playQuestComplete();
                  if (onEnterRealm) onEnterRealm();
                }}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-95 transition"
              >
                <span>ENTER REALM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => openAuth("LOGIN")}
              className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-300 hover:text-white transition"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => openAuth("SIGNUP")}
              className="px-3.5 sm:px-4 py-1.5 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95 transition"
            >
              Create Hero
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4">
        {/* Background Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Vision & Action */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold w-fit">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>DISCIPLINE ENGINE // V1.0 PRODUCTION</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white leading-tight">
              Turn Real-World <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-300">Discipline</span> Into A 3D RPG Legend.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-sans">
              Traditional to-do lists fail because reading a textbook or going to the gym takes months to show results. <strong>Aetheria</strong> bridges this delayed gratification gap by transforming everyday tasks into tactile 3D progression, synthesized audio fanfares, non-linear leveling, and epic Raid Boss battles.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playQuestComplete();
                    if (onEnterRealm) onEnterRealm();
                  }}
                  className="px-6 py-3.5 rounded-2xl font-mono text-sm font-bold bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 active:scale-95 transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>CONTINUE AS {currentUser.username.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuth("LOGIN")}
                  className="px-6 py-3.5 rounded-2xl font-mono text-sm font-bold bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 active:scale-95 transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>SIGN IN & ENTER REALM</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => openAuth("SIGNUP")}
                className="px-6 py-3.5 rounded-2xl font-mono text-sm font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <span>FORGE NEW HERO</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isDemoLoading}
                className="px-6 py-3.5 rounded-2xl font-mono text-sm font-bold bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-current" />
                <span>{isDemoLoading ? "CONNECTING..." : "TRY INSTANT DEMO"}</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-2xl font-black font-mono text-cyan-400">100%</span>
                <span className="text-xs text-slate-400 font-mono">Server-Authoritative</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-mono text-amber-400">360°</span>
                <span className="text-xs text-slate-400 font-mono">Interactive 3D WebGL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-mono text-purple-400">0.0s</span>
                <span className="text-xs text-slate-400 font-mono">Zero Latency Audio</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Hero Showcase Preview */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <HeroShowcaseCard
              level={8}
              characterId="ananya"
              equippedItems={[
                {
                  item: {
                    name: "Cyber Katana",
                    category: "WEAPON",
                    visualKey: "cyber_katana",
                    rarity: "RARE",
                  },
                },
                {
                  item: {
                    name: "Plasma Aegis",
                    category: "SHIELD",
                    visualKey: "cyber_shield",
                    rarity: "RARE",
                  },
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 px-4 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              CORE GAMEPLAY ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-mono text-white">
              Why Aetheria Works When To-Do Lists Fail
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Every system is built to eliminate delayed gratification and deliver instant tactile dopamine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3 hover:border-cyan-500/40 transition">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">
                Interactive 3D Hero Avatar
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live WebGL Three.js character rendered with gleaming silver titanium armor, golden trims, and dynamic gear binding. Swords, shields, and wings equip directly on the 3D model in real time!
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3 hover:border-red-500/40 transition">
              <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
                <Swords className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">
                Boss Raid Arena
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Procrastination is personified as <em>Malakor the Procrastinator</em>. Completing your daily coding or workouts strikes the Boss with kinetic damage, depleting its HP and earning victory bounties!
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3 hover:border-amber-500/40 transition">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">
                Non-Linear Progression Math
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mathematically enforced curve: <code className="text-cyan-300">XP(L) = floor(400 * L^1.65)</code>. Server-authoritative anti-cheat calculation prevents users from spoofing levels or coins.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3 hover:border-purple-500/40 transition">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">
                5 Sovereign Attributes
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fitness fuels <strong>Strength</strong> ⚔️, coding raises <strong>Intellect</strong> 🧠, speed chores level <strong>Agility</strong> ⚡, hydration feeds <strong>Vitality</strong> 🌿, and meditation expands <strong>Spirit</strong> 🔮. Visualized in an SVG Radar pentagram.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3 hover:border-emerald-500/40 transition">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">
                PostgreSQL Cloud Persistence
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real database persistence powered by Supabase PostgreSQL. Quests, inventory, attribute allocation, and audit logs persist securely across page refreshes and devices.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3 hover:border-indigo-500/40 transition">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">
                Synthesized Web Audio Synth
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Procedural 8-bit audio synthesized in real time. Retro chimes for quest completion, coin pickup, boss strikes, and level-up victory fanfares with zero broken external audio links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Human Developer Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 backdrop-blur-md shadow-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-2xl font-mono shrink-0 shadow-lg shadow-cyan-500/25">
            AS
          </div>
          <div className="flex flex-col gap-2.5 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Developer Note
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">By Aryan Singh</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
              Why I built Aetheria
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Traditional productivity tools always felt like a second job. When checking off an item on a plain to-do list doesn&apos;t produce an immediate tactile sensation, it is so easy to fall into procrastination. As a developer and gamer, I wanted to experience real-world discipline with the same dopamine loop that keeps us engaged in RPGs: real bosses, authentic weapon progression, and tangible streak shields.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Aetheria was hand-crafted to prove that self-improvement doesn&apos;t have to feel like homework.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 p-8 sm:p-12 text-center flex flex-col items-center gap-5 shadow-2xl">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            <Zap className="w-8 h-8 animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-mono text-white">
            Ready to Begin Your Progression?
          </h2>

          <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
            Explore the full live platform instantly. Test 3D equipment, boss combat, and quest progression with a pre-configured adventurer.
          </p>

          <button
            onClick={handleDemoLogin}
            disabled={isDemoLoading}
            className="px-8 py-4 rounded-2xl font-mono text-sm font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 shadow-xl shadow-cyan-500/30 active:scale-95 transition flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>LAUNCH INSTANT PLAY DEMO</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-900 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>AETHERIA // LIFE RPG • Built by Aryan Singh</span>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Next.js 14 • Three.js • Prisma ORM</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal Triggered by Buttons */}
      {showAuthModal && (
        <AuthModal
          initialMode={authInitialMode}
          currentUser={currentUser}
          onEnterRealm={onEnterRealm}
          onSuccess={(user) => {
            setShowAuthModal(false);
            onLoginSuccess(user);
          }}
        />
      )}
    </div>
  );
};
