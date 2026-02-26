"use client";

import type { Timeframe } from "@/lib/hooks/use-achievements";

const timeframes: Timeframe[] = ["Week", "Month", "Year"];

interface TimeframeToggleProps {
  value: Timeframe;
  onChange: (value: Timeframe) => void;
}

export default function TimeframeToggle({
  value,
  onChange,
}: TimeframeToggleProps) {
  return (
    <div className="px-6 pb-2">
      <div className="flex p-1 bg-surface-dark rounded-full">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => onChange(tf)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
              value === tf
                ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
}
