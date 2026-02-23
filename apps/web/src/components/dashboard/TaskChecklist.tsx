"use client";

import { useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import ActionMenu from "@/components/ui/ActionMenu";
import EditModal, { type EditField } from "@/components/ui/EditModal";
import type { DashboardTask } from "@/lib/hooks/use-dashboard";

interface TaskChecklistProps {
  tasks: DashboardTask[];
  onToggle: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
  onEdit?: (habitId: string, fields: Record<string, unknown>) => void;
}

function TaskCard({
  task,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: DashboardTask;
  onToggle: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
  onEdit?: (habitId: string, fields: Record<string, unknown>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const isCompleted = task.completed;
  const isNegative = task.type === "negative";

  const iconBgColor = isCompleted
    ? "bg-accent-green/20"
    : isNegative
      ? "bg-accent-red/20"
      : "bg-primary/20";

  const iconTextColor = isCompleted
    ? "text-accent-green"
    : isNegative
      ? "text-accent-red"
      : "text-primary";

  const hoverBorder = isNegative
    ? "hover:border-accent-red/50"
    : "hover:border-primary/50";

  const editFields: EditField[] = [
    { key: "title", label: "Habit Name", value: task.title },
    { key: "subtitle", label: "Description", value: task.subtitle },
    { key: "category", label: "Category", value: task.category },
  ];

  return (
    <>
    <div
      onClick={() => onToggle(task.id)}
      className={`group flex items-center p-4 rounded-3xl bg-surface-dark border border-slate-700/50 ${hoverBorder} transition-colors cursor-pointer relative overflow-hidden`}
    >
      <div className="flex-shrink-0 mr-4">
        <div
          className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center ${iconTextColor} ${
            !isCompleted ? "group-hover:scale-110 transition-transform" : ""
          }`}
        >
          <MaterialIcon name={task.icon} filled={isCompleted} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4
          className={`font-bold ${
            isCompleted
              ? "text-slate-200 line-through decoration-slate-500"
              : "text-white"
          }`}
        >
          {task.title}
        </h4>
        <p className={`text-xs ${isCompleted ? "text-slate-500" : "text-slate-400"}`}>
          {task.subtitle}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {isCompleted ? (
          <div className="w-8 h-8 rounded-full bg-accent-green flex items-center justify-center text-white shadow-lg shadow-accent-green/20">
            <MaterialIcon name="check" className="text-lg font-bold" />
          </div>
        ) : (
          <div
            className={`w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center text-transparent ${
              isNegative
                ? "hover:border-accent-red hover:text-accent-red hover:bg-accent-red/10"
                : "hover:border-primary hover:text-primary"
            } transition-all`}
          >
            <MaterialIcon
              name={isNegative ? "close" : "check"}
              className="text-lg"
            />
          </div>
        )}
        {(onDelete || onEdit) && (
          <ActionMenu
            items={[
              ...(onEdit
                ? [{ label: "Edit", icon: "edit", onClick: () => setEditing(true) }]
                : []),
              ...(onDelete
                ? [{ label: "Delete", icon: "delete", onClick: () => onDelete(task.id), danger: true }]
                : []),
            ]}
          />
        )}
      </div>
    </div>
    {editing && (
      <EditModal
        open={editing}
        title="Edit Habit"
        fields={editFields}
        onSave={(vals) => onEdit?.(task.id, vals)}
        onClose={() => setEditing(false)}
      />
    )}
    </>
  );
}

export default function TaskChecklist({ tasks = [], onToggle, onDelete, onEdit }: TaskChecklistProps) {
  const completedCount = tasks.filter((t) => t.completed).length;

  if (tasks.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Today's Grind
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        </h2>
        <span className="text-xs font-bold bg-slate-800 px-3 py-1 rounded-full text-slate-300">
          {completedCount}/{tasks.length} Done
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </section>
  );
}
