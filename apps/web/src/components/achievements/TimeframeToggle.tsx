"use client";

import { useState } from "react";

const timeframes = ["Week", "Month", "Year"] as const;
type Timeframe = (typeof timeframes)[number];

interface TimeframeToggleProps {
  defaultValue?: Timeframe;
  onChange?: (value: Timeframe) => void;
}

export default function TimeframeToggle({
  defaultValue = "Month",
  onChange,
}: TimeframeToggleProps) {
  const [active, setActive] = useState<Timeframe>(defaultValue);

  const handleClick = (tf: Timeframe) => {
    setActive(tf);
    onChange?.(tf);
  };

  return (
    <div className="px-6 pb-2">
      <div className="flex p-1 bg-surface-dark rounded-full">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => handleClick(tf)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
              active === tf
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
