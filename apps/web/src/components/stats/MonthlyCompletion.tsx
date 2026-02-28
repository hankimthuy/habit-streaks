"use client";

import { useState, useEffect, useCallback } from "react";
import { vnToday } from "@/lib/date-utils";

interface PeriodStats {
  total: number;
  completed: number;
  failed: number;
  percentage: number;
}

interface StatsData {
  day: PeriodStats | null;
  week: PeriodStats | null;
  month: PeriodStats | null;
  year: PeriodStats | null;
}

type Timeframe = "Day" | "Week" | "Month" | "Year";

export default function MonthlyCompletion() {
  const [timeframe, setTimeframe] = useState<Timeframe>("Month");
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const today = vnToday();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/insights?date=${today}`);
      if (res.ok) {
        const data: StatsData = await res.json();
        setStatsData(data);
      }
    } catch {
      // non-critical
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const current: PeriodStats | null = statsData
    ? statsData[timeframe.toLowerCase() as keyof StatsData]
    : null;

  const percentage = current?.percentage ?? 0;
  const completed = current?.completed ?? 0;
  const failed = current?.failed ?? 0;
  const dashArray = `${percentage}, 100`;

  // Keep the label context-appropriate
  const label = percentage === 100
    ? "Perfect!"
    : percentage >= 80
      ? "Great job!"
      : percentage >= 50
        ? "Keep going!"
        : percentage > 0
          ? "Room to grow"
          : "Nothing tracked";

  return (
    <section className="bg-surface-dark p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col items-center">
      {/* Timeframe toggle */}
      <div className="flex gap-2 mb-6 bg-slate-800 p-1 rounded-xl w-full">
        {(["Day", "Week", "Month", "Year"] as Timeframe[]).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${timeframe === t ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
        {timeframe} Completion
      </h2>

      {loading ? (
        <div className="w-12 h-12 my-12 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="block mx-auto max-w-[80%] max-h-[250px]" viewBox="0 0 36 36">
              <path
                className="fill-none stroke-[#27272a]"
                strokeWidth="2.8"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="fill-none stroke-accent-green"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeDasharray={dashArray}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{percentage}%</span>
              <span className="text-[10px] font-bold text-accent-green uppercase">
                {label}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-6">
            <div className="text-center">
              <p className="text-xs text-slate-500 font-medium">Completed</p>
              <p className="text-lg font-bold">{completed}</p>
            </div>
            <div className="w-px h-8 bg-slate-800 self-center" />
            <div className="text-center">
              <p className="text-xs text-slate-500 font-medium">Missed</p>
              <p className="text-lg font-bold">{failed}</p>
            </div>
          </div>

          {current?.total === 0 && (
            <p className="text-xs text-slate-600 mt-3 text-center">
              No habits tracked in this {timeframe.toLowerCase()}
            </p>
          )}
        </>
      )}
    </section>
  );
}
