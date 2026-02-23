"use client";

interface DayData {
  label: string;
  doPercent: number;
  dontPercent: number;
}

interface DoVsDontChartProps {
  data?: DayData[];
}

const defaultData: DayData[] = [
  { label: "M", doPercent: 60, dontPercent: 20 },
  { label: "T", doPercent: 80, dontPercent: 10 },
  { label: "W", doPercent: 40, dontPercent: 40 },
  { label: "T", doPercent: 70, dontPercent: 15 },
  { label: "F", doPercent: 90, dontPercent: 5 },
  { label: "S", doPercent: 30, dontPercent: 50 },
  { label: "S", doPercent: 50, dontPercent: 25 },
];

export default function DoVsDontChart({ data = defaultData }: DoVsDontChartProps) {
  return (
    <section className="bg-surface-dark p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest">
          Do vs Don&apos;t
        </h2>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-accent-blue" />
            <span className="text-[10px] font-bold text-slate-500">DO</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-accent-orange" />
            <span className="text-[10px] font-bold text-slate-500">DON&apos;T</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-end h-32 gap-3">
        {data.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full">
            <div
              className="w-full bg-accent-blue rounded-t-md"
              style={{ height: `${day.doPercent}%` }}
            />
            <div
              className="w-full bg-accent-orange rounded-b-md"
              style={{ height: `${day.dontPercent}%` }}
            />
            <span className="text-[10px] font-bold text-slate-600 text-center mt-2">
              {day.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
