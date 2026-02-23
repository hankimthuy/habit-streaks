import MaterialIcon from "@/components/icons/MaterialIcon";
import BottomNav from "@/components/layout/BottomNav";
import BackButton from "@/components/layout/BackButton";
import MonthlyCompletion from "@/components/stats/MonthlyCompletion";
import DoVsDontChart from "@/components/stats/DoVsDontChart";
import LongestStreaks from "@/components/stats/LongestStreaks";

export default function StatsPage() {
  return (
    <>
      <header className="pt-10 pb-6 px-6 flex items-center justify-between sticky top-0 z-20 bg-background-dark">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-xl font-extrabold tracking-tight">Statistics</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center text-slate-400">
          <MaterialIcon name="calendar_month" />
        </div>
      </header>
      <main className="flex-1 flex flex-col gap-6 pb-28 px-6 overflow-y-auto">
        <MonthlyCompletion />
        <DoVsDontChart />
        <LongestStreaks />
      </main>
      <BottomNav />
    </>
  );
}
