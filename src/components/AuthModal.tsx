"use client";

import React, { useState } from "react";
import { Sparkles, User, Lock, Mail, ArrowRight, Zap, Play } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

interface AuthModalProps {
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    sounds.playClick();
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo login failed");
      sounds.playQuestComplete();
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || "Failed to initialize demo character");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    sounds.playClick();

    try {
      const url = mode === "LOGIN" ? "/api/auth/login" : "/api/auth/signup";
      const payload =
        mode === "LOGIN"
          ? { identifier, password }
          : { username, email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      sounds.playQuestComplete();
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-950/50">
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black font-mono text-white tracking-wider">
              AETHERIA // LIFE RPG
            </h2>
            <p className="text-xs text-slate-400 max-w-xs">
              Turn mundane real-world tasks into tangible virtual progression, 3D gear, and epic boss battles.
            </p>
          </div>

          {/* 1-Click Instant Guest Demo Button */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900 border border-cyan-500/40">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> INSTANT GUEST PASS
              </span>
              <span className="text-slate-400">Zero-Setup</span>
            </div>
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>ENTER WITH INSTANT DEMO CHARACTER</span>
            </button>
          </div>

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] font-mono text-slate-500">OR AUTHENTICATE</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold">
            <button
              onClick={() => {
                sounds.playClick();
                setMode("LOGIN");
                setError("");
              }}
              className={`py-2 rounded-lg transition ${
                mode === "LOGIN"
                  ? "bg-slate-800 text-cyan-300"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setMode("SIGNUP");
                setError("");
              }}
              className={`py-2 rounded-lg transition ${
                mode === "SIGNUP"
                  ? "bg-slate-800 text-cyan-300"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Hero
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {mode === "SIGNUP" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-slate-400">HERO USERNAME</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="CyberKnight_99"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-slate-400">
                {mode === "SIGNUP" ? "EMAIL ADDRESS" : "EMAIL OR USERNAME"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={mode === "SIGNUP" ? "email" : "text"}
                  required
                  placeholder={mode === "SIGNUP" ? "hero@aetheria.rpg" : "hero@aetheria.rpg or username"}
                  value={mode === "SIGNUP" ? email : identifier}
                  onChange={(e) =>
                    mode === "SIGNUP"
                      ? setEmail(e.target.value)
                      : setIdentifier(e.target.value)
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-slate-400">PASSWORD</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition disabled:opacity-50"
            >
              <span>{loading ? "COMMUNING WITH REALM..." : mode === "LOGIN" ? "ENTER REALM" : "FORGE HERO"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
