"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import { getVNWeek, vnToday, type WeekDay } from "@/lib/date-utils";
import type { WeekSummary } from "@/lib/hooks/use-dashboard";

interface WeeklyCalendarStripProps {
  weekSummary?: WeekSummary;
}

export default function WeeklyCalendarStrip({
  weekSummary = {},
}: WeeklyCalendarStripProps) {
  const week = getVNWeek();
  const today = vnToday();

  function getStatus(day: WeekDay): "completed" | "partial" | "today" | "future" | "missed" {
    if (day.isToday) return "today";
    if (day.date > today) return "future";
    const s = weekSummary[day.date];
    if (!s || s.total === 0) return "future";
    if (s.completed === s.total) return "completed";
    if (s.completed > 0) return "partial";
    return "missed";
  }

  return (
    <div className="w-full overflow-x-auto hide-scrollbar pb-2 pt-2">
      <div className="flex gap-3 px-2 min-w-max">
        {week.map((day) => {
          const status = getStatus(day);

          if (status === "completed") {
            return (
              <div key={day.date} className="flex flex-col items-center gap-3 opacity-60">
                <span className="text-xs font-semibold text-slate-400">
                  {day.label}
                </span>
                <div className="w-12 h-14 rounded-2xl bg-surface-dark border border-slate-700/50 flex flex-col items-center justify-center gap-1">
                  <span className="text-sm font-bold">{day.dayOfMonth}</span>
                  <MaterialIcon
                    name="check_circle"
                    className="text-accent-green text-base"
                  />
                </div>
              </div>
            );
          }

          if (status === "partial") {
            return (
              <div key={day.date} className="flex flex-col items-center gap-3 opacity-70">
                <span className="text-xs font-semibold text-slate-400">
                  {day.label}
                </span>
                <div className="w-12 h-14 rounded-2xl bg-surface-dark border border-primary/40 flex flex-col items-center justify-center gap-1">
                  <span className="text-sm font-bold">{day.dayOfMonth}</span>
                  <MaterialIcon
                    name="timelapse"
                    className="text-primary text-base"
                  />
                </div>
              </div>
            );
          }

          if (status === "missed") {
            return (
              <div key={day.date} className="flex flex-col items-center gap-3 opacity-50">
                <span className="text-xs font-semibold text-slate-400">
                  {day.label}
                </span>
                <div className="w-12 h-14 rounded-2xl bg-surface-dark border border-accent-red/30 flex flex-col items-center justify-center gap-1">
                  <span className="text-sm font-bold text-slate-500">{day.dayOfMonth}</span>
                  <MaterialIcon
                    name="close"
                    className="text-accent-red text-base"
                  />
                </div>
              </div>
            );
          }

          if (status === "today") {
            return (
              <div key={day.date} className="flex flex-col items-center gap-3 relative">
                <span className="text-xs font-bold text-primary">Today</span>
                <div className="absolute -inset-1 bg-gradient-to-b from-primary/50 to-transparent blur-md rounded-full -z-10 mt-6" />
                <div className="w-14 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex flex-col items-center justify-center gap-1 shadow-glow transform -translate-y-1">
                  <span className="text-lg font-bold text-white">{day.dayOfMonth}</span>
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                    {day.label}
                  </span>
                </div>
              </div>
            );
          }

          // future
          return (
            <div key={day.date} className="flex flex-col items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">
                {day.label}
              </span>
              <div className="w-12 h-14 rounded-2xl bg-surface-dark border border-slate-700 flex flex-col items-center justify-center gap-1">
                <span className="text-sm font-bold text-slate-500">
                  {day.dayOfMonth}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
