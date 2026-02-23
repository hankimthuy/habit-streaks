"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

interface ProfileStatsProps {
  totalStreaks?: number;
  giftsEarned?: number;
}

export default function ProfileStats({
  totalStreaks = 458,
  giftsEarned = 24,
}: ProfileStatsProps) {
  return (
    <section>
      <div className="bg-surface-dark p-5 rounded-3xl flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">
            Total Streaks
          </span>
          <div className="flex items-center gap-2">
            <MaterialIcon
              name="local_fire_department"
              className="text-primary text-2xl"
            />
            <span className="text-2xl font-black text-white">{totalStreaks}</span>
          </div>
        </div>
        <div className="w-px h-10 bg-slate-700" />
        <div className="flex flex-col gap-1 items-end text-right">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">
            Gifts Earned
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">{giftsEarned}</span>
            <MaterialIcon
              name="featured_seasonal_and_gifts"
              className="text-accent-green text-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
