// src/components/CharacterSelectScreen.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  CharacterConfig,
  CHARACTERS_ROSTER,
  EVOLUTION_TIERS,
  getEvolutionTier,
} from "@/lib/charactersConfig";
import { sounds } from "@/lib/soundEffects";
import confetti from "canvas-confetti";
import {
  Coins,
  Sparkles,
  Lock,
  Check,
  Star,
  Shield,
  Zap,
  Flame,
  BookOpen,
  Heart,
  Swords,
  Target,
  Cpu,
  Wand2,
  Snowflake,
  Crown,
  Compass,
  Brain,
  Dumbbell,
  Palette,
  ChevronRight,
  ChevronLeft,
  User,
  Award,
} from "lucide-react";

interface CharacterSelectScreenProps {
  user: {
    id: string;
    username: string;
    level: number;
    gold: number;
    characterId?: string;
    unlockedCharacters?: string[];
  };
  onSelectCharacter: (characterId: string) => Promise<void>;
  onUnlockCharacter: (characterId: string) => Promise<void>;
  isProcessingId?: string | null;
}

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({
  user,
  onSelectCharacter,
  onUnlockCharacter,
  isProcessingId,
}) => {
  const [filter, setFilter] = useState<"ALL" | "BOY" | "GIRL" | "OWNED" | "AVAILABLE">("ALL");

  const unlockedList = useMemo(() => {
    return Array.from(
      new Set([
        "aarav",
        "ananya",
        ...(user.unlockedCharacters || []),
      ])
    );
  }, [user.unlockedCharacters]);

  const activeEquippedId = user.characterId || "aarav";

  // Current previewed character in the bottom details panel
  const [selectedCharId, setSelectedCharId] = useState<string>(activeEquippedId);

  const selectedChar = useMemo(() => {
    return (
      CHARACTERS_ROSTER.find((c) => c.id === selectedCharId) ||
      CHARACTERS_ROSTER[0]
    );
  }, [selectedCharId]);

  // Current user's evolution tier
  const currentTier = useMemo(() => getEvolutionTier(user.level), [user.level]);

  // Filtered roster
  const filteredRoster = useMemo(() => {
    return CHARACTERS_ROSTER.filter((char) => {
      const isOwned = unlockedList.includes(char.id);
      const canBuy = !isOwned && user.level >= char.requiredLevel;

      if (filter === "BOY") return char.gender === "BOY";
      if (filter === "GIRL") return char.gender === "GIRL";
      if (filter === "OWNED") return isOwned;
      if (filter === "AVAILABLE") return canBuy;
      return true;
    });
  }, [filter, unlockedList, user.level]);

  const handleCardClick = (char: CharacterConfig) => {
    sounds.playClick();
    setSelectedCharId(char.id);
  };

  const handleEquipClick = async (charId: string) => {
    try {
      sounds.playClick();
      await onSelectCharacter(charId);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecruitClick = async (char: CharacterConfig) => {
    try {
      sounds.playCoin();
      await onUnlockCharacter(char.id);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#f59e0b", "#ec4899", "#10b981"],
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Helper for Perk Icons
  const renderPerkIcon = (iconName: string) => {
    switch (iconName) {
      case "star":
        return <Star className="w-4 h-4 text-amber-400" />;
      case "coin":
        return <Coins className="w-4 h-4 text-amber-300" />;
      case "shield":
        return <Shield className="w-4 h-4 text-sky-400" />;
      case "zap":
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case "flame":
        return <Flame className="w-4 h-4 text-rose-400" />;
      case "crown":
        return <Crown className="w-4 h-4 text-amber-300" />;
      case "gift":
      case "sparkles":
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  // Helper for Element / Archetype icon
  const renderElementIcon = (icon: string) => {
    switch (icon) {
      case "Compass":
        return <Compass className="w-4 h-4" />;
      case "Wind":
        return <Zap className="w-4 h-4" />;
      case "BookOpen":
        return <BookOpen className="w-4 h-4" />;
      case "Sun":
        return <Crown className="w-4 h-4" />;
      case "Swords":
        return <Swords className="w-4 h-4" />;
      case "Target":
        return <Target className="w-4 h-4" />;
      case "Flame":
        return <Flame className="w-4 h-4" />;
      case "Cpu":
        return <Cpu className="w-4 h-4" />;
      case "ShieldAlert":
        return <Shield className="w-4 h-4" />;
      case "Wand2":
        return <Wand2 className="w-4 h-4" />;
      case "Heart":
        return <Heart className="w-4 h-4" />;
      case "Snowflake":
        return <Snowflake className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const isSelectedOwned = unlockedList.includes(selectedChar.id);
  const isSelectedEquipped = activeEquippedId === selectedChar.id;
  const isSelectedLevelLocked = user.level < selectedChar.requiredLevel;
  const canAffordSelected = user.gold >= selectedChar.coinCost;

  return (
    <div className="flex flex-col gap-8 pb-12 w-full animate-fade-in">
      {/* Title Header matching media_1789237253101.jpg */}
      <div className="text-center flex flex-col items-center justify-center gap-2 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          Aetheria Hero Roster • 20 Champions
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-indigo-100 to-purple-200 font-bold flex items-center justify-center gap-3">
          <span className="text-cyan-400">✦</span>
          Choose Your Character
          <span className="text-cyan-400">✦</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-xl font-sans">
          Every journey begins with a choice. Pick your avatar, unlock high-tier masters as you level up, and start your real-life adventure!
        </p>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
          {[
            { id: "ALL", label: "All (20)" },
            { id: "BOY", label: "Boys (10)" },
            { id: "GIRL", label: "Girls (10)" },
            { id: "OWNED", label: `Recruited (${unlockedList.length})` },
            { id: "AVAILABLE", label: "Available to Buy" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setFilter(tab.id as any);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
                filter === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md shadow-cyan-500/30 font-black"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Character Evolution Track matching media_1789236256803.jpg */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-slate-200 font-sans tracking-wide">
              Character Evolution Progression
            </span>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold">
            Current Tier: {currentTier.tierName} (Lv. {user.level})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {EVOLUTION_TIERS.map((tier, idx) => {
            const isCurrent = currentTier.tierName === tier.tierName;
            const isUnlockedTier = user.level >= tier.minLevel;

            return (
              <div
                key={tier.tierName}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition relative ${
                  isCurrent
                    ? "bg-cyan-950/40 border-cyan-400/80 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400"
                    : isUnlockedTier
                    ? "bg-slate-900/50 border-slate-700/60 text-slate-300"
                    : "bg-slate-950/40 border-slate-800/40 opacity-50 text-slate-500"
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-mono font-black uppercase tracking-wider shadow">
                    Active
                  </span>
                )}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-mono font-black text-xs ${
                    isCurrent
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400"
                      : isUnlockedTier
                      ? "bg-slate-800 text-slate-300"
                      : "bg-slate-900 text-slate-600"
                  }`}
                >
                  T{idx + 1}
                </div>
                <span className="text-xs font-bold text-slate-100 font-sans">
                  {tier.tierName}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {tier.levelRange}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Horizontal Cards Showcase matching media_1789237253101.jpg */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>SELECT HERO CARD ({filteredRoster.length} CHARACTERS DISPLAYED)</span>
          <span className="text-slate-500">Scroll horizontally or click to preview details</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-x-auto pb-3 pt-1">
          {filteredRoster.map((char) => {
            const isOwned = unlockedList.includes(char.id);
            const isEquipped = activeEquippedId === char.id;
            const isSelected = selectedCharId === char.id;
            const isLevelLocked = user.level < char.requiredLevel;

            return (
              <div
                key={char.id}
                onClick={() => handleCardClick(char)}
                className={`cursor-pointer group flex flex-col rounded-2xl p-3 border transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
                  isSelected
                    ? "bg-slate-850 border-cyan-400 shadow-xl shadow-cyan-500/25 ring-2 ring-cyan-400/50 scale-[1.02]"
                    : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                }`}
              >
                {/* Top Badges */}
                <div className="flex items-center justify-between w-full mb-2 z-10">
                  {isEquipped ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  ) : isSelected ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                      Previewing
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">
                      {char.gender}
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      isLevelLocked
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        : "bg-slate-800/80 text-slate-300 border border-slate-700/50"
                    }`}
                  >
                    {isLevelLocked ? <Lock className="w-2.5 h-2.5" /> : null}
                    Lv. {char.requiredLevel}
                  </span>
                </div>

                {/* Character Visual Artwork */}
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden relative mb-3 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-end p-2 border border-slate-800/80 group-hover:border-cyan-500/50 transition">
                  {/* Full-bleed Anime Illustration */}
                  <img
                    src={char.imageUrl}
                    alt={char.name}
                    className="absolute inset-0 w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  {/* Bottom gradient shadow for readable archetype tag */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none" />

                  {/* Element & Archetype tag */}
                  <div className="relative z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-[10px] font-mono text-slate-200 shadow-md">
                    {renderElementIcon(char.elementIcon)}
                    <span>{char.archetype}</span>
                  </div>

                  {/* Lock Overlay if Level Locked */}
                  {isLevelLocked && (
                    <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-1 p-2 text-center">
                      <div className="p-2 rounded-full bg-slate-900/90 border border-rose-500/40 text-rose-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-rose-300">
                        Unlocks at Lv. {char.requiredLevel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Title & Class */}
                <div className="flex flex-col gap-0.5 text-center mb-3">
                  <h3 className="font-serif text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition">
                    {char.name}
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400">
                    {char.classTag}
                  </span>
                  <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-1 font-serif">
                    &ldquo;{char.motto}&rdquo;
                  </p>
                </div>

                {/* Bottom Action / Status on Card */}
                <div className="mt-auto pt-2 border-t border-slate-800/80">
                  {isEquipped ? (
                    <div className="w-full py-1 text-center text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      ✓ Active Hero
                    </div>
                  ) : isOwned ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEquipClick(char.id);
                      }}
                      disabled={isProcessingId === char.id}
                      className="w-full py-1 text-center text-[11px] font-mono font-bold text-cyan-300 hover:text-white bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg border border-cyan-500/40 transition"
                    >
                      Equip Hero
                    </button>
                  ) : isLevelLocked ? (
                    <div className="w-full py-1 text-center text-[11px] font-mono font-bold text-slate-500 bg-slate-950/60 rounded-lg border border-slate-800">
                      🔒 Lv. {char.requiredLevel} Req
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecruitClick(char);
                      }}
                      disabled={isProcessingId === char.id || !canAffordSelected}
                      className="w-full py-1 flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg border border-amber-500/40 transition disabled:opacity-50"
                    >
                      <Coins className="w-3 h-3 text-amber-400" />
                      <span>{char.coinCost}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Character Deep Details Panel matching media_1789237253101.jpg */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/95 border border-cyan-500/30 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: selectedChar.accentColor }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Big Character Portrait Box */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="w-full max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden relative border-2 border-cyan-500/40 shadow-2xl bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-between p-4 group">
              {/* Full-bleed Anime Artwork */}
              <img
                src={selectedChar.imageUrl}
                alt={selectedChar.name}
                className="absolute inset-0 w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-slate-950/50 pointer-events-none" />

              {/* Top Details inside frame */}
              <div className="w-full flex items-center justify-between z-10">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-950/85 text-cyan-300 border border-cyan-500/40 backdrop-blur-md shadow-md">
                  {selectedChar.gender}
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-950/85 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-md">
                  Lv. {selectedChar.requiredLevel}
                </span>
              </div>

              {/* Bottom Character Info inside card */}
              <div className="w-full z-10 flex flex-col items-center text-center mt-auto">
                <div className="px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/70 w-full flex flex-col items-center shadow-xl">
                  <h4 className="font-serif text-lg font-black text-white tracking-wide">
                    {selectedChar.name}
                  </h4>
                  <p className="text-xs font-mono text-cyan-400 font-bold">
                    {selectedChar.classTag}
                  </p>
                  <span className="text-[11px] font-mono text-slate-300 mt-0.5">
                    Archetype: <strong className="text-cyan-200">{selectedChar.archetype}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Lore & Attributes */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-serif font-black text-white tracking-wide">
                  {selectedChar.classTag}
                </h2>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                  Lv. {selectedChar.requiredLevel}
                </span>
              </div>
              <p className="text-xs font-serif italic text-cyan-400/90 mb-3">
                &ldquo;{selectedChar.motto}&rdquo;
              </p>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                {selectedChar.lore}
              </p>
            </div>

            {/* Attributes Breakdown Bars matching media_1789237253101.jpg */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                ATTRIBUTES BREAKDOWN
              </span>

              {/* Intelligence */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Brain className="w-3.5 h-3.5 text-purple-400" /> Intelligence
                  </span>
                  <span className="text-purple-300 font-bold">{selectedChar.attributes.intelligence}</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${selectedChar.attributes.intelligence}%` }}
                  />
                </div>
              </div>

              {/* Strength */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Dumbbell className="w-3.5 h-3.5 text-rose-400" /> Strength
                  </span>
                  <span className="text-rose-300 font-bold">{selectedChar.attributes.strength}</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${selectedChar.attributes.strength}%` }}
                  />
                </div>
              </div>

              {/* Wisdom */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Wisdom
                  </span>
                  <span className="text-blue-300 font-bold">{selectedChar.attributes.wisdom}</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${selectedChar.attributes.wisdom}%` }}
                  />
                </div>
              </div>

              {/* Creativity */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Palette className="w-3.5 h-3.5 text-amber-400" /> Creativity
                  </span>
                  <span className="text-amber-300 font-bold">{selectedChar.attributes.creativity}</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${selectedChar.attributes.creativity}%` }}
                  />
                </div>
              </div>

              {/* Focus */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Target className="w-3.5 h-3.5 text-emerald-400" /> Focus
                  </span>
                  <span className="text-emerald-300 font-bold">{selectedChar.attributes.focus}</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${selectedChar.attributes.focus}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Starting Perks & Big Action Button */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  STARTING PERKS
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  PASSIVE TRAITS
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {selectedChar.perks.map((perk, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-sans text-slate-300"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      {renderPerkIcon(perk.icon)}
                    </div>
                    <span>{perk.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Primary Interactive Button */}
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
              {isSelectedEquipped ? (
                <div className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-mono font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
                  <Check className="w-5 h-5" />
                  Currently Equipped Hero
                </div>
              ) : isSelectedOwned ? (
                <button
                  onClick={() => handleEquipClick(selectedChar.id)}
                  disabled={isProcessingId === selectedChar.id}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-center font-mono font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <span>Select This Character</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : isSelectedLevelLocked ? (
                <div className="w-full py-3.5 px-6 rounded-2xl bg-slate-950 border border-rose-500/30 text-rose-400 text-center font-mono text-xs flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Lock className="w-4 h-4" />
                    Locked: Requires Player Level {selectedChar.requiredLevel}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Reach Level {selectedChar.requiredLevel} through tasks to unlock recruitment!
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleRecruitClick(selectedChar)}
                    disabled={isProcessingId === selectedChar.id || !canAffordSelected}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
                  >
                    <Coins className="w-4 h-4 text-slate-950" />
                    <span>Recruit for {selectedChar.coinCost} Coins</span>
                  </button>
                  {!canAffordSelected && (
                    <span className="text-[11px] font-mono text-amber-400 text-center">
                      Need {selectedChar.coinCost - user.gold} more coins to recruit
                    </span>
                  )}
                </div>
              )}

              {/* Script Cursive Watermark matching media_1789237253101.jpg */}
              <div className="text-right pt-2 font-serif italic text-slate-500 text-sm">
                Your story, your rules.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
