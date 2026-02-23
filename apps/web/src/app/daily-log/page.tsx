"use client";

import BottomNav from "@/components/layout/BottomNav";
import DailyLogHeader from "@/components/daily-log/DailyLogHeader";
import HabitChecklistSection from "@/components/daily-log/HabitChecklistSection";
import StreakCompletionCard from "@/components/daily-log/StreakCompletionCard";
import { useDashboard } from "@/lib/hooks/use-dashboard";

export default function DailyLogPage() {
  const { data, loading, toggleHabit } = useDashboard();

  const tasks = data?.tasks ?? [];
  const positiveHabits = tasks.filter((t) => t.type === "positive");
  const negativeHabits = tasks.filter((t) => t.type === "negative");

  const totalHabits = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent =
    totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  return (
    <>
      <DailyLogHeader
        streakDays={data?.stats.currentStreak ?? 0}
        progressPercent={progressPercent}
      />
      <div className="px-6 py-6 space-y-8 flex-1 overflow-y-auto pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <HabitChecklistSection
              title="The Do's"
              subtitle="Positive Habits"
              icon="check_circle"
              iconColor="bg-accent-green/10 text-accent-green"
              type="positive"
              habits={positiveHabits}
              onToggle={toggleHabit}
            />
            <HabitChecklistSection
              title="The Don'ts"
              subtitle="Avoidance Goals"
              icon="block"
              iconColor="bg-primary/10 text-primary"
              type="negative"
              habits={negativeHabits}
              onToggle={toggleHabit}
            />
            {completedCount === totalHabits && totalHabits > 0 && (
              <StreakCompletionCard />
            )}
          </>
        )}
        <div className="h-8" />
      </div>
      <BottomNav />
    </>
  );
}
