"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

interface CreateTypeSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (mode: "daily" | "free") => void;
}

export default function CreateTypeSelector({
  open,
  onClose,
  onSelect,
}: CreateTypeSelectorProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface-dark rounded-t-3xl p-6 pb-8 animate-slide-up">
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create New Streak</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <MaterialIcon name="close" className="text-lg" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* Daily Streak option */}
          <button
            onClick={() => onSelect("daily")}
            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800 border border-slate-700 hover:border-primary/50 transition-colors text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <MaterialIcon name="calendar_month" className="text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-base">Daily Streak</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Set a date range and check in daily to build your streak
              </p>
            </div>
            <MaterialIcon name="chevron_right" className="text-slate-500 text-xl" />
          </button>

          {/* Free Check-in option */}
          <button
            onClick={() => onSelect("free")}
            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition-colors text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <MaterialIcon name="bolt" className="text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-base">Free Check-in</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                No schedule — check in whenever you complete a milestone
              </p>
            </div>
            <MaterialIcon name="chevron_right" className="text-slate-500 text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
