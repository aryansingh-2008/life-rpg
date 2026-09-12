"use client";

import React from "react";
import { History, CheckCircle2, Coins, Clock } from "lucide-react";

interface LogEntry {
  id: string;
  questTitle: string;
  action: string;
  xpGained: number;
  goldGained: number;
  attributeGained: string | null;
  createdAt: string;
}

interface ActivityLogsProps {
  logs: LogEntry[];
}

export const ActivityLogs: React.FC<ActivityLogsProps> = ({ logs }) => {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100 font-mono tracking-wide">
            HISTORICAL AUDIT CHRONICLES
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Database Ledger (Non-Fakable)
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 font-mono">
          No records in the chronicle ledger yet. Complete quests to write your legacy!
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
          {logs.map((log) => {
            const dateStr = new Date(log.createdAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">
                      {log.questTitle}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {dateStr}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {log.attributeGained && (
                    <span className="hidden sm:inline px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold">
                      +{log.attributeGained}
                    </span>
                  )}
                  <span className="font-bold text-cyan-400">
                    +{log.xpGained} XP
                  </span>
                  <span className="font-bold text-amber-400 flex items-center gap-0.5">
                    <Coins className="w-3 h-3" /> +{log.goldGained}g
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
