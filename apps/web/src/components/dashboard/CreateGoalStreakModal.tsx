"use client";

import { useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";

interface CreateGoalStreakModalProps {
  open: boolean;
  mode: "daily" | "free";
  onClose: () => void;
  onCreated: () => void;
}

const ICON_OPTIONS = [
  "local_fire_department",
  "fitness_center",
  "menu_book",
  "water_drop",
  "self_improvement",
  "directions_run",
  "terminal",
  "bedtime",
  "restaurant",
  "check_circle",
  "star",
  "emoji_events",
];

const COLOR_OPTIONS = [
  { key: "primary", label: "Orange", className: "bg-primary" },
  { key: "blue", label: "Blue", className: "bg-blue-500" },
  { key: "green", label: "Green", className: "bg-accent-green" },
  { key: "red", label: "Red", className: "bg-accent-red" },
  { key: "amber", label: "Amber", className: "bg-amber-500" },
];

export default function CreateGoalStreakModal({
  open,
  mode,
  onClose,
  onCreated,
}: CreateGoalStreakModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [icon, setIcon] = useState("local_fire_department");
  const [color, setColor] = useState("primary");
  const [rewardTitle, setRewardTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Daily mode fields
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Free mode fields
  const [targetDays, setTargetDays] = useState(7);

  if (!open) return null;

  const computedTargetDays =
    mode === "daily" && startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : targetDays;

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setIcon("local_fire_department");
    setColor("primary");
    setRewardTitle("");
    setStartDate("");
    setEndDate("");
    setTargetDays(7);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Name is required");
      return;
    }
    if (mode === "daily" && (!startDate || !endDate)) {
      setError("Start date and end date are required");
      return;
    }
    if (mode === "daily" && endDate < startDate) {
      setError("End date must be after start date");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/goal-streaks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          icon,
          color,
          target_days: computedTargetDays,
          reward_title: rewardTitle || null,
          start_date: mode === "daily" ? startDate : null,
          end_date: mode === "daily" ? endDate : null,
          mode,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create streak");
      }

      resetForm();
      onCreated();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const isDaily = mode === "daily";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface-dark rounded-t-3xl p-6 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <MaterialIcon name="arrow_back" className="text-lg" />
            </button>
            <h2 className="text-xl font-bold text-white">
              {isDaily ? "Daily Streak" : "Free Check-in"}
            </h2>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isDaily
                ? "bg-primary/20 text-primary"
                : "bg-amber-500/20 text-amber-500"
            }`}
          >
            {isDaily ? "Daily" : "Free"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Streak Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isDaily
                  ? "e.g. 30-Day Reading Challenge"
                  : "e.g. Complete 10 Side Projects"
              }
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
              placeholder="e.g. Read at least 30 minutes"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Date range for daily mode */}
          {isDaily && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || undefined}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                />
              </div>
            </div>
          )}

          {/* Computed target info for daily / manual target for free */}
          {isDaily && startDate && endDate && endDate >= startDate && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-2xl px-4 py-3">
              <MaterialIcon name="calendar_month" className="text-primary" />
              <span className="text-sm text-primary font-bold">
                {computedTargetDays} days
              </span>
              <span className="text-xs text-slate-400">to complete</span>
            </div>
          )}

          {!isDaily && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Target Count
              </label>
              <input
                type="number"
                min={1}
                value={targetDays}
                onChange={(e) =>
                  setTargetDays(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          )}

          {/* Reward */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Reward (optional)
            </label>
            <input
              type="text"
              value={rewardTitle}
              onChange={(e) => setRewardTitle(e.target.value)}
              placeholder="e.g. Buy a new book"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Color
            </label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setColor(c.key)}
                  className={`w-10 h-10 rounded-xl ${c.className} flex items-center justify-center transition-all ${
                    color === c.key
                      ? "ring-2 ring-white ring-offset-2 ring-offset-surface-dark scale-110"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {color === c.key && (
                    <MaterialIcon name="check" className="text-white text-lg" />
                  )}
                </button>
              ))}
            </div>
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
            {loading ? "Creating..." : "Create Streak"}
          </button>
        </form>
      </div>
    </div>
  );
}
