"use client";

import BottomNav from "@/components/layout/BottomNav";
import DailyLogHeader from "@/components/daily-log/DailyLogHeader";
import StreakCompletionCard from "@/components/daily-log/StreakCompletionCard";
import TodayStreaks from "@/components/dashboard/TodayStreaks";
import Toast from "@/components/ui/Toast";
import { useDashboard } from "@/lib/hooks/use-dashboard";

export default function DailyLogPage() {
  const { data, today, loading, logGoalStreak, loadingGoals, notification, clearNotification } = useDashboard();

  const todayStreaks = data?.todayStreaks ?? [];
  const totalToday = todayStreaks.length;
  const completedCount = todayStreaks.filter(
    (s) => s.current_streak >= s.target_days
  ).length;
  const progressPercent =
    totalToday > 0 ? Math.round((completedCount / totalToday) * 100) : 0;

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
            <TodayStreaks
              streaks={todayStreaks}
              today={today}
              onLog={(goalId, action) => logGoalStreak(goalId, action, true)}
              loadingGoals={loadingGoals}
            />
            {completedCount === totalToday && totalToday > 0 && (
              <StreakCompletionCard />
            )}
          </>
        )}
        <div className="h-8" />
      </div>
      <BottomNav />
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />
      )}
    </>
  );
}
