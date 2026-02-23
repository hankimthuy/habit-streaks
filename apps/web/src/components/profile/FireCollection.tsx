"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

export interface FireItem {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  unlocked: boolean;
}

interface FireCollectionProps {
  items?: FireItem[];
  unlockedCount?: number;
}

const defaultItems: FireItem[] = [
  { id: "ice", name: "ICE", color: "bg-accent-blue", borderColor: "border-slate-700", unlocked: true },
  { id: "classic", name: "CLASSIC", color: "bg-primary", borderColor: "border-primary", unlocked: true },
  { id: "nature", name: "NATURE", color: "bg-accent-green", borderColor: "border-slate-700", unlocked: true },
  { id: "locked1", name: "LOCKED", color: "bg-slate-800", borderColor: "border-dashed border-slate-700", unlocked: false },
];

export default function FireCollection({
  items = defaultItems,
  unlockedCount = 6,
}: FireCollectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Your Fire Collection</h2>
        <span className="text-xs font-bold text-primary">{unlockedCount} Unlocked</span>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex-shrink-0 w-20 h-24 bg-surface-dark rounded-2xl flex flex-col items-center justify-center gap-2 border ${item.borderColor} ${
              !item.unlocked ? "bg-surface-dark/50" : ""
            }`}
          >
            <div
              className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center ${
                !item.unlocked ? "opacity-40" : ""
              }`}
            >
              <MaterialIcon
                name={item.unlocked ? "local_fire_department" : "lock"}
                className="text-white text-3xl"
              />
            </div>
            <span
              className={`text-[10px] font-black ${
                item.id === "classic"
                  ? "text-primary"
                  : item.unlocked
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
