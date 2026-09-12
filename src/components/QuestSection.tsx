"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Dumbbell,
  Brain,
  Zap,
  Heart,
  Sparkles,
  Trash2,
  Layers,
  ChevronDown,
  X,
  Pencil,
} from "lucide-react";
import {
  ATTRIBUTES_CONFIG,
  DIFFICULTY_CONFIG,
  AttributeType,
  DifficultyType,
  QuestType,
} from "@/lib/rpgEngine";
import { sounds } from "@/lib/soundEffects";
import confetti from "canvas-confetti";

interface Quest {
  id: string;
  title: string;
  description: string | null;
  type: string;
  attribute: string;
  difficulty: string;
  xpReward: number;
  goldReward: number;
  completed: boolean;
  streak: number;
  dueDate: string | null;
}

interface QuestSectionProps {
  quests: Quest[];
  onCompleteQuest: (questId: string) => Promise<void>;
  onCreateQuest: (questData: {
    title: string;
    description?: string;
    type: QuestType;
    attribute: AttributeType;
    difficulty: DifficultyType;
  }) => Promise<void>;
  onUpdateQuest?: (
    questId: string,
    questData: {
      title: string;
      description?: string;
      type: QuestType;
      attribute: AttributeType;
      difficulty: DifficultyType;
    }
  ) => Promise<void>;
  onDeleteQuest: (questId: string) => Promise<void>;
  isProcessingId?: string | null;
}

