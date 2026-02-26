"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import type { AchievementData } from "@/lib/hooks/use-achievements";

interface AwardsGridProps {
  achievements: AchievementData[];
}

const GRADIENTS = [
  "from-primary to-orange-700",
  "from-yellow-400 to-yellow-600",
  "from-emerald-400 to-emerald-700",
  "from-blue-400 to-blue-700",
  "from-purple-400 to-purple-700",
  "from-pink-400 to-pink-700",
];

export default function BadgesCarousel({ achievements }: AwardsGridProps) {
  if (achievements.length === 0) return null;

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);
  const sorted = [...unlocked, ...locked];
  const unlockedCount = unlocked.length;

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-lg font-bold text-white">
          Badges
        </h2>
        <span className="text-xs font-semibold text-slate-400">
          {unlockedCount}/{achievements.length} unlocked
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {sorted.map((a, i) => {
          const gradient = GRADIENTS[i % GRADIENTS.length];
          const isUnlocked = a.unlocked;

          return (
            <div
              key={a.id}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="relative">
                {/* Glow effect for unlocked */}
                {isUnlocked && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-full blur-md opacity-40`} />
                )}
                <div
                  className={`relative w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
                    isUnlocked
                      ? `bg-gradient-to-br ${gradient} border-white/20 shadow-md`
                      : "bg-surface-dark border-dashed border-slate-600/60"
                  }`}
                >
                  <MaterialIcon
                    name={isUnlocked ? a.icon : "lock"}
                    className={`text-xl ${isUnlocked ? "text-white" : "text-slate-500"}`}
                  />
                </div>
              </div>
              <span
                className={`text-[9px] text-center leading-tight line-clamp-2 ${
                  isUnlocked ? "font-bold text-slate-200" : "font-medium text-slate-500"
                }`}
              >
                {a.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
