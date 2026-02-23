"use client";

import { useState, useRef, useEffect } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";

export interface ActionMenuItem {
  label: string;
  icon: string;
  onClick: () => void;
  danger?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  direction?: "down" | "up";
}

export default function ActionMenu({ items, direction = "down" }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
      >
        <MaterialIcon name="more_vert" className="text-lg" />
      </button>
      {open && (
        <div className={`absolute right-0 z-50 min-w-[140px] bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden ${direction === "up" ? "bottom-10" : "top-8"}`}>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                item.onClick();
              }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                item.danger
                  ? "text-accent-red hover:bg-accent-red/10"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              <MaterialIcon name={item.icon} className="text-base" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
