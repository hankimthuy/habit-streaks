"use client";

import { formatVNDate } from "@/lib/date-utils";
import { useTranslations } from "next-intl";

interface DailyLogHeaderProps {
  streakDays?: number;
  progressPercent?: number;
}

export default function DailyLogHeader({
  streakDays = 0,
  progressPercent = 0,
}: DailyLogHeaderProps) {
  const t = useTranslations("LifeFlow");
  const vnDate = formatVNDate();

  return (
    <header className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-4 border-b border-stone-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-stone-400 uppercase tracking-wider">
            {t("todaysLog")}
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight capitalize">
            {vnDate}
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-surface-dark border border-stone-700 px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-lg">🔥</span>
          <span className="text-sm font-bold text-primary">{t("days", { count: streakDays })}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            {t("dailyGoals")}
          </span>
          <span className="text-xs font-bold text-primary">{t("percentDone", { percent: progressPercent })}</span>
        </div>
        <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}
