"use client";

import React, { useState, useEffect, useCallback } from "react";
import { HeaderNav } from "@/components/HeaderNav";
import { HeroShowcaseCard } from "@/components/HeroShowcaseCard";
import { AttributesRadar } from "@/components/AttributesRadar";
import { BossBattleArena } from "@/components/BossBattleArena";
import { QuestSection } from "@/components/QuestSection";
import { ShopArmory } from "@/components/ShopArmory";
import { ActivityLogs } from "@/components/ActivityLogs";
import { CharacterSelectScreen } from "@/components/CharacterSelectScreen";
import { LevelUpModal } from "@/components/LevelUpModal";
import { UserProfileModal } from "@/components/UserProfileModal";
import { AuthModal } from "@/components/AuthModal";
import { LandingPage } from "@/components/LandingPage";
import { AttributeType, DifficultyType, QuestType } from "@/lib/rpgEngine";
import { sounds } from "@/lib/soundEffects";
import { Loader2, Shield, X } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any | null>(null);
  const [quests, setQuests] = useState<any[]>([]);
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"QUESTS" | "CHARACTER" | "ARMORY" | "RADAR" | "LOGS">("QUESTS");

  // Profile modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Streak notification state
  const [streakNotice, setStreakNotice] = useState<string | null>(null);

  // Interactive feedback states
  const [isProcessingQuestId, setIsProcessingQuestId] = useState<string | null>(null);
  const [isProcessingShopId, setIsProcessingShopId] = useState<string | null>(null);
  const [isProcessingCharId, setIsProcessingCharId] = useState<string | null>(null);
  const [isAllocatingStat, setIsAllocatingStat] = useState(false);
  const [isAscending, setIsAscending] = useState(false);
  const [lastDamageDealt, setLastDamageDealt] = useState<number | undefined>(undefined);

  // Level Up Modal State
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean;
    newLevel: number;
    statPointsAwarded: number;
    goldCost?: number;
    title: string;
  }>({
    isOpen: false,
    newLevel: 1,
    statPointsAwarded: 0,
    goldCost: 0,
    title: "",
  });

  // Fetch all character data
  const refreshAll = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        setUser(null);
        setLoading(false);
        return;
      }
      const meData = await meRes.json();
      setUser(meData.user);
      if (meData.user?.streakNotification) {
        setStreakNotice(meData.user.streakNotification);
      }

      const [questsRes, shopRes, logsRes] = await Promise.all([
        fetch("/api/quests"),
        fetch("/api/shop"),
        fetch("/api/stats/logs"),
      ]);

      if (questsRes.ok) {
        const qData = await questsRes.json();
        setQuests(qData.quests);
      }
      if (shopRes.ok) {
        const sData = await shopRes.json();
        setShopItems(sData.items);
      }
      if (logsRes.ok) {
        const lData = await logsRes.json();
        setLogs(lData.logs);
      }
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    refreshAll();

    const handleOnline = () => {
      setIsOffline(false);
      refreshAll();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [refreshAll]);

  // Complete quest handler with authoritative backend progression
  const handleCompleteQuest = async (questId: string) => {
    setIsProcessingQuestId(questId);
    try {
      const res = await fetch(`/api/quests/${questId}/complete`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete quest");
      }

      // Update user state authoritatively
      setUser(data.user);
      if (data.user?.streakNotification) {
        setStreakNotice(data.user.streakNotification);
      }

      // Check if user leveled up
      if (data.progression && data.progression.didLevelUp) {
        setLevelUpData({
          isOpen: true,
          newLevel: data.progression.newLevel,
          statPointsAwarded: data.progression.statPointsAwarded,
          goldCost: data.progression.goldCost,
          title: data.user.title,
        });
      }

      // Trigger Boss Hit effect if damage was dealt
      if (data.boss && data.boss.bossDamageDealt > 0) {
        setLastDamageDealt(data.boss.bossDamageDealt);
        sounds.playBossHit();
      }

      // Refresh quests and logs
      const [questsRes, logsRes] = await Promise.all([
        fetch("/api/quests"),
        fetch("/api/stats/logs"),
      ]);
      if (questsRes.ok) {
        const qData = await questsRes.json();
        setQuests(qData.quests);
      }
      if (logsRes.ok) {
        const lData = await logsRes.json();
        setLogs(lData.logs);
      }
    } catch (err: any) {
      console.error("Quest completion error:", err);
    } finally {
      setIsProcessingQuestId(null);
    }
  };

  // Create quest handler
  const handleCreateQuest = async (questData: {
    title: string;
    description?: string;
    type: QuestType;
    attribute: AttributeType;
    difficulty: DifficultyType;
  }) => {
    const res = await fetch("/api/quests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create quest");

    setQuests((prev) => [data.quest, ...prev]);
  };

  // Update quest handler
  const handleUpdateQuest = async (
    questId: string,
    questData: {
      title: string;
      description?: string;
      type: QuestType;
      attribute: AttributeType;
      difficulty: DifficultyType;
    }
  ) => {
    const res = await fetch(`/api/quests/${questId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update quest");

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? data.quest : q))
    );
  };

  // Delete quest handler
  const handleDeleteQuest = async (questId: string) => {
    const res = await fetch(`/api/quests/${questId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete quest");

    setQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  // Purchase shop item handler
  const handlePurchaseItem = async (itemId: string) => {
    setIsProcessingShopId(itemId);
    try {
      const res = await fetch("/api/shop/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Purchase failed");

      sounds.playCoin();
      refreshAll();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessingShopId(null);
    }
  };

  // Equip / Unequip gear handler
  const handleEquipItem = async (itemId: string) => {
    setIsProcessingShopId(itemId);
    try {
      const res = await fetch("/api/inventory/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Equip failed");

      sounds.playClick();
      refreshAll();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessingShopId(null);
    }
  };

  // Allocate stat points
  const handleAllocateStat = async (attribute: AttributeType) => {
    setIsAllocatingStat(true);
    try {
      const res = await fetch("/api/stats/allocate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attribute }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Allocation failed");

      setUser(data.user);
      sounds.playQuestComplete();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAllocatingStat(false);
    }
  };

  // Recruit / Unlock character handler
  const handleUnlockCharacter = async (characterId: string) => {
    setIsProcessingCharId(characterId);
    try {
      const res = await fetch("/api/character/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to recruit character");

      setUser(data.user);
      refreshAll();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessingCharId(null);
    }
  };

  // Select / Equip character handler
  const handleSelectCharacter = async (characterId: string) => {
    setIsProcessingCharId(characterId);
    try {
      const res = await fetch("/api/character/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to equip character");

      setUser(data.user);
      refreshAll();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessingCharId(null);
    }
  };

  // Manual Rank Ascension handler
  const handleAscend = async () => {
    setIsAscending(true);
    try {
      const res = await fetch("/api/player/ascend", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ascension failed");

      setUser(data.user);
      setLevelUpData({
        isOpen: true,
        newLevel: data.progression.newLevel,
        statPointsAwarded: data.progression.statPointsAwarded,
        goldCost: data.progression.goldCost,
        title: data.progression.title,
      });
      sounds.playLevelUp();
      refreshAll();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAscending(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="font-mono text-xs tracking-widest uppercase">
            Communing with Aetheria Realm...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLoginSuccess={(newUser) => { setUser(newUser); refreshAll(); }} />;
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-950 pb-16">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 text-center text-xs font-mono font-bold text-amber-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>NETWORK DISCONNECTED: You are currently offline. Local state is preserved; syncing will resume when connection restores.</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <HeaderNav
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        onAscend={handleAscend}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isAscending={isAscending}
      />

      {/* Streak Protection & Milestone Banner */}
      {streakNotice && (
        <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border-b border-indigo-500/30 px-4 py-2.5 shadow-md shadow-indigo-950/40 animate-fadeIn">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-indigo-200">
              <Shield className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
              <span>{streakNotice}</span>
            </div>
            <button
              onClick={() => setStreakNotice(null)}
              className="text-slate-400 hover:text-white text-xs font-mono px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition flex items-center gap-1 shrink-0"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
              <span>Dismiss</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 pt-6 flex flex-col gap-6">
        {/* Top Hero Grid: 3D Hero Avatar + Boss Battle Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Hero Showcase Card (Rich 2D Character Artwork & Evolution Path) */}
          <div className="lg:col-span-5 w-full">
            <HeroShowcaseCard
              level={user.level}
              characterId={user.characterId}
              equippedItems={user.inventory?.filter((inv: any) => inv.isEquipped)}
              onSwitchCharacter={() => setActiveTab("CHARACTER")}
            />
          </div>

          {/* Right Column: Active Boss Raid Arena + Quick Attributes Radar */}
          <div className="lg:col-span-7 flex flex-col gap-6 w-full">
            <BossBattleArena
              bossState={user.bossState}
              lastDamageDealt={lastDamageDealt}
            />

            <AttributesRadar
              stats={{
                strength: user.strength,
                intellect: user.intellect,
                agility: user.agility,
                vitality: user.vitality,
                spirit: user.spirit,
              }}
              unspentPoints={user.unspentPoints}
              onAllocate={handleAllocateStat}
              isAllocating={isAllocatingStat}
            />
          </div>
        </div>

        {/* Tab Sections */}
        <div className="mt-4">
          {activeTab === "QUESTS" && (
            <QuestSection
              quests={quests}
              onCompleteQuest={handleCompleteQuest}
              onCreateQuest={handleCreateQuest}
              onUpdateQuest={handleUpdateQuest}
              onDeleteQuest={handleDeleteQuest}
              isProcessingId={isProcessingQuestId}
            />
          )}

          {activeTab === "CHARACTER" && (
            <CharacterSelectScreen
              user={user}
              onSelectCharacter={handleSelectCharacter}
              onUnlockCharacter={handleUnlockCharacter}
              isProcessingId={isProcessingCharId}
            />
          )}

          {activeTab === "ARMORY" && (
            <ShopArmory
              items={shopItems}
              userGold={user.gold}
              onPurchase={handlePurchaseItem}
              onEquip={handleEquipItem}
              isProcessingId={isProcessingShopId}
            />
          )}

          {activeTab === "RADAR" && (
            <div className="flex flex-col gap-6">
              <AttributesRadar
                stats={{
                  strength: user.strength,
                  intellect: user.intellect,
                  agility: user.agility,
                  vitality: user.vitality,
                  spirit: user.spirit,
                }}
                unspentPoints={user.unspentPoints}
                onAllocate={handleAllocateStat}
                isAllocating={isAllocatingStat}
              />
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400 leading-relaxed">
                <h4 className="text-sm font-bold text-slate-200 mb-2">
                  THE SOVEREIGN ATTRIBUTE MATRIX
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-rose-400">Strength:</strong> Raised via workouts, gym sessions, posture adjustments. Increases boss damage multiplier.</li>
                  <li><strong className="text-sky-400">Intellect:</strong> Raised via coding, study, reading, research. Enhances XP gains.</li>
                  <li><strong className="text-amber-400">Agility:</strong> Raised via quick chores, inbox zero, speed habits. Accelerates streak bonuses.</li>
                  <li><strong className="text-emerald-400">Vitality:</strong> Raised via hydration, 8h sleep, nutrition. Expands maximum HP reservoir.</li>
                  <li><strong className="text-purple-400">Spirit:</strong> Raised via meditation, journaling, screen detox. Expands focus and resilience.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "LOGS" && <ActivityLogs logs={logs} />}
        </div>
      </div>

      {/* Level Up Celebratory Modal */}
      <LevelUpModal
        isOpen={levelUpData.isOpen}
        newLevel={levelUpData.newLevel}
        statPointsAwarded={levelUpData.statPointsAwarded}
        goldCost={levelUpData.goldCost}
        title={levelUpData.title}
        onClose={() => setLevelUpData((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* User Profile & Adventurer Guild License Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onProfileUpdated={(updatedUser) => {
          setUser((prev: any) => ({ ...prev, ...updatedUser }));
        }}
      />
    </main>
  );
}
