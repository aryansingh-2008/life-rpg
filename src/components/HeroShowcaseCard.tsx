"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Shield,
  Zap,
  Sword,
  Lock,
  CheckCircle2,
  ChevronRight,
  Box,
  Image as ImageIcon,
} from "lucide-react";
import {
  getCharacterById,
  getEvolutionTier,
  EVOLUTION_TIERS,
} from "@/lib/charactersConfig";
import { Hero3DCanvas } from "@/components/Hero3DCanvas";
import { sounds } from "@/lib/soundEffects";

interface HeroShowcaseCardProps {
  level: number;
  characterId?: string;
  equippedItems?: Array<{
    item: {
      name: string;
      category: string;
      visualKey: string;
      rarity: string;
    };
  }>;
  onSwitchCharacter?: () => void;
}

const EVO_IMAGE_MAP: Record<string, string> = {
  Beginner: "/characters/evo_tier_beginner.jpg",
  Adventurer: "/characters/evo_tier_adventurer.jpg",
  Warrior: "/characters/evo_tier_warrior.jpg",
  Elite: "/characters/evo_tier_elite.jpg",
  Master: "/characters/evo_tier_master.jpg",
};

export const HeroShowcaseCard: React.FC<HeroShowcaseCardProps> = ({
  level,
  characterId = "aarav",
  equippedItems = [],
  onSwitchCharacter,
}) => {
  const [viewMode, setViewMode] = useState<"2D" | "3D">("2D");
  const [isEvolutionExpanded, setIsEvolutionExpanded] = useState(false);

  const character = getCharacterById(characterId);
  const currentTier = getEvolutionTier(level);

  // Weapon & Shield info if equipped
  const weaponItem = equippedItems.find(
    (eq) => eq.item?.category === "WEAPON"
  )?.item;
  const shieldItem = equippedItems.find(
    (eq) => eq.item?.category === "SHIELD"
  )?.item;

  // Image source: if Ananya, prefer dashboard banner if available
  const heroImageSrc =
    character.id === "ananya" && character.dashboardImageUrl
      ? character.dashboardImageUrl
      : character.imageUrl || `/characters/${character.id}.jpg`;

  return (
    <div className="w-full flex flex-col rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-cyan-500/30 shadow-2xl overflow-hidden backdrop-blur-xl relative group">
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: character.accentColor }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: character.accentColor }}
      />

      {/* Top Header Toolbar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-800/80 z-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-md border"
            style={{
              backgroundColor: `${character.accentColor}20`,
              borderColor: `${character.accentColor}60`,
              color: character.accentColor,
            }}
          >
            ✦
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-black text-white tracking-wide">
                {character.name}
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Lv. {level} {currentTier.tierName}
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">
              {character.classTag} • {character.archetype}
            </span>
          </div>
        </div>

        {/* Action Controls: 2D/3D Mode Toggle & Switch Character */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950/90 rounded-xl p-1 border border-slate-800">
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode("2D");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                viewMode === "2D"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow font-black"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="2D Anime Artwork"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>2D Art</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode("3D");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                viewMode === "3D"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow font-black"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="3D Canvas Mesh"
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D</span>
            </button>
          </div>

          {onSwitchCharacter && (
            <button
              onClick={() => {
                sounds.playClick();
                onSwitchCharacter();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-xs font-mono text-slate-200 hover:text-cyan-300 transition flex items-center gap-1.5 shadow"
            >
              <span>Heroes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas / Visual Arena */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-slate-950 flex items-center justify-center">
        {viewMode === "2D" ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Full-bleed high-res Character Artwork */}
            <img
              src={heroImageSrc}
              alt={character.name}
              className="absolute inset-0 w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-700"
            />

            {/* Gradient Overlays for readability and dramatic atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent pointer-events-none" />

            {/* Top-Right Badges on Image */}
            <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300 shadow-lg">
                {character.gender} CHAMPION
              </span>
              <span
                className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold shadow"
                style={{
                  backgroundColor: `${character.accentColor}30`,
                  color: character.accentColor,
                  border: `1px solid ${character.accentColor}60`,
                }}
              >
                {character.archetype}
              </span>
            </div>

            {/* Bottom-Left Equipped Gear overlay on Image */}
            <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2">
              {weaponItem && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono font-bold shadow-lg">
                  <Sword className="w-3.5 h-3.5 text-amber-400" />
                  <span>{weaponItem.name}</span>
                </div>
              )}
              {shieldItem && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-sky-500/40 text-sky-300 text-xs font-mono font-bold shadow-lg">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>{shieldItem.name}</span>
                </div>
              )}
              {!weaponItem && !shieldItem && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-400 text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Armory gear unequipped</span>
                </div>
              )}
            </div>

            {/* Bottom-Right Motto */}
            <div className="absolute bottom-3 right-3 z-10 max-w-[200px] text-right hidden sm:block">
              <p className="text-[11px] font-serif italic text-cyan-200/90 drop-shadow-md">
                &ldquo;{character.motto}&rdquo;
              </p>
            </div>
          </div>
        ) : (
          /* 3D Fallback Interactive Mesh Canvas */
          <div className="w-full h-full relative">
            <Hero3DCanvas
              level={level}
              characterId={character.id}
              equippedItems={equippedItems}
            />
          </div>
        )}
      </div>

      {/* Evolution Progression Track matching media_1789236256803.jpg */}
      <div className="px-5 py-3 bg-slate-950/60 border-t border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Evolution Path
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold">
            Current Tier: {currentTier.tierName} (Lv. {level})
          </span>
        </div>

        {/* 5-Tier Illustrated Progression Row */}
        <div className="grid grid-cols-5 gap-2">
          {EVOLUTION_TIERS.map((tier) => {
            const isCurrent = currentTier.tierName === tier.tierName;
            const isUnlockedTier = level >= tier.minLevel;
            const tierImg = EVO_IMAGE_MAP[tier.tierName] || character.imageUrl;

            return (
              <div
                key={tier.tierName}
                className={`flex flex-col items-center rounded-xl p-1.5 border transition-all duration-300 relative overflow-hidden group ${
                  isCurrent
                    ? "bg-cyan-950/50 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400"
                    : isUnlockedTier
                    ? "bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600"
                    : "bg-slate-950/60 border-slate-850 opacity-40 text-slate-500"
                }`}
              >
                {/* Active indicator badge */}
                {isCurrent && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 text-[8px] font-mono font-black uppercase tracking-wider shadow">
                    Active
                  </span>
                )}

                {/* Tier Image Thumbnail */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden relative mb-1 border border-slate-700/70 bg-slate-900 flex-shrink-0">
                  <img
                    src={tierImg}
                    alt={tier.tierName}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  {!isUnlockedTier && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                  {isUnlockedTier && !isCurrent && (
                    <div className="absolute bottom-0 right-0 p-0.5 rounded-tl bg-emerald-500 text-slate-950">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <span
                  className={`text-[10px] font-sans font-bold leading-tight text-center ${
                    isCurrent ? "text-cyan-300" : "text-slate-200"
                  }`}
                >
                  {tier.tierName}
                </span>
                <span className="text-[8px] font-mono text-slate-400 mt-0.5">
                  {tier.levelRange}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Base Attributes & Perks Footer */}
      <div className="px-5 py-3.5 flex flex-col gap-2.5 bg-slate-900/40">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>CHARACTER SPECIAL PERKS</span>
          <button
            onClick={() => setIsEvolutionExpanded(!isEvolutionExpanded)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 transition"
          >
            {isEvolutionExpanded ? "Hide Details" : "Show Attributes"}
          </button>
        </div>

        {/* 2 Primary Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {character.perks.slice(0, 2).map((perk, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">{perk.text}</span>
            </div>
          ))}
        </div>

        {/* Expandable Attributes Breakdown */}
        {isEvolutionExpanded && (
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-2 animate-fade-in">
            {Object.entries(character.attributes).map(([attr, val]) => (
              <div
                key={attr}
                className="flex flex-col p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center"
              >
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  {attr}
                </span>
                <span className="text-sm font-mono font-bold text-cyan-300">
                  {val}
                </span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
