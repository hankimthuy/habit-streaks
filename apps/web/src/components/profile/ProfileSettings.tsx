"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/layout/ThemeContext";
import { AUTHOR_URL } from "@/components/layout/AppCredit";
import { resetLocalData } from "@/lib/local-api";

interface SettingsItem {
  icon: string;
  label: string;
  iconBg: string;
  labelColor?: string;
  rightText?: string;
  onClick?: () => void;
}

interface ProfileSettingsProps {
  onEditProfile?: () => void;
}

export default function ProfileSettings({ onEditProfile }: ProfileSettingsProps) {
  const t = useTranslations("Profile.settings");
  const { theme, toggleTheme } = useTheme();

  const items: SettingsItem[] = [
    {
      icon: "person",
      label: t("editProfile"),
      iconBg: "bg-accent-blue",
      onClick: onEditProfile,
    },
    {
      icon: "palette",
      label: t("appTheme"),
      iconBg: "bg-accent-blue",
      rightText: theme === "dark" ? t("themeDark") : t("themeLight"),
      onClick: toggleTheme,
    },
    {
      icon: "favorite",
      label: t("aboutCreator"),
      iconBg: "bg-accent-blue",
      onClick: () => window.open(AUTHOR_URL, "_blank", "noopener,noreferrer"),
    },
    {
      icon: "restart_alt",
      label: t("resetData"),
      iconBg: "bg-accent-red",
      labelColor: "text-accent-red",
      onClick: () => {
        if (window.confirm(t("resetConfirm"))) {
          resetLocalData();
          window.location.href = "/";
        }
      },
    },
  ];

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-bold mb-2">{t("title")}</h2>
      <div className="bg-surface-dark rounded-3xl overflow-hidden divide-y divide-slate-800">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center`}
              >
                <MaterialIcon name={item.icon} className="text-white text-xl" />
              </div>
              <span className={`font-bold ${item.labelColor ?? "text-white"}`}>
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {item.rightText && (
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {item.rightText}
                </span>
              )}
              <MaterialIcon name="chevron_right" className="text-slate-600" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
