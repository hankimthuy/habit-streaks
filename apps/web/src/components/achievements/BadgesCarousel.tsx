"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import type { AchievementData } from "@/lib/hooks/use-achievements";

interface BadgesCarouselProps {
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

export default function BadgesCarousel({ achievements }: BadgesCarouselProps) {
  if (achievements.length === 0) return null;

  return (
    <div className="mb-8 pl-4">
      <h2 className="text-lg font-bold text-white mb-4 px-2">Badges</h2>
      <div className="flex overflow-x-auto gap-4 pb-4 pr-4 hide-scrollbar">
        {achievements.map((a, i) => {
          const gradient = GRADIENTS[i % GRADIENTS.length];
          return (
            <div
              key={a.id}
              className={`flex flex-col items-center gap-2 min-w-[80px] ${
                !a.unlocked ? "opacity-40" : ""
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                  a.unlocked
                    ? `bg-gradient-to-br ${gradient} shadow-lg border-white/10`
                    : "bg-surface-dark border-dashed border-slate-600"
                }`}
              >
                <MaterialIcon
                  name={a.unlocked ? a.icon : "lock"}
                  className={`text-3xl ${a.unlocked ? "text-white" : "text-slate-400"}`}
                />
              </div>
              <span
                className={`text-xs text-center ${
                  a.unlocked ? "font-bold text-slate-200" : "font-medium text-slate-400"
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
