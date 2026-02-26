"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import type { RewardData } from "@/lib/hooks/use-achievements";

interface RewardCardProps {
  rewards: RewardData[];
}

export default function RewardCard({ rewards }: RewardCardProps) {
  if (rewards.length === 0) return null;

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-lg font-bold text-white">Rewards</h2>
        <span className="text-xs font-semibold text-slate-400">
          {rewards.filter((r) => r.unlocked).length}/{rewards.length} unlocked
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {rewards.map((r) => {
          const validDate = new Date(r.valid_until).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={r.id}
              className={`flex-shrink-0 w-40 rounded-xl border p-3 relative overflow-hidden ${
                r.unlocked
                  ? "bg-gradient-to-b from-[#3e3120] to-[#221a10] border-primary/20"
                  : "bg-surface-dark border-white/5"
              }`}
            >
              {r.unlocked && (
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
              )}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      r.unlocked
                        ? "bg-primary/20"
                        : "bg-white/5"
                    }`}
                  >
                    <MaterialIcon
                      name={r.icon}
                      className={`text-lg ${r.unlocked ? "text-primary" : "text-slate-500"}`}
                    />
                  </div>
                  {r.unlocked && !r.redeemed && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] font-bold uppercase">
                      New
                    </span>
                  )}
                  {r.redeemed && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase">
                      Used
                    </span>
                  )}
                  {!r.unlocked && (
                    <MaterialIcon name="lock" className="text-sm text-slate-600" />
                  )}
                </div>
                <h3
                  className={`text-xs font-bold leading-tight mb-1 ${
                    r.unlocked ? "text-white" : "text-slate-400"
                  }`}
                >
                  {r.title}
                </h3>
                <p className="text-[9px] text-slate-500 leading-snug mb-2 line-clamp-2">
                  {r.description}
                </p>
                {r.unlocked && !r.redeemed && (
                  <button className="w-full bg-primary/80 hover:bg-primary text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors">
                    Redeem
                  </button>
                )}
                {!r.unlocked && (
                  <p className="text-[8px] text-slate-600">Until {validDate}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
