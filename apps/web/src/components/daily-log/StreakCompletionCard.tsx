"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

interface StreakCompletionCardProps {
  onShare?: () => void;
}

export default function StreakCompletionCard({ onShare }: StreakCompletionCardProps) {
  return (
    <div className="mt-4 p-6 rounded-3xl bg-gradient-to-br from-card-dark to-background-dark border border-stone-800 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-1 shadow-[0_0_15px_rgba(244,157,37,0.3)] animate-pulse">
          <MaterialIcon name="local_fire_department" className="text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-white">Streak Maintained!</h3>
        <p className="text-sm text-stone-400">
          You&apos;re on fire! Keep the momentum going for tomorrow.
        </p>
        <button
          onClick={onShare}
          className="mt-2 px-6 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-full transition-colors w-full shadow-lg shadow-primary/20"
        >
          Share Streak
        </button>
      </div>
    </div>
  );
}
