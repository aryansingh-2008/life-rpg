"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy, ArrowUpCircle, ShieldCheck, Coins } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  statPointsAwarded: number;
  goldCost?: number;
  title: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  newLevel,
  statPointsAwarded,
  goldCost,
  title,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      sounds.playLevelUp();

      // Confetti burst from multiple angles
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00f2ff", "#a855f7", "#f59e0b", "#10b981"],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-cyan-400 p-7 text-center shadow-[0_0_50px_rgba(0,242,255,0.4)]">
        {/* Glow Ring */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="p-4 rounded-3xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/30 animate-bounce">
            <Trophy className="w-12 h-12" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono font-black tracking-widest text-cyan-400 uppercase">
              RANK ASCENSION
            </span>
            <h2 className="text-3xl font-black text-white tracking-wide">
              LEVEL {newLevel} UNLOCKED!
            </h2>
            <p className="text-sm font-semibold text-amber-300">
              &quot;{title}&quot;
            </p>
          </div>

          <div className="w-full my-2 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ArrowUpCircle className="w-4 h-4 text-amber-400" /> Stat Points
              </span>
              <span className="font-bold text-amber-400">+{statPointsAwarded} Points</span>
            </div>
            {goldCost && goldCost > 0 ? (
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" /> Rank Ascension Cost
                </span>
                <span className="font-bold text-amber-400">-{goldCost} Coins</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Max Health & Mana
              </span>
              <span className="font-bold text-emerald-400">Expanded</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Your real-world discipline fuels your virtual sovereign power. Allocate your earned attribute points in the Radar section!
          </p>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-3.5 px-6 rounded-xl font-bold font-mono text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black shadow-lg shadow-cyan-500/30 active:scale-98 transition"
          >
            CLAIM ASCENSION
          </button>
        </div>
      </div>
    </div>
  );
};
