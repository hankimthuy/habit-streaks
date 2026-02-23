"use client";

interface XPProgressProps {
  currentXP?: number;
  targetXP?: number;
  nextLevel?: number;
  daysRemaining?: number;
  rewardDescription?: string;
}

export default function XPProgress({
  currentXP = 350,
  targetXP = 500,
  nextLevel = 13,
  daysRemaining = 3,
  rewardDescription = "premium themes",
}: XPProgressProps) {
  const percentage = Math.round((currentXP / targetXP) * 100);

  return (
    <div className="px-4 mb-6">
      <div className="bg-surface-dark rounded-xl p-5 border border-white/5">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-sm text-slate-400 font-medium mb-1">
              Next Mystery Box
            </p>
            <h3 className="text-xl font-bold text-white">Level {nextLevel}</h3>
          </div>
          <div className="text-right">
            <span className="text-primary font-bold">{currentXP}</span>
            <span className="text-slate-500 text-sm">/ {targetXP} XP</span>
          </div>
        </div>
        <div className="h-4 bg-surface-dark-lighter rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-primary rounded-full relative"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Keep up your streak for{" "}
          <span className="text-white font-bold">{daysRemaining} more days</span> to
          unlock the Quarterly Mystery Box containing {rewardDescription}!
        </p>
      </div>
    </div>
  );
}
