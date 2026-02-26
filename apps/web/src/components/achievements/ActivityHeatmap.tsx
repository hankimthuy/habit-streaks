"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import type { ActivityData, ActivityDay, Timeframe } from "@/lib/hooks/use-achievements";

type ActivityLevel = 0 | 1 | 2 | 3;

interface ActivityHeatmapProps {
  activity: ActivityData | null;
  timeframe: Timeframe;
}

const levelColors: Record<ActivityLevel, string> = {
  0: "bg-surface-dark-lighter",
  1: "bg-primary/30",
  2: "bg-primary/60",
  3: "bg-emerald-500",
};

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getLevelColor(level: number): string {
  return levelColors[(Math.min(level, 3)) as ActivityLevel];
}

// Build a set of dates that are part of a consecutive perfect streak (≥2 days)
function buildStreakSet(days: ActivityDay[]): Set<string> {
  const streakDates = new Set<string>();
  let run: string[] = [];

  for (const day of days) {
    if (day.level === 3) {
      run.push(day.date);
    } else {
      if (run.length >= 2) run.forEach((d) => streakDates.add(d));
      run = [];
    }
  }
  if (run.length >= 2) run.forEach((d) => streakDates.add(d));
  return streakDates;
}

// Week view: 7 large day cells with fire for 100%
function WeekView({ activity }: { activity: ActivityData }) {
  const streakSet = buildStreakSet(activity.days);

  return (
    <div className="grid grid-cols-7 gap-2">
      {activity.days.map((day) => {
        const d = new Date(day.date + "T00:00:00");
        const dayIdx = d.getDay();
        const label = dayLabels[dayIdx === 0 ? 6 : dayIdx - 1];
        const dateNum = d.getDate();
        const pct = day.total > 0 ? Math.round((day.completed / day.total) * 100) : 0;
        const isPerfect = day.level === 3;
        const inStreak = streakSet.has(day.date);

        return (
          <div key={day.date} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-slate-500 font-medium">{label}</span>
            <div
              className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center relative transition-colors ${
                isPerfect ? "bg-emerald-500/20 border border-emerald-500/40" : getLevelColor(day.level)
              } ${inStreak ? "ring-1 ring-orange-400/50" : ""}`}
            >
              {isPerfect ? (
                <MaterialIcon name="local_fire_department" filled className="text-base text-orange-400" />
              ) : (
                <span className={`text-xs font-bold ${day.level >= 2 ? "text-white" : "text-slate-400"}`}>
                  {dateNum}
                </span>
              )}
            </div>
            {day.total > 0 && (
              <span className={`text-[9px] font-semibold ${isPerfect ? "text-emerald-400" : "text-slate-500"}`}>
                {pct}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Month view: compact calendar grid with circles, fire for 100%
function MonthView({ activity }: { activity: ActivityData }) {
  if (activity.days.length === 0) return null;

  const streakSet = buildStreakSet(activity.days);
  const firstDate = new Date(activity.days[0].date + "T00:00:00");
  const firstDayOfWeek = firstDate.getDay();
  const startPadding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  return (
    <div>
      <div className="grid grid-cols-7 gap-y-1 mb-2">
        {dayLabels.map((l) => (
          <span key={l} className="text-[9px] text-slate-500 font-medium text-center">
            {l.charAt(0)}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 justify-items-center">
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} className="w-8 h-8" />
        ))}
        {activity.days.map((day) => {
          const dateNum = new Date(day.date + "T00:00:00").getDate();
          const isPerfect = day.level === 3;
          const inStreak = streakSet.has(day.date);

          return (
            <div
              key={day.date}
              className={`w-8 h-8 rounded-full flex items-center justify-center relative transition-colors ${
                isPerfect
                  ? "bg-emerald-500/20 border border-emerald-500/40"
                  : getLevelColor(day.level)
              } ${inStreak ? "ring-1 ring-orange-400/50" : ""}`}
            >
              {isPerfect ? (
                <MaterialIcon name="local_fire_department" filled className="text-sm text-orange-400" />
              ) : (
                <span className={`text-[10px] font-semibold ${day.level >= 2 ? "text-white" : "text-slate-500"}`}>
                  {dateNum}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Year view: GitHub-style contribution graph (52 weeks × 7 rows)
function YearView({ activity }: { activity: ActivityData }) {
  if (activity.days.length === 0) return null;

  const streakSet = buildStreakSet(activity.days);

  // Group days into weeks (columns), each week has 7 rows (Mon–Sun)
  const weeks: { date: string; level: number }[][] = [];
  let currentWeek: { date: string; level: number }[] = [];

  for (const day of activity.days) {
    const d = new Date(day.date + "T00:00:00");
    const dow = d.getDay();
    const mondayIdx = dow === 0 ? 6 : dow - 1;

    if (mondayIdx === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push({ date: day.date, level: day.level });
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  // Month labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    if (week.length > 0) {
      const d = new Date(week[0].date + "T00:00:00");
      const m = d.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({
          label: d.toLocaleString("en", { month: "short" }),
          col: wi,
        });
        lastMonth = m;
      }
    }
  });

  return (
    <div className="overflow-x-auto hide-scrollbar">
      <div className="min-w-max">
        {/* Month labels */}
        <div className="flex mb-1 ml-6" style={{ gap: 0 }}>
          {monthLabels.map((ml, i) => {
            const nextCol = i < monthLabels.length - 1 ? monthLabels[i + 1].col : weeks.length;
            const span = nextCol - ml.col;
            return (
              <span
                key={`${ml.label}-${ml.col}`}
                className="text-[9px] text-slate-500 font-medium"
                style={{ width: `${span * 14}px`, flexShrink: 0 }}
              >
                {ml.label}
              </span>
            );
          })}
        </div>
        <div className="flex gap-0">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1 pt-0">
            {["M", "", "W", "", "F", "", "S"].map((l, i) => (
              <div key={i} className="w-4 h-[10px] flex items-center justify-end">
                <span className="text-[8px] text-slate-600">{l}</span>
              </div>
            ))}
          </div>
          {/* Grid */}
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, di) => {
                  const cell = week[di];
                  if (!cell) return <div key={`${wi}-${di}`} className="w-[10px] h-[10px]" />;
                  const isPerfect = cell.level === 3;
                  const inStreak = streakSet.has(cell.date);
                  return (
                    <div
                      key={`${wi}-${di}`}
                      className={`w-[10px] h-[10px] rounded-[2px] ${
                        isPerfect
                          ? inStreak
                            ? "bg-orange-400"
                            : "bg-emerald-500"
                          : getLevelColor(cell.level)
                      }`}
                      title={cell.date}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActivityHeatmap({ activity, timeframe }: ActivityHeatmapProps) {
  const stats = activity?.stats;

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-lg font-bold text-white">Activity</h2>
          {stats && (
            <p className="text-xs text-slate-400 mt-0.5">
              {stats.coverageRate}% coverage · {stats.activeDays}/{stats.totalDays} days · {stats.perfectDays} perfect
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-surface-dark-lighter" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/30" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/60" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
          </div>
          <span className="flex items-center gap-0.5">
            <MaterialIcon name="local_fire_department" filled className="text-[10px] text-orange-400" />
            <span>streak</span>
          </span>
        </div>
      </div>
      <div className="bg-surface-dark rounded-xl p-4">
        {!activity ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : timeframe === "Week" ? (
          <WeekView activity={activity} />
        ) : timeframe === "Year" ? (
          <YearView activity={activity} />
        ) : (
          <MonthView activity={activity} />
        )}
      </div>
    </div>
  );
}