export const QuestSection: React.FC<QuestSectionProps> = ({
  quests,
  onCompleteQuest,
  onCreateQuest,
  onUpdateQuest,
  onDeleteQuest,
  isProcessingId,
}) => {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [selectedAttribute, setSelectedAttribute] = useState<string>("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<QuestType>("DAILY");
  const [attribute, setAttribute] = useState<AttributeType>("INTELLECT");
  const [difficulty, setDifficulty] = useState<DifficultyType>("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const filteredQuests = quests.filter((q) => {
    if (activeTab !== "ALL" && q.type !== activeTab) return false;
    if (selectedAttribute !== "ALL" && q.attribute !== selectedAttribute) return false;
    return true;
  });

  const handleCheckboxClick = async (e: React.MouseEvent, q: Quest) => {
    e.stopPropagation();
    sounds.playQuestComplete();

    // Trigger local particle burst near clicked element
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { x, y },
      colors: ["#00f2ff", "#10b981", "#f59e0b"],
    });

    await onCompleteQuest(q.id);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Please provide a quest title");
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    try {
      sounds.playClick();
      await onCreateQuest({
        title,
        description,
        type,
        attribute,
        difficulty,
      });
      setTitle("");
      setDescription("");
      setIsCreateModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to create quest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (e: React.MouseEvent, q: Quest) => {
    e.stopPropagation();
    sounds.playClick();
    setEditingQuestId(q.id);
    setTitle(q.title);
    setDescription(q.description || "");
    setType(q.type as QuestType);
    setAttribute(q.attribute as AttributeType);
    setDifficulty(q.difficulty as DifficultyType);
    setFormError("");
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Please provide a quest title");
      return;
    }
    if (!editingQuestId || !onUpdateQuest) return;

    setIsSubmitting(true);
    setFormError("");
    try {
      sounds.playClick();
      await onUpdateQuest(editingQuestId, {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        attribute,
        difficulty,
      });
      setIsEditModalOpen(false);
      setEditingQuestId(null);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setFormError(err.message || "Failed to update quest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAttrIcon = (attrKey: string) => {
    switch (attrKey) {
      case "STRENGTH":
        return <Dumbbell className="w-3.5 h-3.5 text-rose-400" />;
      case "INTELLECT":
        return <Brain className="w-3.5 h-3.5 text-sky-400" />;
      case "AGILITY":
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case "VITALITY":
        return <Heart className="w-3.5 h-3.5 text-emerald-400" />;
      case "SPIRIT":
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const rewardPreview = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="flex flex-col gap-5">
      {/* Header with Filters and Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          {[
            { key: "ALL", label: "All Quests" },
            { key: "DAILY", label: "Dailies" },
            { key: "HABIT", label: "Habits" },
            { key: "BOUNTY", label: "Bounties" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.key);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                activeTab === tab.key
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Attribute Filter Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedAttribute}
              onChange={(e) => setSelectedAttribute(e.target.value)}
              className="w-full sm:w-36 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
            >
              <option value="ALL">All Attributes</option>
              <option value="STRENGTH">Strength ⚔️</option>
              <option value="INTELLECT">Intellect 🧠</option>
              <option value="AGILITY">Agility ⚡</option>
              <option value="VITALITY">Vitality 🌿</option>
              <option value="SPIRIT">Spirit 🔮</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>

          {/* New Quest Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>NEW QUEST</span>
          </button>
        </div>
      </div>

      {/* Quest Cards Grid */}
      <div className="flex flex-col gap-3">
        {filteredQuests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
            <Layers className="w-10 h-10 text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-300">No Quests in this Realm</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Add a new quest or adjust your filter to view your active objectives.
            </p>
          </div>
        ) : (
          filteredQuests.map((quest) => {
            const isProcessing = isProcessingId === quest.id;
            const diffConfig =
              DIFFICULTY_CONFIG[quest.difficulty as DifficultyType] ||
              DIFFICULTY_CONFIG.MEDIUM;
            const attrConfig =
              ATTRIBUTES_CONFIG[quest.attribute as AttributeType] ||
              ATTRIBUTES_CONFIG.INTELLECT;

            return (
              <div
                key={quest.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onCompleteQuest(quest.id);
                  }
                }}
                className={`group relative flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-cyan-400 ${
                  quest.completed
                    ? "bg-slate-950/40 border-slate-900 opacity-60"
                    : "bg-slate-900/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/80 shadow-lg"
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Complete Checkbox */}
                  <button
                    onClick={(e) => handleCheckboxClick(e, quest)}
                    disabled={isProcessing}
                    aria-label={`Mark quest ${quest.title} as ${quest.completed ? "incomplete" : "complete"}`}
                    className={`mt-0.5 p-1 rounded-lg transition-transform active:scale-90 ${
                      quest.completed
                        ? "text-emerald-400 hover:text-emerald-300"
                        : "text-slate-500 hover:text-cyan-400"
                    }`}
                  >
                    {quest.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  {/* Details */}
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {quest.type}
                      </span>
                      <span
                        className={`flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${attrConfig.bg} ${attrConfig.color}`}
                      >
                        {getAttrIcon(quest.attribute)}
                        {attrConfig.label}
                      </span>
                      <span
                        className={`text-[11px] font-mono font-bold ${diffConfig.color}`}
                      >
                        [{diffConfig.label}]
                      </span>
                      {quest.streak > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400">
                          <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          {quest.streak}d streak
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm font-semibold tracking-wide ${
                        quest.completed
                          ? "line-through text-slate-500"
                          : "text-slate-100"
                      }`}
                    >
                      {quest.title}
                    </h4>

                    {quest.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {quest.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rewards & Actions */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1 font-mono text-xs">
                    <span className="font-bold text-cyan-400">
                      +{quest.xpReward} XP
                    </span>
                    <span className="font-bold text-amber-400">
                      +{quest.goldReward} Coins
                    </span>
                  </div>

                  {onUpdateQuest && (
                    <button
                      onClick={(e) => handleStartEdit(e, quest)}
                      title="Edit quest"
                      aria-label="Edit quest"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onDeleteQuest(quest.id);
                    }}
                    title="Delete quest"
                    aria-label="Delete quest"
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create New Quest */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  FORGE NEW QUEST
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4 mt-4">
              {formError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  QUEST TITLE
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete 2 LeetCode Mediums or 5km Run"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  DESCRIPTION (OPTIONAL)
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes, links, or specific conditions for completion..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    TYPE
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as QuestType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="DAILY">Daily Ritual</option>
                    <option value="HABIT">Repeatable Habit</option>
                    <option value="BOUNTY">One-time Bounty</option>
                  </select>
                </div>

                {/* Attribute */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    ATTRIBUTE
                  </label>
                  <select
                    value={attribute}
                    onChange={(e) => setAttribute(e.target.value as AttributeType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="INTELLECT">Intellect 🧠</option>
                    <option value="STRENGTH">Strength ⚔️</option>
                    <option value="AGILITY">Agility ⚡</option>
                    <option value="VITALITY">Vitality 🌿</option>
                    <option value="SPIRIT">Spirit 🔮</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    DIFFICULTY
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="TRIVIAL">Trivial</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                    <option value="HEROIC">Heroic</option>
                  </select>
                </div>
              </div>

              {/* Reward Preview Card */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Guaranteed Loot:</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-cyan-400">
                    +{rewardPreview.xp} XP
                  </span>
                  <span className="font-bold text-amber-400">
                    +{rewardPreview.gold} {rewardPreview.gold === 1 ? "Coin" : "Coins"}
                  </span>
                  <span className="font-bold text-purple-400">
                    +1 {attribute}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold shadow-lg shadow-cyan-500/30 active:scale-95 transition"
                >
                  {isSubmitting ? "FORGING..." : "FORGE QUEST"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Quest */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  MODIFY QUEST
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingQuestId(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-4">
              {formError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
                  {formError}
                </div>
              )}

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-slate-400">Quest Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Read 20 pages of system architecture"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-sans"
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-slate-400">Quest Lore / Details (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Additional context or victory conditions..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              {/* Selects: Type, Attribute, Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-400">Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as QuestType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="DAILY">Daily Ritual</option>
                    <option value="HABIT">Repeating Habit</option>
                    <option value="BOUNTY">Heroic Bounty</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-400">Attribute</label>
                  <select
                    value={attribute}
                    onChange={(e) => setAttribute(e.target.value as AttributeType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="STRENGTH">Strength ⚔️</option>
                    <option value="INTELLECT">Intellect 🧠</option>
                    <option value="AGILITY">Agility ⚡</option>
                    <option value="VITALITY">Vitality 🌿</option>
                    <option value="SPIRIT">Spirit 🔮</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-400">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="TRIVIAL">Trivial</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                    <option value="HEROIC">Heroic</option>
                  </select>
                </div>
              </div>

              {/* Reward Preview Card */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/20 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Recalibrated Rewards:</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-cyan-400">
                    +{rewardPreview.xp} XP
                  </span>
                  <span className="font-bold text-amber-400">
                    +{rewardPreview.gold} {rewardPreview.gold === 1 ? "Coin" : "Coins"}
                  </span>
                  <span className="font-bold text-purple-400">
                    +1 {attribute}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingQuestId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-mono font-bold shadow-lg shadow-indigo-500/30 active:scale-95 transition"
                >
                  {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
