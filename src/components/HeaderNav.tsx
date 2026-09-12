"use client";

import React, { useState } from "react";
import {
  Coins,
  Flame,
  Volume2,
  VolumeX,
  LogOut,
  Sparkles,
  Shield,
  User,
} from "lucide-react";
import { sounds } from "@/lib/soundEffects";
import { getCharacterById } from "@/lib/charactersConfig";

interface UserProfile {
  username: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  gold: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  streak: number;
  streakShields?: number;
  title: string;
  characterId?: string;
  requiredGoldForLevelUp?: number;
}

interface HeaderNavProps {
  user: UserProfile;
  activeTab: "QUESTS" | "CHARACTER" | "ARMORY" | "RADAR" | "LOGS";
  onTabChange: (tab: "QUESTS" | "CHARACTER" | "ARMORY" | "RADAR" | "LOGS") => void;
  onLogout: () => void;
  onAscend?: () => void;
  onOpenProfile?: () => void;
  isAscending?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  user,
  activeTab,
  onTabChange,
  onLogout,
  onAscend,
  onOpenProfile,
  isAscending,
}) => {
  const [isMuted, setIsMuted] = useState(sounds.getIsMuted());

  const handleMuteToggle = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playClick();
  };

  const activeHero = getCharacterById(user.characterId || "aarav");
  const reqXp = user.nextLevelXp || 400;
  const reqGold = user.requiredGoldForLevelUp ?? 50;

  const xpPercent = Math.min(
    100,
    Math.max(0, (user.xp / reqXp) * 100)
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Character Identity */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/30">
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
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  {activeHero.name} ({activeHero.classTag})
                </span>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenProfile) onOpenProfile();
                }}
                className="flex items-center gap-1.5 text-xs text-slate-400 font-mono hover:text-cyan-300 transition text-left group/profile py-0.5 -ml-1 px-1 rounded-lg hover:bg-slate-900/90 w-fit"
                title="Open Adventurer ID & Edit Hero Profile"
              >
                <span className="text-cyan-400 font-bold group-hover/profile:underline flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  {user.username}
                </span>
                <span>•</span>
                <span className="text-slate-300">{user.title}</span>
                <span className="text-[9px] font-mono text-cyan-400 border border-cyan-500/30 px-1 py-0.2 rounded bg-cyan-500/10 ml-0.5 group-hover/profile:border-cyan-400">
                  Edit ID
                </span>
              </button>
            </div>
          </div>

          {/* Quick Controls Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                if (onOpenProfile) onOpenProfile();
              }}
              title="Adventurer ID & Profile"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={handleMuteToggle}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Progression Stats (XP, HP, Gold, Streak) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full md:w-auto">
          {/* Level & XP Bar */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-black">
              LV.{user.level}
            </div>
            <div className="w-28 sm:w-36 flex flex-col gap-0.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>XP</span>
                <span>
                  {user.xp}/{reqXp} (Cost: {reqGold} Coins)
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Ascension Action Button if XP is ready */}
          {user.xp >= reqXp && (
            user.gold >= reqGold ? (
              <button
                onClick={onAscend}
                disabled={isAscending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs font-mono font-black shadow-lg shadow-amber-500/30 animate-pulse transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ascend to Lv.{user.level + 1} ({reqGold} Coins)</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Need {reqGold - user.gold} Coins to Ascend</span>
              </div>
            )
          )}

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono font-bold text-amber-400">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{user.gold} Coins</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs font-mono font-bold text-amber-300">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{user.streak}d Streak</span>
          </div>

          {/* Streak Protection Shields */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition cursor-help ${
              (user.streakShields ?? 0) > 0
                ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-300 shadow-sm shadow-indigo-500/10"
                : "bg-slate-900/90 border-slate-800 text-slate-400"
            }`}
            title={`Streak Protection: ${user.streakShields ?? 0}/2 Shields active. 1 shield protects 1 missed day without breaking your streak. Earn 1 shield every 7 consecutive days (Max 2).`}
          >
            <Shield className={`w-4 h-4 ${(user.streakShields ?? 0) > 0 ? "text-indigo-400 fill-indigo-400/20" : "text-slate-500"}`} />
            <span>{user.streakShields ?? 0}/2 Shields</span>
            <div className="flex items-center gap-1 ml-0.5">
              {[1, 2].map((slot) => (
                <span
                  key={slot}
                  className={`inline-block w-2 h-2 rounded-full transition-all ${
                    (user.streakShields ?? 0) >= slot
                      ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]"
                      : "bg-slate-800 border border-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Profile, Sound & Logout */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                if (onOpenProfile) onOpenProfile();
              }}
              title="Adventurer ID & Hero Profile"
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={handleMuteToggle}
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-red-400 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-900">
        {[
          { id: "QUESTS", label: "⚔️ Quests & Daily Rituals" },
          { id: "CHARACTER", label: "✦ Characters (20 Heroes)" },
          { id: "ARMORY", label: "🛡️ Relic Armory & Shop" },
          { id: "RADAR", label: "📊 Attributes & 3D Hero" },
          { id: "LOGS", label: "📜 Historical Chronicles" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sounds.playClick();
              onTabChange(tab.id as any);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
