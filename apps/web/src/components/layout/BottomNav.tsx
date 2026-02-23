"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MaterialIcon from "@/components/icons/MaterialIcon";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/stats", icon: "bar_chart", label: "Stats" },
  { href: "/achievements", icon: "emoji_events", label: "Awards" },
  { href: "/profile", icon: "person", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 w-full bg-surface-dark border-t border-slate-800 px-6 py-4 z-30">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 group ${
                isActive
                  ? "text-primary"
                  : "text-slate-500 hover:text-slate-300 transition-colors"
              }`}
            >
              <MaterialIcon
                name={item.icon}
                filled={isActive}
                className="text-2xl group-hover:scale-110 transition-transform"
              />
              <span
                className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
