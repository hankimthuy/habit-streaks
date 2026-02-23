"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  icon: string;
  iconColor: string;
  unitColor: string;
}

function StatCard({ label, value, unit, icon, iconColor, unitColor }: StatCardProps) {
  return (
    <div className="p-4 rounded-3xl bg-surface-dark relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <MaterialIcon name={icon} className={`text-6xl ${iconColor}`} />
      </div>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        <span className={`text-sm font-medium ${unitColor}`}>{unit}</span>
      </div>
    </div>
  );
}

interface StatsOverviewProps {
  currentStreak?: number;
  completionRate?: number;
}

export default function StatsOverview({
  currentStreak = 12,
  completionRate = 84,
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        label="Current Streak"
        value={currentStreak}
        unit="days"
        icon="local_fire_department"
        iconColor="text-primary"
        unitColor="text-primary"
      />
      <StatCard
        label="Completion"
        value={completionRate}
        unit="%"
        icon="check_circle"
        iconColor="text-accent-green"
        unitColor="text-accent-green"
      />
    </div>
  );
}
