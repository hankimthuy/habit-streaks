"use client";

import Link from "next/link";
import MaterialIcon from "@/components/icons/MaterialIcon";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import Avatar from "@/components/profile/Avatar";
import { useProfile } from "@/lib/hooks/use-profile";

export default function Header() {
  const { profile } = useProfile();

  return (
    <header className="pt-8 pb-4 px-6 flex items-center justify-between sticky top-11 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-lg opacity-40 rounded-full" />
          <div className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-primary to-orange-600 text-white">
            <MaterialIcon name="local_fire_department" className="text-3xl" filled />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">
            Flow<span className="text-primary">Streaks</span>
          </h1>
          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span>Level {profile?.level ?? 1} 🔥</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Link href="/profile" className="relative group" aria-label="Profile">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm">
            <Avatar name={profile?.display_name} url={profile?.avatar_url} />
          </div>
        </Link>
      </div>
    </header>
  );
}
