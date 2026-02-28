"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import type { DashboardGoalStreak } from "@/lib/hooks/use-dashboard";

interface DosAndDontsListProps {
    rules: DashboardGoalStreak[];
    today: string;
    onLog?: (goalId: string, action: "increment" | "decrement") => void;
    loadingGoals?: Set<string>;
}

const COLOR_MAP: Record<string, { iconBg: string; bar: string; glow: string }> = {
    primary: { iconBg: "bg-primary/20 text-primary", bar: "bg-primary", glow: "shadow-primary/20" },
    blue: { iconBg: "bg-blue-500/20 text-blue-500", bar: "bg-blue-500", glow: "shadow-blue-500/20" },
    green: { iconBg: "bg-accent-green/20 text-accent-green", bar: "bg-accent-green", glow: "shadow-accent-green/20" },
    red: { iconBg: "bg-accent-red/20 text-accent-red", bar: "bg-accent-red", glow: "shadow-accent-red/20" },
    amber: { iconBg: "bg-amber-500/20 text-amber-500", bar: "bg-amber-500", glow: "shadow-amber-500/20" },
};

function RuleCard({
    rule,
    today,
    onLog,
    loadingGoals,
}: {
    rule: DashboardGoalStreak;
    today: string;
    onLog?: (goalId: string, action: "increment" | "decrement") => void;
    loadingGoals?: Set<string>;
}) {
    const checkedToday = rule.last_checkin_date === today;
    const colors = COLOR_MAP[rule.color] ?? COLOR_MAP.primary;
    const isLoading = loadingGoals?.has(rule.id);

    return (
        <div className="group flex items-center p-4 rounded-3xl bg-surface-dark border border-slate-700/50 transition-colors relative">
            <div className="flex-shrink-0 mr-4">
                <div className={`w-12 h-12 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                    <MaterialIcon name={rule.icon} filled={checkedToday} />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className={`font-bold ${checkedToday ? "text-accent-green line-through decoration-accent-green/50" : "text-white"}`}>
                    {rule.title}
                </h4>
                <p className={`text-xs ${checkedToday ? "text-slate-500" : "text-slate-400"}`}>
                    {rule.subtitle || "Life Rule / Atomic Habit"}
                </p>
            </div>
            <div className="flex items-center gap-2">
                {onLog && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onLog(rule.id, checkedToday ? "decrement" : "increment");
                        }}
                        disabled={isLoading}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${checkedToday
                                ? "bg-accent-green text-surface-dark shadow-lg shadow-accent-green/20"
                                : isLoading
                                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                    : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500"
                            }`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 flex items-center justify-center border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <MaterialIcon name={checkedToday ? "check" : "rule"} className="text-xl" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function DosAndDontsList({ rules, today, onLog, loadingGoals }: DosAndDontsListProps) {
    const completedCount = rules.filter((r) => r.last_checkin_date === today).length;

    if (rules.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
                    Do's & Don'ts
                </h2>
                <span className="text-xs font-bold bg-slate-800 px-3 py-1 rounded-full text-slate-300">
                    {completedCount}/{rules.length} Followed
                </span>
            </div>
            <div className="flex flex-col gap-3">
                {rules.map((rule) => (
                    <RuleCard
                        key={rule.id}
                        rule={rule}
                        today={today}
                        onLog={onLog}
                        loadingGoals={loadingGoals}
                    />
                ))}
            </div>
        </section>
    );
}
