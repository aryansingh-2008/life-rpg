"use client";

import React, { useState, useEffect } from "react";
import { Skull, Swords, Trophy, Coins } from "lucide-react";

interface BossBattleArenaProps {
  bossState?: {
    bossName: string;
    bossTitle: string;
    bossHp: number;
    bossMaxHp: number;
    bossLevel: number;
    isDefeated: boolean;
  } | null;
  lastDamageDealt?: number;
}

export const BossBattleArena: React.FC<BossBattleArenaProps> = ({
  bossState,
  lastDamageDealt,
}) => {
  const [showDamageFlash, setShowDamageFlash] = useState(false);

  useEffect(() => {
    if (lastDamageDealt && lastDamageDealt > 0) {
      setShowDamageFlash(true);
      const timer = setTimeout(() => setShowDamageFlash(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [lastDamageDealt]);

  if (!bossState) return null;

  const hpPercent = Math.max(0, Math.min(100, (bossState.bossHp / bossState.bossMaxHp) * 100));

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900/80 to-purple-950/40 border border-red-500/30 p-5 shadow-2xl backdrop-blur-md">
      {/* Background Boss Aura Pulsing */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 animate-pulse" />

      {/* Floating Damage Indicator */}
      {showDamageFlash && lastDamageDealt && (
        <div className="absolute top-4 right-10 z-20 animate-bounce text-2xl font-black font-mono text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
          💥 -{lastDamageDealt} HP!
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative p-3 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 shadow-lg shadow-red-950/50">
            <Skull className="w-8 h-8 animate-pulse" />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-red-600 text-white">
              LV.{bossState.bossLevel}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-red-400 uppercase">
                ACTIVE RAID BOSS
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Coins className="w-3.5 h-3.5 text-amber-400" /> +150 Coins Victory Bounty
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-100 tracking-wide">
              {bossState.bossName}
            </h3>
            <span className="text-xs text-red-300/80 italic">
              &quot;{bossState.bossTitle}&quot;
            </span>
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className="w-full md:w-64 flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Swords className="w-3 h-3 text-red-400" /> HP Integrity
            </span>
            <span className="font-bold text-red-300">
              {bossState.bossHp} / {bossState.bossMaxHp} ({hpPercent.toFixed(0)}%)
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-red-500/30 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(239,68,68,0.5)]"
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 text-right">
            Complete daily quests to deal direct strike damage!
          </p>
        </div>
      </div>
    </div>
  );
};
