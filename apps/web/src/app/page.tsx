"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import FloatingActionButton from "@/components/layout/FloatingActionButton";
import WeeklyCalendarStrip from "@/components/dashboard/WeeklyCalendarStrip";
import StatsOverview from "@/components/dashboard/StatsOverview";
import TaskChecklist from "@/components/dashboard/TaskChecklist";
import GoalStreaks from "@/components/dashboard/GoalStreaks";
import CreateHabitModal from "@/components/dashboard/CreateHabitModal";
import { useDashboard } from "@/lib/hooks/use-dashboard";

export default function DashboardPage() {
  const { data, weekSummary, loading, toggleHabit, logGoalStreak, deleteHabit, editHabit, deleteGoalStreak, editGoalStreak, refresh } = useDashboard();
  const [modalOpen, setModalOpen] = useState(false);

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
            <TaskChecklist
              tasks={data?.tasks ?? []}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
              onEdit={editHabit}
            />
            <GoalStreaks goals={data?.goalStreaks ?? []} onLog={logGoalStreak} onDelete={deleteGoalStreak} onEdit={editGoalStreak} />
          </>
        )}
        <div className="h-8" />
      </main>
      <FloatingActionButton onClick={() => setModalOpen(true)} />
      <BottomNav />
      <CreateHabitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refresh}
      />
    </>
  );
}
