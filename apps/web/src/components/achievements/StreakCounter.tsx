"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import { useTranslations } from "next-intl";

interface StreakCounterProps {
  streak?: number;
}

export default function StreakCounter({ streak = 12 }: StreakCounterProps) {
  const t = useTranslations("Achievements.streak");

  return (
    <div className="flex flex-col items-center justify-center pt-2 pb-4">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <div className="relative flex items-center justify-center">
          <MaterialIcon
            name="local_fire_department"
            filled
            className="text-primary text-4xl mr-2"
          />
          <span className="text-4xl font-extrabold text-white tracking-tight">
            {streak}
          </span>
        </div>
      </div>
      <p className="text-primary font-bold tracking-wide uppercase text-sm mt-1">
        {t("dayStreak")}
      </p>
    </div>
  );
}
