"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import type { ProfileData } from "@/lib/hooks/use-achievements";
import { getLevelProgress, getNextMysteryBox } from "@/lib/constants/leveling";

interface XPProgressProps {
  profile: ProfileData | null;
  currentStreak: number;
}

export default function XPProgress({ profile, currentStreak }: XPProgressProps) {
  if (!profile) return null;

  const { current, target, percentage } = getLevelProgress(profile.xp);
  const nextBox = getNextMysteryBox(profile.level, currentStreak);

  return (
    <div className="px-4 mb-6">
      {/* Level & XP Card */}
      <div className="bg-surface-dark rounded-xl p-4 border border-white/5 mb-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-lg font-black text-white">{profile.level}</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-surface-dark border-2 border-primary flex items-center justify-center">
              <MaterialIcon name="star" filled className="text-[10px] text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-bold text-white">Level {profile.level}</h3>
              <div className="text-right">
                <span className="text-primary font-bold text-sm">{current}</span>
                <span className="text-slate-500 text-xs">/ {target} XP</span>
              </div>
            </div>
            <div className="h-2.5 bg-surface-dark-lighter rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full relative transition-all duration-500"
                style={{ width: `${Math.max(percentage, 2)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {target - current} XP to Level {profile.level + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Next Mystery Box */}
      {nextBox && (
        <div className="bg-gradient-to-br from-[#1a1832] to-[#12101f] rounded-xl p-4 border border-purple-500/10 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
          <div className="relative z-10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <MaterialIcon
                  name={nextBox.tier.icon}
                  className="text-xl text-purple-400"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-bold text-white">
                    {nextBox.tier.name}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[8px] font-bold uppercase">
                    {nextBox.tier.streakDays}d streak
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
                  Keep your streak for{" "}
                  <span className="text-white font-bold">{nextBox.daysRemaining} more days</span>{" "}
                  to unlock!
                </p>
                <div className="flex flex-wrap gap-1">
                  {nextBox.tier.rewards.map((reward) => (
                    <span
                      key={reward}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/5 text-[8px] text-slate-400 font-medium"
                    >
                      <MaterialIcon name="redeem" className="text-[8px] text-purple-400" />
                      {reward}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Progress toward next box */}
            <div className="mt-3">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      Math.round(
                        ((nextBox.tier.streakDays - nextBox.daysRemaining) /
                          nextBox.tier.streakDays) *
                          100
                      ),
                      2
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-slate-500">
                  {nextBox.tier.streakDays - nextBox.daysRemaining}/{nextBox.tier.streakDays} days
                </span>
                <span className="text-[9px] text-purple-400 font-semibold">
                  {Math.round(
                    ((nextBox.tier.streakDays - nextBox.daysRemaining) /
                      nextBox.tier.streakDays) *
                      100
                  )}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
