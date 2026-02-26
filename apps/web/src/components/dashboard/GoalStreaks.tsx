"use client";

import { useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import ActionMenu from "@/components/ui/ActionMenu";
import EditModal, { type EditField } from "@/components/ui/EditModal";
import type { DashboardGoalStreak } from "@/lib/hooks/use-dashboard";

interface GoalStreaksProps {
  goals: DashboardGoalStreak[];
  onLog?: (goalId: string, action: "increment" | "decrement") => void;
  onDelete?: (goalId: string) => void;
  onEdit?: (goalId: string, fields: Record<string, unknown>) => void;
  loadingGoals?: Set<string>;
}

const COLOR_MAP: Record<string, { bar: string; iconBg: string; glow: string }> = {
  primary: { bar: "bg-primary", iconBg: "bg-primary/20 text-primary", glow: "bg-primary/20" },
  blue: { bar: "bg-blue-500", iconBg: "bg-blue-500/20 text-blue-500", glow: "bg-blue-500/20" },
  green: { bar: "bg-accent-green", iconBg: "bg-accent-green/20 text-accent-green", glow: "bg-accent-green/20" },
  red: { bar: "bg-accent-red", iconBg: "bg-accent-red/20 text-accent-red", glow: "bg-accent-red/20" },
  amber: { bar: "bg-amber-500", iconBg: "bg-amber-500/20 text-amber-500", glow: "bg-amber-500/20" },
};

function GoalCard({ goal, onLog, onDelete, onEdit, loadingGoals }: {
  goal: DashboardGoalStreak;
  onLog?: (goalId: string, action: "increment" | "decrement") => void;
  onDelete?: (goalId: string) => void;
  onEdit?: (goalId: string, fields: Record<string, unknown>) => void;
  loadingGoals?: Set<string>;
}) {
  const [editing, setEditing] = useState(false);
  const isPerfect = goal.current_streak >= goal.target_days;
  const ratio = goal.target_days > 0 ? goal.current_streak / goal.target_days : 0;
  const colors = COLOR_MAP[goal.color] ?? COLOR_MAP.primary;
  const isLoading = loadingGoals?.has(goal.id);

  const statusLabel = isPerfect ? "Perfect" : ratio >= 0.5 ? "On Track" : "Keep Going";
  const statusColor = isPerfect ? "text-primary" : "text-accent-green";

  return (
    <>
    <div className="bg-gradient-to-br from-surface-dark to-black border border-slate-800 rounded-3xl p-5 relative">
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl ${colors.glow}`} />
      </div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
            <MaterialIcon name={goal.icon} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{goal.title}</h3>
            <p className="text-xs text-slate-400">{goal.subtitle}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-white">
            {goal.current_streak}
            <span className="text-slate-500 text-sm font-medium">/{goal.target_days}</span>
          </span>
          <span
            className={`text-[10px] font-bold ${statusColor} ${
              isPerfect ? "bg-primary/10" : "bg-accent-green/10"
            } px-2 py-0.5 rounded-full flex items-center gap-1`}
          >
            {isPerfect && (
              <MaterialIcon name="local_fire_department" className="text-[10px]" />
            )}
            {statusLabel}
          </span>
        </div>
      </div>
      <div className="flex gap-1 h-2 w-full mb-3">
        {Array.from({ length: goal.target_days }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${
              i < goal.current_streak ? colors.bar : "bg-slate-700"
            }`}
          />
        ))}
      </div>
      {onLog && (
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            {goal.reward_title && (
              <span className="text-xs text-slate-500">
                <MaterialIcon name="emoji_events" className="text-xs mr-0.5" />
                {goal.reward_title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(onEdit || onDelete) && (
              <ActionMenu
                direction="up"
                items={[
                  ...(onEdit
                    ? [{ label: "Edit", icon: "edit", onClick: () => setEditing(true) }]
                    : []),
                  ...(onDelete
                    ? [{ label: "Delete", icon: "delete", onClick: () => onDelete(goal.id), danger: true }]
                    : []),
                ]}
              />
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onLog(goal.id, "decrement"); }}
              disabled={goal.current_streak <= 0 || isLoading}
              className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <MaterialIcon name="remove" className="text-base" />
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onLog(goal.id, "increment"); }}
              disabled={isLoading}
              className={`h-8 px-4 rounded-full font-bold text-xs flex items-center gap-1 transition-all ${
                isLoading
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : `${colors.bar} text-white hover:opacity-90 shadow-lg`
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <><MaterialIcon name="add" className="text-sm" /> Check In</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
    {editing && (
      <EditModal
        open={editing}
        title="Edit Goal Streak"
        fields={[
          { key: "title", label: "Title", value: goal.title },
          { key: "subtitle", label: "Description", value: goal.subtitle },
          { key: "target_days", label: "Target Days", value: goal.target_days, type: "number" },
          { key: "reward_title", label: "Reward", value: goal.reward_title ?? "" },
        ] as EditField[]}
        onSave={(vals) => onEdit?.(goal.id, vals)}
        onClose={() => setEditing(false)}
      />
    )}
    </>
  );
}

export default function GoalStreaks({ goals, onLog, onDelete, onEdit, loadingGoals }: GoalStreaksProps) {
  if (goals.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1 mt-2">
        <h2 className="text-xl font-bold">Goal Streaks</h2>
        <button className="text-xs font-bold text-primary hover:text-white transition-colors">
          View All
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {goals.map((goal) => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            onLog={onLog} 
            onDelete={onDelete} 
            onEdit={onEdit}
            loadingGoals={loadingGoals}
          />
        ))}
      </div>
    </section>
  );
}
