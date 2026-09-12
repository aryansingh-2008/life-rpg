"use client";

import React from "react";
import { Dumbbell, Brain, Zap, Heart, Sparkles, Plus } from "lucide-react";
import { ATTRIBUTES_CONFIG, AttributeType } from "@/lib/rpgEngine";
import { sounds } from "@/lib/soundEffects";

interface AttributesRadarProps {
  stats: {
    strength: number;
    intellect: number;
    agility: number;
    vitality: number;
    spirit: number;
  };
  unspentPoints: number;
  onAllocate?: (attribute: AttributeType) => Promise<void>;
  isAllocating?: boolean;
}

export const AttributesRadar: React.FC<AttributesRadarProps> = ({
  stats,
  unspentPoints,
  onAllocate,
  isAllocating = false,
}) => {
  const statList: { key: AttributeType; value: number; max: number; icon: any }[] = [
    { key: "STRENGTH", value: stats.strength, max: 50, icon: Dumbbell },
    { key: "INTELLECT", value: stats.intellect, max: 50, icon: Brain },
    { key: "AGILITY", value: stats.agility, max: 50, icon: Zap },
    { key: "VITALITY", value: stats.vitality, max: 50, icon: Heart },
    { key: "SPIRIT", value: stats.spirit, max: 50, icon: Sparkles },
  ];

  // Radar Polygon math (5 vertices pentagon)
  const size = 200;
  const center = size / 2;
  const radius = size * 0.38;

  const points = statList.map((stat, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const normalized = Math.min(1, Math.max(0.2, stat.value / 40));
    const r = radius * normalized;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  });

  const polygonPoints = points.join(" ");

  // Grid background pentagons
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const handleStatClick = (key: AttributeType) => {
    if (unspentPoints > 0 && onAllocate && !isAllocating) {
      sounds.playClick();
      onAllocate(key);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-slate-900/70 border border-slate-800 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100 tracking-wide">
            CHARACTER ATTRIBUTES
          </h3>
        </div>
        {unspentPoints > 0 && (
          <span className="px-2.5 py-1 text-xs font-bold font-mono rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
            +{unspentPoints} STAT POINTS AVAILABLE
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Radar SVG Diagram */}
        <div className="relative flex justify-center items-center">
          <svg width={size} height={size} className="overflow-visible">
            {/* Grid Pentagons */}
            {gridLevels.map((lvl, idx) => {
              const pts = [0, 1, 2, 3, 4]
                .map((i) => {
                  const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                  const r = radius * lvl;
                  return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                })
                .join(" ");
              return (
                <polygon
                  key={idx}
                  points={pts}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              );
            })}

            {/* Axis lines */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={center + radius * Math.cos(angle)}
                  y2={center + radius * Math.sin(angle)}
                  stroke="#334155"
                  strokeWidth="1"
                />
              );
            })}

            {/* Filled Polygon representing user attributes */}
            <polygon
              points={polygonPoints}
              fill="rgba(6, 182, 212, 0.25)"
              stroke="#06b6d4"
              strokeWidth="2"
              className="transition-all duration-500 ease-out"
            />

            {/* Vertex points */}
            {statList.map((stat, i) => {
              const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
              const normalized = Math.min(1, Math.max(0.2, stat.value / 40));
              const r = radius * normalized;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#00f5ff"
                  className="animate-pulse"
                />
              );
            })}
          </svg>
        </div>

        {/* Attribute Progression Bars and Allocation Buttons */}
        <div className="flex flex-col gap-2.5">
          {statList.map(({ key, value, icon: Icon }) => {
            const config = ATTRIBUTES_CONFIG[key];
            const canBoost = unspentPoints > 0 && !isAllocating;

            return (
              <div
                key={key}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-2.5 min-w-[110px]">
                  <div className={`p-1.5 rounded-lg ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-200">
                      {config.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Level {value}
                    </span>
                  </div>
                </div>

                <div className="flex-1 mx-3">
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (value / 40) * 100)}%` }}
                    />
                  </div>
                </div>

                {canBoost ? (
                  <button
                    onClick={() => handleStatClick(key)}
                    disabled={isAllocating}
                    title={`Allocate +1 to ${config.label}`}
                    className="p-1 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold font-mono flex items-center gap-1 active:scale-95 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>UP</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-300 w-8 text-right">
                    {value}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
