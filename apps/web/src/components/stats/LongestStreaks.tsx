"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

type DayStatus = "success" | "fail" | "empty";

export interface StreakItem {
  id: string;
  title: string;
  days: number;
  daysLabel?: string;
  weekDots: DayStatus[];
  active: boolean;
}

interface LongestStreaksProps {
  streaks?: StreakItem[];
}

const defaultStreaks: StreakItem[] = [
  {
    id: "1",
    title: "Americano Habit",
    days: 24,
    weekDots: ["success", "success", "success", "success", "fail", "success", "success"],
    active: true,
  },
  {
    id: "2",
    title: "Code Practice",
    days: 18,
    weekDots: ["success", "success", "success", "success", "success", "success", "success"],
    active: true,
  },
  {
    id: "3",
    title: "No Sugar",
    days: 12,
    daysLabel: "Personal Best",
    weekDots: ["fail", "empty", "empty", "empty", "empty", "empty", "empty"],
    active: false,
  },
];

const dotColor: Record<DayStatus, string> = {
  success: "bg-accent-green",
  fail: "bg-accent-red",
  empty: "bg-slate-700",
};

export default function LongestStreaks({ streaks = defaultStreaks }: LongestStreaksProps) {
  return (
    <section>
      <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">
        Longest Streaks
      </h2>
      <div className="flex flex-col gap-3">
        {streaks.map((streak) => (
          <div
            key={streak.id}
            className={`bg-surface-dark p-4 rounded-2xl flex items-center justify-between shadow-[0_10px_20px_-5px_rgba(0,0,0,0.4)] ${
              !streak.active ? "opacity-80" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center ${
                  streak.active ? "text-accent-green" : "text-accent-green/50"
                }`}
              >
                <MaterialIcon
                  name="local_fire_department"
                  filled
                  className="font-bold"
                />
              </div>
              <div>
                <h4
                  className={`font-bold ${
                    streak.active ? "text-white" : "text-slate-300"
                  }`}
                >
                  {streak.title}
                </h4>
                <div className="flex items-center gap-1 mt-0.5">
                  {streak.weekDots.map((status, i) => (
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
                className={`text-xl font-black ${
                  streak.active ? "text-white" : "text-slate-500"
                }`}
              >
                {streak.days}
              </p>
              <p
                className={`text-[10px] font-bold uppercase ${
                  streak.active ? "text-slate-500" : "text-slate-600"
                }`}
              >
                {streak.daysLabel ?? "DAYS"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
