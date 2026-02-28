"use client";

import { useState, useEffect, useCallback } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { vnToday } from "@/lib/date-utils";

interface DoDontRule {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  last_checkin_date: string | null;
  end_date: string | null;
  current_streak: number;
}

const COLOR_MAP: Record<string, { iconBg: string; dot: string }> = {
  primary: { iconBg: "bg-primary/20 text-primary", dot: "bg-primary" },
  blue: { iconBg: "bg-blue-500/20 text-blue-500", dot: "bg-blue-500" },
  green: { iconBg: "bg-accent-green/20 text-accent-green", dot: "bg-accent-green" },
  red: { iconBg: "bg-accent-red/20 text-accent-red", dot: "bg-accent-red" },
  amber: { iconBg: "bg-amber-500/20 text-amber-500", dot: "bg-amber-500" },
};

export default function DoDontTracker() {
  const [rules, setRules] = useState<DoDontRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const today = vnToday();

  const fetchRules = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard?date=${today}`);
      if (res.ok) {
        const data = await res.json();
        setRules(data.doDonts ?? []);
      }
    } catch {
      // non-critical
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleToggle = async (ruleId: string, checkedToday: boolean) => {
    if (loadingIds.has(ruleId)) return;
    setLoadingIds((prev) => new Set(prev).add(ruleId));
    try {
      const action = checkedToday ? "decrement" : "increment";
      await fetch(`/api/goal-streaks/${ruleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, date: today }),
      });
      await fetchRules();
    } finally {
      setLoadingIds((prev) => {
        const s = new Set(prev);
        s.delete(ruleId);
        return s;
      });
    }
  };

  if (loading) return null;

  if (rules.length === 0) {
    return (
      <section className="bg-surface-dark p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">
          Do&apos;s &amp; Don&apos;ts Tracker
        </h2>
        <p className="text-slate-600 text-sm text-center py-4">
          No rules yet. Add one from the home screen.
        </p>
      </section>
    );
  }

  const followed = rules.filter((r) => r.last_checkin_date === today).length;
  const broken = rules.length - followed;

  return (
    <section className="bg-surface-dark p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest">
          Do&apos;s &amp; Don&apos;ts Tracker
        </h2>
        <span className="text-xs font-bold text-slate-500">Today</span>
      </div>

      {/* Scoreboard */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 bg-accent-green/10 border border-accent-green/20 rounded-2xl px-4 py-2 flex items-center gap-2">
          <MaterialIcon name="check_circle" className="text-accent-green text-base" />
          <div>
            <p className="text-xs text-slate-500 font-medium">Followed</p>
            <p className="text-lg font-black text-accent-green">{followed}</p>
          </div>
        </div>
        <div className="flex-1 bg-accent-red/10 border border-accent-red/20 rounded-2xl px-4 py-2 flex items-center gap-2">
          <MaterialIcon name="cancel" className="text-accent-red text-base" />
          <div>
            <p className="text-xs text-slate-500 font-medium">Broken</p>
            <p className="text-lg font-black text-accent-red">{broken}</p>
          </div>
        </div>
      </div>

      {/* Rule List */}
      <div className="flex flex-col gap-3">
        {rules.map((rule) => {
          const checkedToday = rule.last_checkin_date === today;
          const colors = COLOR_MAP[rule.color] ?? COLOR_MAP.primary;
          const isLoading = loadingIds.has(rule.id);

          return (
            <div
              key={rule.id}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${checkedToday
                  ? "bg-accent-green/5 border-accent-green/20"
                  : "bg-slate-800/60 border-slate-700/50"
                }`}
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.iconBg}`}
              >
                <MaterialIcon name={rule.icon} className="text-lg" />
              </div>

              {/* Name & streak */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-bold text-sm ${checkedToday ? "text-accent-green" : "text-white"
                    }`}
                >
                  {rule.title}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MaterialIcon name="local_fire_department" className="text-xs text-primary" />
                  {rule.current_streak} day streak
                </p>
              </div>

              {/* Toggle */}
              <button
                onClick={() => handleToggle(rule.id, checkedToday)}
                disabled={isLoading}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isLoading
                    ? "bg-slate-700 cursor-not-allowed"
                    : checkedToday
                      ? "bg-accent-green text-white shadow-lg shadow-accent-green/30 hover:bg-accent-green/80"
                      : "bg-slate-700 border border-slate-600 text-slate-400 hover:border-accent-green hover:text-accent-green"
                  }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MaterialIcon name={checkedToday ? "check" : "radio_button_unchecked"} className="text-base" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
