"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import { useTranslations } from "next-intl";

interface FireItem {
  id: string;
  name: string;
  color: string;
  requiredLevel: number;
}

/** Fire styles unlock as the user levels up */
const FIRES: FireItem[] = [
  { id: "classic", name: "CLASSIC", color: "bg-primary", requiredLevel: 1 },
  { id: "ice", name: "ICE", color: "bg-accent-blue", requiredLevel: 2 },
  { id: "nature", name: "NATURE", color: "bg-accent-green", requiredLevel: 3 },
  { id: "royal", name: "ROYAL", color: "bg-purple-500", requiredLevel: 5 },
  { id: "inferno", name: "INFERNO", color: "bg-accent-red", requiredLevel: 10 },
];

export default function FireCollection({ level }: { level: number }) {
  const t = useTranslations("Profile.fireCollection");
  const unlockedCount = FIRES.filter((f) => level >= f.requiredLevel).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{t("title")}</h2>
        <span className="text-xs font-bold text-primary">{t("unlocked", { count: unlockedCount })}</span>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {FIRES.map((item) => {
          const unlocked = level >= item.requiredLevel;
          return (
            <div
              key={item.id}
              className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border ${unlocked
                ? "bg-surface-dark border-slate-700"
                : "bg-surface-dark/50 border-dashed border-slate-700"
                }`}
            >
              <div
                className={`w-12 h-12 ${unlocked ? item.color : "bg-slate-800"} rounded-xl flex items-center justify-center`}
              >
                <MaterialIcon
                  name={unlocked ? "local_fire_department" : "lock"}
                  className={`text-3xl ${unlocked ? "text-white" : "text-slate-500"}`}
                />
              </div>
              <span className={`text-[10px] font-black ${unlocked ? "text-slate-300" : "text-slate-600"}`}>
                {unlocked ? item.name : t("lockedLevel", { level: item.requiredLevel })}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
