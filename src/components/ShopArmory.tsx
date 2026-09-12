"use client";

import React, { useState } from "react";
import {
  Coins,
  Shield,
  Sword,
  Wind,
  Crown,
  HeartPulse,
  Flame,
  Check,
  Zap,
} from "lucide-react";
import { sounds } from "@/lib/soundEffects";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  rarity: string;
  statBonusType: string | null;
  statBonusValue: number;
  visualKey: string;
  icon: string;
  owned?: boolean;
  isEquipped?: boolean;
}

interface ShopArmoryProps {
  items: ShopItem[];
  userGold: number;
  onPurchase: (itemId: string) => Promise<void>;
  onEquip: (itemId: string) => Promise<void>;
  isProcessingId?: string | null;
}

export const ShopArmory: React.FC<ShopArmoryProps> = ({
  items,
  userGold,
  onPurchase,
  onEquip,
  isProcessingId,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = [
    { key: "ALL", label: "All Relics" },
    { key: "WEAPON", label: "Weapons" },
    { key: "SHIELD", label: "Shields" },
    { key: "WINGS", label: "Wings" },
    { key: "HELMET", label: "Helms" },
    { key: "POTION", label: "Potions" },
    { key: "BADGE", label: "Runes" },
  ];

  const filteredItems = items.filter((item) => {
    if (activeCategory === "ALL") return true;
    return item.category === activeCategory;
  });

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "LEGENDARY":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10";
      case "EPIC":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-500/10";
      case "RARE":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "WEAPON":
        return <Sword className="w-4 h-4 text-amber-400" />;
      case "SHIELD":
        return <Shield className="w-4 h-4 text-cyan-400" />;
      case "WINGS":
        return <Wind className="w-4 h-4 text-purple-400" />;
      case "HELMET":
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case "POTION":
        return <HeartPulse className="w-4 h-4 text-emerald-400" />;
      default:
        return <Flame className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              sounds.playClick();
              setActiveCategory(cat.key);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeCategory === cat.key
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isProcessing = isProcessingId === item.id;
          const canAfford = userGold >= item.cost;

          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between p-4 rounded-2xl bg-slate-900/60 border transition-all duration-200 ${
                item.isEquipped
                  ? "border-cyan-500/80 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50"
                  : "border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border shadow-sm ${getRarityBadge(
                      item.rarity
                    )}`}
                  >
                    {item.rarity}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                  {item.description}
                </p>

                {item.statBonusType && (
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      +{item.statBonusValue} {item.statBonusType}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono text-sm font-black text-amber-400">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{item.cost}g</span>
                </div>

                {item.owned ? (
                  item.category === "POTION" ? (
                    <button
                      onClick={() => {
                        sounds.playCoin();
                        onPurchase(item.id);
                      }}
                      disabled={isProcessing || !canAfford}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition disabled:opacity-50"
                    >
                      Use Elixir
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onEquip(item.id);
                      }}
                      disabled={isProcessing}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1 transition ${
                        item.isEquipped
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                      }`}
                    >
                      {item.isEquipped && <Check className="w-3.5 h-3.5" />}
                      <span>{item.isEquipped ? "EQUIPPED" : "EQUIP"}</span>
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => {
                      sounds.playCoin();
                      onPurchase(item.id);
                    }}
                    disabled={isProcessing || !canAfford}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition shadow-md ${
                      canAfford
                        ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                    }`}
                  >
                    {canAfford ? "PURCHASE" : "INSUFFICIENT GOLD"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
