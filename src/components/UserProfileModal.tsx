// src/components/UserProfileModal.tsx
"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Shield,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  Mail,
  Edit3,
  Save,
  Swords,
  Coins,
} from "lucide-react";
import { getCharacterById } from "@/lib/charactersConfig";
import { sounds } from "@/lib/soundEffects";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    username: string;
    email: string;
    level: number;
    xp: number;
    nextLevelXp: number;
    gold: number;
    streak: number;
    streakShields?: number;
    title: string;
    characterId?: string;
    createdAt?: string | Date;
    totalCompletedQuests?: number;
    strength?: number;
    intellect?: number;
    agility?: number;
    vitality?: number;
    spirit?: number;
  };
  onProfileUpdated: (updatedUser: any) => void;
}

const PRESET_TITLES = [
  "Aether Initiate",
  "Shadow Sovereign",
  "Master of Discipline",
  "Procrastination Slayer",
  "Apex Focus Knight",
  "Code Sorcerer",
  "Iron Will Champion",
  "Celestial Vanguard",
  "Grandmaster of Habit",
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
}) => {
  const [username, setUsername] = useState(user.username);
  const [title, setTitle] = useState(user.title);
  const [isCustomTitle, setIsCustomTitle] = useState(
    !PRESET_TITLES.includes(user.title)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const activeHero = getCharacterById(user.characterId || "aarav");

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Realm Genesis";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg("Character name cannot be empty.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/player/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          title: title.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      sounds.playLevelUp();
      setSuccessMsg("Hero identity successfully updated!");
      onProfileUpdated(data.user);

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 md:p-8 shadow-2xl shadow-cyan-950/60 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-cyan-500/15 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-mono tracking-wider">
                ADVENTURER LICENSE & HERO PROFILE
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Official Sovereign Dossier • Aetheria Guild Registry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-start">
          {/* Left: Holographic ID Card */}
          <div className="md:col-span-5 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col items-center text-center relative overflow-hidden shadow-lg">
            {/* Card Holographic Badge */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-800/80 pb-2 mb-3">
              <span className="text-cyan-400 font-bold">GUILD ID CARD</span>
              <span>#AETH-{user.id.slice(-6).toUpperCase()}</span>
            </div>

            {/* Character Artwork */}
            <div className="relative w-28 h-36 rounded-xl overflow-hidden border border-cyan-500/40 shadow-md shadow-cyan-500/20 mb-3 bg-slate-900">
              <img
                src={activeHero.imageUrl}
                alt={activeHero.name}
                className="w-full h-full object-cover object-[center_20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-1 inset-x-0 text-[10px] font-mono font-bold text-cyan-300">
                {activeHero.name}
              </div>
            </div>

            <h4 className="text-sm font-black text-white font-mono">{user.username}</h4>
            <span className="text-xs font-mono text-cyan-400 font-bold mt-0.5">
              {user.title}
            </span>

            <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-left">
              <div className="flex flex-col">
                <span className="text-slate-500">Guild Rank</span>
                <span className="text-slate-200 font-bold">Level {user.level}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500">Class</span>
                <span className="text-indigo-300 font-bold">{activeHero.classTag}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500">Streak Status</span>
                <span className="text-amber-400 font-bold">{user.streak}d Streak</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500">Streak Shields</span>
                <span className="text-indigo-400 font-bold">
                  🛡️ {user.streakShields ?? 0}/2 Active
                </span>
              </div>
            </div>

            <div className="w-full mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Awakened {formattedDate}</span>
              </span>
              <span className="text-emerald-400 font-bold">VERIFIED</span>
            </div>
          </div>

          {/* Right: Editable Hero Identity Form */}
          <form onSubmit={handleSave} className="md:col-span-7 flex flex-col gap-4">
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hero Character Name *</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter character / hero name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                required
                maxLength={32}
              />
              <span className="text-[10px] font-mono text-slate-500">
                This is your public adventurer name visible in rankings, combat logs, and hero cards.
              </span>
            </div>

            {/* Title Selection */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Player Honor Title</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomTitle(!isCustomTitle)}
                  className="text-[11px] font-mono text-cyan-400 hover:underline"
                >
                  {isCustomTitle ? "Choose Preset" : "Enter Custom"}
                </button>
              </div>

              {isCustomTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master of Consistency"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  maxLength={36}
                />
              ) : (
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {PRESET_TITLES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Registered Account Credentials (Read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Bound Account Email</span>
              </label>
              <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>{user.email}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                  Cloud Synced
                </span>
              </div>
            </div>

            {/* Combat Stats Tally */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-around text-center text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">COINS</span>
                <span className="text-amber-400 font-bold flex items-center justify-center gap-1 mt-0.5">
                  <Coins className="w-3.5 h-3.5" />
                  {user.gold}
                </span>
              </div>
              <div className="border-r border-slate-800 h-6" />
              <div>
                <span className="text-slate-500 block text-[10px]">TOTAL XP</span>
                <span className="text-cyan-400 font-bold flex items-center justify-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {user.xp}
                </span>
              </div>
              <div className="border-r border-slate-800 h-6" />
              <div>
                <span className="text-slate-500 block text-[10px]">STREAK</span>
                <span className="text-amber-400 font-bold flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  {user.streak}d
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "UPDATING IDENTITY..." : "SAVE HERO IDENTITY"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
