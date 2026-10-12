"use client";

import { useTranslations } from "next-intl";
import Avatar from "@/components/profile/Avatar";

interface ProfileHeaderProps {
  avatarUrl?: string | null;
  displayName: string;
  username?: string;
  level: number;
}

export default function ProfileHeader({
  avatarUrl,
  displayName,
  username,
  level,
}: ProfileHeaderProps) {
  const t = useTranslations("Profile.header");

  return (
    <section className="pt-12 pb-8 flex flex-col items-center gap-4 relative">
      <div className="relative">
        <div className="w-32 h-32 rounded-full p-1 bg-primary">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-background-dark">
            <Avatar name={displayName} url={avatarUrl} className="text-4xl" />
          </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-background-dark whitespace-nowrap uppercase tracking-wider">
          {t("level", { level })}
        </div>
      </div>
      <div className="text-center mt-2">
        <h1 className="text-2xl font-black text-white">{displayName}</h1>
        <p className="text-slate-400 text-sm font-medium">{username}</p>
      </div>
    </section>
  );
}
