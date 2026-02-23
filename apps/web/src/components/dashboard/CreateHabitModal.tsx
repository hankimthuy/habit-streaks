"use client";

import { useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";

interface CreateHabitModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const ICON_OPTIONS = [
  "check_circle",
  "water_drop",
  "menu_book",
  "fitness_center",
  "self_improvement",
  "local_cafe",
  "terminal",
  "no_food",
  "bedtime",
  "directions_run",
  "restaurant",
  "smoke_free",
];

export default function CreateHabitModal({
  open,
  onClose,
  onCreated,
}: CreateHabitModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [icon, setIcon] = useState("check_circle");
  const [type, setType] = useState<"positive" | "negative">("positive");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Habit name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, icon, type, category }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create habit");
      }

      setTitle("");
      setSubtitle("");
      setIcon("check_circle");
      setType("positive");
      setCategory("");
      onCreated();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface-dark rounded-t-3xl p-6 pb-8 animate-slide-up">
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create New Habit</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <MaterialIcon name="close" className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("positive")}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                type === "positive"
                  ? "bg-accent-green/20 text-accent-green border border-accent-green/50"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              <MaterialIcon name="add_circle" className="text-base" />
              Do This
            </button>
            <button
              type="button"
              onClick={() => setType("negative")}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                type === "negative"
                  ? "bg-accent-red/20 text-accent-red border border-accent-red/50"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              <MaterialIcon name="do_not_disturb_on" className="text-base" />
              Avoid This
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Habit Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Drink 2L Water"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Description (optional)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Hydration goal"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Category (optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Health, Learning"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Icon picker */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    icon === ic
                      ? "bg-primary text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <MaterialIcon name={ic} className="text-xl" />
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-accent-red text-sm font-medium">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 rounded-2xl text-white font-bold text-base shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Habit"}
          </button>
        </form>
      </div>
    </div>
  );
}
