"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

interface RewardCardProps {
  title?: string;
  description?: string;
  icon?: string;
  validUntil?: string;
  unlocked?: boolean;
}

export default function RewardCard({
  title = "Free Milk Coffee",
  description = "You hit your 30-day consistency goal!",
  icon = "local_cafe",
  validUntil = "Dec 31, 2024",
  unlocked = true,
}: RewardCardProps) {
  return (
    <div className="px-4 mb-8">
      <h2 className="text-lg font-bold text-white mb-4 px-2">Your Rewards</h2>
      <div className="relative bg-gradient-to-b from-[#3e3120] to-[#221a10] border border-primary/20 rounded-2xl p-6 overflow-hidden shadow-glow group cursor-pointer">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col items-center text-center">
          {unlocked && (
            <div className="mb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                Unlocked!
              </span>
            </div>
          )}
          <h3 className="text-2xl font-extrabold text-white mb-1">{title}</h3>
          <p className="text-slate-400 text-sm mb-6">{description}</p>
          <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-2xl relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
            <MaterialIcon
              name={icon}
              className="text-6xl text-amber-100 drop-shadow-lg z-10"
            />
          </div>
          <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <MaterialIcon name="redeem" />
            Redeem Now
          </button>
          <p className="text-xs text-slate-500 mt-3">Valid until {validUntil}</p>
        </div>
      </div>
    </div>
  );
}
