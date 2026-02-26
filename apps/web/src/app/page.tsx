"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import FloatingActionButton from "@/components/layout/FloatingActionButton";
import WeeklyCalendarStrip from "@/components/dashboard/WeeklyCalendarStrip";
import StatsOverview from "@/components/dashboard/StatsOverview";
import TodayStreaks from "@/components/dashboard/TodayStreaks";
import GoalStreaks from "@/components/dashboard/GoalStreaks";
import CreateTypeSelector from "@/components/dashboard/CreateTypeSelector";
import CreateGoalStreakModal from "@/components/dashboard/CreateGoalStreakModal";
import { useDashboard } from "@/lib/hooks/use-dashboard";

export default function DashboardPage() {
  const { data, weekSummary, loading, today, logGoalStreak, deleteGoalStreak, editGoalStreak, refresh } = useDashboard();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"daily" | "free" | null>(null);

  const handleTypeSelect = (mode: "daily" | "free") => {
    setSelectorOpen(false);
    setCreateMode(mode);
  };

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col gap-6 pb-24 px-4 overflow-y-auto">
        <WeeklyCalendarStrip weekSummary={weekSummary} />
        <StatsOverview
          currentStreak={data?.stats.currentStreak ?? 0}
          completionRate={data?.stats.completionRate ?? 0}
        />
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <TodayStreaks
              streaks={data?.todayStreaks ?? []}
              today={today}
              onLog={logGoalStreak}
            />
            <GoalStreaks goals={data?.goalStreaks ?? []} onLog={logGoalStreak} onDelete={deleteGoalStreak} onEdit={editGoalStreak} />
          </>
        )}
        <div className="h-8" />
      </main>
      <FloatingActionButton onClick={() => setSelectorOpen(true)} />
      <BottomNav />
      <CreateTypeSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleTypeSelect}
      />
      {createMode && (
        <CreateGoalStreakModal
          open={!!createMode}
          mode={createMode}
          onClose={() => setCreateMode(null)}
          onCreated={refresh}
        />
      )}
    </>
  );
}
