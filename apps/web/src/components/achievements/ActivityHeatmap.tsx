"use client";

type ActivityLevel = 0 | 1 | 2 | 3;

interface ActivityHeatmapProps {
  data?: ActivityLevel[][];
}

const defaultData: ActivityLevel[][] = [
  [1, 3, 2, 3, 0, 3, 3],
  [3, 3, 0, 1, 3, 3, 3],
  [3, 3, 3, 2, 3, 3, 1],
  [3, 0, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 0, 3, 0],
  [3, 3, 0, 3, 3, 3, 3],
  [3, 3, 0, 3, 3, 3, 3],
];

const levelColors: Record<ActivityLevel, string> = {
  0: "bg-surface-dark-lighter",
  1: "bg-primary/30",
  2: "bg-primary/60",
  3: "bg-primary",
};

export default function ActivityHeatmap({ data = defaultData }: ActivityHeatmapProps) {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-bold text-white">Activity</h2>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-surface-dark-lighter" />
            <div className="w-3 h-3 rounded-sm bg-primary/40" />
            <div className="w-3 h-3 rounded-sm bg-primary" />
          </div>
          <span>More</span>
        </div>
      </div>
      <div className="bg-surface-dark rounded-xl p-4 overflow-x-auto hide-scrollbar">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-max">
          {data.flatMap((week, wi) =>
            week.map((level, di) => (
              <div
                key={`${wi}-${di}`}
                className={`w-3 h-3 rounded-sm ${levelColors[level]}`}
              />
            ))
          )}
        </div>
        <div className="flex justify-between mt-3 text-[10px] text-slate-500 font-medium uppercase tracking-wider">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
}
