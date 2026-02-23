"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

interface HeaderProps {
  userName?: string;
  level?: number;
  avatarUrl?: string;
  notificationCount?: number;
}

export default function Header({
  level = 12,
  avatarUrl,
  notificationCount = 3,
}: HeaderProps) {
  return (
    <header className="pt-8 pb-4 px-6 flex items-center justify-between sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-lg opacity-40 rounded-full" />
          <div className="relative bg-gradient-to-br from-primary to-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
            <MaterialIcon name="local_fire_department" className="text-white text-3xl" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">
            Habit<span className="text-primary">Streaks</span>
          </h1>
          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span>Level {level} 🔥</span>
          </div>
        </div>
      </div>
      <button className="relative group">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
          {avatarUrl ? (
            <img
              alt="User Avatar"
              className="w-full h-full object-cover"
              src={avatarUrl}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MaterialIcon name="person" className="text-slate-400" />
            </div>
          )}
        </div>
        {notificationCount > 0 && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-background-light dark:border-background-dark text-[10px] font-bold text-white">
            {notificationCount}
          </div>
        )}
      </button>
    </header>
  );
}
