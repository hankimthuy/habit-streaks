"use client";

import { useState } from "react";

interface MonthlyCompletionProps {
  percentage?: number;
  completed?: number;
  failed?: number;
}

export default function MonthlyCompletion({
  percentage = 78,
  completed = 248,
  failed = 12,
}: MonthlyCompletionProps) {
  const [timeframe, setTimeframe] = useState<"Day" | "Week" | "Month" | "Year">("Month");

  // Here we'd map timeframe to actual values from props if we had them. 
  // We'll mimic dynamic data based on the timeframe for now as per plan
  const dynamicPercentage = timeframe === "Day" ? 100 : timeframe === "Week" ? 85 : timeframe === "Month" ? percentage : 65;
  const dashArray = `${dynamicPercentage}, 100`;

  return (
    <section className="bg-surface-dark p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col items-center">
      <div className="flex gap-2 mb-6 bg-slate-800 p-1 rounded-xl w-full">
        {["Day", "Week", "Month", "Year"].map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t as any)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${timeframe === t ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"
              }`}
          >
            {t}
          </button>
        ))}
      </div>
      <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
        {timeframe} Completion
      </h2>
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="block mx-auto max-w-[80%] max-h-[250px]" viewBox="0 0 36 36">
          <path
            className="fill-none stroke-[#27272a]"
            strokeWidth="2.8"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="fill-none stroke-accent-green"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeDasharray={dashArray}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white">{dynamicPercentage}%</span>
          <span className="text-[10px] font-bold text-accent-green uppercase">
            Solid Goal Met
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-6">
        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium">Completed</p>
          <p className="text-lg font-bold">{completed}</p>
        </div>
        <div className="w-px h-8 bg-slate-800 self-center" />
        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium">Failed</p>
          <p className="text-lg font-bold">{failed}</p>
        </div>
      </div>
    </section>
  );
}
