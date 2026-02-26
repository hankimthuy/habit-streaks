"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

// Legacy type — kept for backward compatibility
interface DashboardTask {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: "positive" | "negative";
  completed: boolean;
}

interface HabitChecklistSectionProps {
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  type: "positive" | "negative";
  habits: DashboardTask[];
  onToggle: (habitId: string) => void;
}

export default function HabitChecklistSection({
  title,
  subtitle,
  icon,
  iconColor,
  type,
  habits,
  onToggle,
}: HabitChecklistSectionProps) {
  const isPositive = type === "positive";

  if (habits.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-lg ${iconColor}`}>
          <MaterialIcon name={icon} className="text-lg" />
        </div>
        <h2 className="text-lg font-bold text-white">
          {title}{" "}
          <span className="text-stone-500 font-normal text-sm ml-1">
            ({subtitle})
          </span>
        </h2>
      </div>
      <div className="space-y-3">
        {habits.map((habit) => {
          const isChecked = habit.completed;
          return (
            <div
              key={habit.id}
              onClick={() => onToggle(habit.id)}
              className="group relative flex items-center justify-between p-4 bg-surface-dark border border-stone-800 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="flex items-center gap-4 z-10">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background-dark text-stone-300 transition-colors">
                  <MaterialIcon name={habit.icon} />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-bold text-base transition-colors ${
                      isChecked ? "text-slate-400 line-through" : "text-white"
                    }`}
                  >
                    {habit.title}
                  </span>
                  <span className="text-xs text-stone-400">
                    {habit.subtitle}
                  </span>
                </div>
              </div>
              <div className="relative z-10">
                <div
                  className={`w-8 h-8 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isChecked
                      ? isPositive
                        ? "bg-accent-green border-accent-green shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                        : "bg-primary border-primary shadow-[0_0_12px_rgba(244,157,37,0.4)]"
                      : "border-stone-600 bg-transparent"
                  }`}
                >
                  {isChecked && (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {isPositive ? (
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                        />
                      ) : (
                        <path
                          d="M6 18L18 6M6 6l12 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                        />
                      )}
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
