"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

interface SettingsItem {
  icon: string;
  label: string;
  iconBg: string;
  labelColor?: string;
  rightText?: string;
  onClick?: () => void;
}

interface ProfileSettingsProps {
  onSignOut?: () => void;
}

export default function ProfileSettings({ onSignOut }: ProfileSettingsProps) {
  const items: SettingsItem[] = [
    {
      icon: "person",
      label: "Edit Profile",
      iconBg: "bg-accent-blue",
    },
    {
      icon: "notifications",
      label: "Notification Settings",
      iconBg: "bg-accent-blue",
    },
    {
      icon: "palette",
      label: "App Theme",
      iconBg: "bg-accent-blue",
      rightText: "Dark",
    },
    {
      icon: "logout",
      label: "Sign Out",
      iconBg: "bg-accent-red",
      labelColor: "text-accent-red",
      onClick: onSignOut,
    },
  ];

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-bold mb-2">Settings</h2>
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
            {item.label !== "Sign Out" && (
              <div className="flex items-center gap-2">
                {item.rightText && (
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {item.rightText}
                  </span>
                )}
                <MaterialIcon name="chevron_right" className="text-slate-600" />
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
