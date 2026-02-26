"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import type { DashboardGoalStreak } from "@/lib/hooks/use-dashboard";

interface TodayStreaksProps {
  streaks: DashboardGoalStreak[];
  today: string;
  onLog?: (goalId: string, action: "increment" | "decrement") => void;
}

const COLOR_MAP: Record<string, { iconBg: string; bar: string; glow: string }> = {
  primary: { iconBg: "bg-primary/20 text-primary", bar: "bg-primary", glow: "shadow-primary/20" },
  blue: { iconBg: "bg-blue-500/20 text-blue-500", bar: "bg-blue-500", glow: "shadow-blue-500/20" },
  green: { iconBg: "bg-accent-green/20 text-accent-green", bar: "bg-accent-green", glow: "shadow-accent-green/20" },
  red: { iconBg: "bg-accent-red/20 text-accent-red", bar: "bg-accent-red", glow: "shadow-accent-red/20" },
  amber: { iconBg: "bg-amber-500/20 text-amber-500", bar: "bg-amber-500", glow: "shadow-amber-500/20" },
};

function TodayStreakCard({
  streak,
  today,
  onLog,
}: {
  streak: DashboardGoalStreak;
  today: string;
  onLog?: (goalId: string, action: "increment" | "decrement") => void;
}) {
  const checkedToday = streak.last_checkin_date === today;
  const isPerfect = streak.current_streak >= streak.target_days;
  const colors = COLOR_MAP[streak.color] ?? COLOR_MAP.primary;

  return (
    <>
      <div className="group flex items-center p-4 rounded-3xl bg-surface-dark border border-slate-700/50 transition-colors relative">
        <div className="flex-shrink-0 mr-4">
          <div
            className={`w-12 h-12 rounded-full ${colors.iconBg} flex items-center justify-center`}
          >
            <MaterialIcon name={streak.icon} filled={checkedToday} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-bold ${
              checkedToday
                ? "text-accent-green line-through decoration-accent-green/50"
                : "text-white"
            }`}
          >
            {streak.title}
          </h4>
          <p className={`text-xs ${checkedToday ? "text-slate-500" : "text-slate-400"}`}>
            {streak.subtitle || `${streak.current_streak}/${streak.target_days} days`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onLog && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onLog(streak.id, "decrement"); }}
                disabled={!checkedToday}
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <MaterialIcon name="remove" className="text-base" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onLog(streak.id, "increment"); }}
                disabled={checkedToday || isPerfect}
                className={`h-8 px-4 rounded-full font-bold text-xs flex items-center gap-1 transition-all ${
                  checkedToday
                    ? "bg-accent-green/20 text-accent-green cursor-default"
                    : isPerfect
                      ? "bg-accent-green/20 text-accent-green cursor-default"
                      : `${colors.bar} text-white hover:opacity-90 shadow-lg`
                }`}
              >
                {checkedToday ? (
                  <><MaterialIcon name="check" className="text-sm" /> Done</>
                ) : isPerfect ? (
                  <><MaterialIcon name="check" className="text-sm" /> Done!</>
                ) : (
                  <><MaterialIcon name="add" className="text-sm" /> Check In</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function TodayStreaks({ streaks, today, onLog }: TodayStreaksProps) {
  const completedCount = streaks.filter((s) => s.current_streak >= s.target_days).length;

  if (streaks.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Today&apos;s Grind
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        </h2>
        <span className="text-xs font-bold bg-slate-800 px-3 py-1 rounded-full text-slate-300">
          {completedCount}/{streaks.length} Done
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {streaks.map((streak) => (
          <TodayStreakCard
            key={streak.id}
            streak={streak}
            today={today}
            onLog={onLog}
          />
        ))}
      </div>
    </section>
  );
}
