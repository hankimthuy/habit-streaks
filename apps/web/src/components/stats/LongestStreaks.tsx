"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

import type { DashboardGoalStreak } from "@/lib/hooks/use-dashboard";

interface LongestStreaksProps {
  goalStreaks?: DashboardGoalStreak[];
}

const dotColor: Record<string, string> = {
  success: "bg-accent-green",
  fail: "bg-accent-red",
  empty: "bg-slate-700",
};

export default function LongestStreaks({ goalStreaks = [] }: LongestStreaksProps) {
  if (goalStreaks.length === 0) {
    return (
      <section>
        <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">
          Longest Streaks
        </h2>
        <div className="bg-surface-dark p-6 rounded-2xl shadow text-center">
          <p className="text-slate-500 text-sm">No streaks recorded yet.</p>
        </div>
      </section>
    );
  }

  // Sort by longest_streak descending
  const sortedStreaks = [...goalStreaks].sort((a, b) => b.longest_streak - a.longest_streak);

  return (
    <section>
      <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">
        Longest Streaks
      </h2>
      <div className="flex flex-col gap-3">
        {sortedStreaks.map((streak) => {
          const isActive = streak.current_streak > 0;
          // Simple visual dots for now (mocking 7 days, 1 success if active, else empty)
          const dots = Array(7).fill("empty");
          if (isActive) dots[6] = "success";

          return (
            <div
              key={streak.id}
              className={`bg-surface-dark p-4 rounded-2xl flex items-center justify-between shadow-[0_10px_20px_-5px_rgba(0,0,0,0.4)] ${!isActive ? "opacity-80" : ""
                }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center ${isActive ? "text-accent-green" : "text-accent-green/50"
                    }`}
                >
                  <MaterialIcon
                    name={streak.icon || "local_fire_department"}
                    filled
                    className="font-bold"
                  />
                </div>
                <div>
                  <h4
                    className={`font-bold ${isActive ? "text-white" : "text-slate-300"
                      }`}
                  >
                    {streak.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    {dots.map((status, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${dotColor[status]}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-xl font-black ${isActive ? "text-white" : "text-slate-500"
                    }`}
                >
                  {streak.longest_streak}
                </p>
                <p
                  className={`text-[10px] font-bold uppercase ${isActive ? "text-slate-500" : "text-slate-600"
                    }`}
                >
                  BEST DAYS
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
