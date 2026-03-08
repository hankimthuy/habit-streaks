"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import BottomNav from "@/components/layout/BottomNav";
import BackButton from "@/components/layout/BackButton";
import MonthlyCompletion from "@/components/stats/MonthlyCompletion";
import DoVsDontChart from "@/components/stats/DoVsDontChart";
import LongestStreaks from "@/components/stats/LongestStreaks";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { useTranslations } from "next-intl";

export default function StatsPage() {
  const t = useTranslations("Insights");
  const { data } = useDashboard();
  // Combine daily + free streaks for longest streaks view
  const allStreaks = [
    ...(data?.todayStreaks ?? []),
    ...(data?.goalStreaks ?? []),
  ];

  return (
    <>
      <header className="pt-10 pb-6 px-6 flex items-center justify-between sticky top-0 z-20 bg-background-dark">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-xl font-extrabold tracking-tight">{t("title")}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center text-slate-400">
          <MaterialIcon name="calendar_month" />
        </div>
      </header>
      <main className="flex-1 flex flex-col gap-8 pb-28 px-6 overflow-y-auto">
        <div>
          <p className="text-slate-400 text-sm mb-4">{t("page.desc1")}</p>
          <MonthlyCompletion />
        </div>
        <div>
          <p className="text-slate-400 text-sm mb-4">{t("page.desc2")}</p>
          <DoVsDontChart />
        </div>
        <div>
          <p className="text-slate-400 text-sm mb-4">{t("page.desc3")}</p>
          <LongestStreaks goalStreaks={allStreaks} />
        </div>

        {/* Placeholder for AI Advice / Burn Down Chart */}
        <div>
          <p className="text-slate-400 text-sm mb-4">{t("page.desc4")}</p>
          <section className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-6 rounded-3xl flex flex-col items-center justify-center min-h-[150px] text-center">
            <MaterialIcon name="auto_awesome" className="text-indigo-400 text-3xl mb-2" />
            <h3 className="text-indigo-300 font-bold mb-1">{t("page.aiComingSoon")}</h3>
            <p className="text-sm text-indigo-400/80">
              {t("page.aiDesc")}
            </p>
          </section>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
