"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import BottomNav from "@/components/layout/BottomNav";
import BackButton from "@/components/layout/BackButton";
import StreakCounter from "@/components/achievements/StreakCounter";
import TimeframeToggle from "@/components/achievements/TimeframeToggle";
import ActivityHeatmap from "@/components/achievements/ActivityHeatmap";
import BadgesCarousel from "@/components/achievements/BadgesCarousel";
import RewardCard from "@/components/achievements/RewardCard";
import XPProgress from "@/components/achievements/XPProgress";
import { useAchievements } from "@/lib/hooks/use-achievements";

export default function AchievementsPage() {
  const { achievements, loading } = useAchievements();

  return (
    <>
      {/* Header / Stats Area */}
      <div className="sticky top-0 z-10 bg-background-dark/95 backdrop-blur-sm border-b border-white/5 pb-2">
        <div className="flex items-center justify-between p-4">
          <BackButton />
          <h1 className="text-lg font-bold tracking-tight">Achievements</h1>
          <button className="text-slate-400 hover:text-white transition-colors">
            <MaterialIcon name="settings" />
          </button>
        </div>
        <StreakCounter />
        <TimeframeToggle />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
        <ActivityHeatmap />
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <BadgesCarousel achievements={achievements} />
        )}
        <RewardCard />
        <XPProgress />
      </div>

      <BottomNav />
    </>
  );
}
