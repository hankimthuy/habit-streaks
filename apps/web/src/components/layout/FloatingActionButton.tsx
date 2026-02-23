"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-primary to-orange-500 rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center text-white z-20 hover:scale-105 transition-transform active:scale-95"
    >
      <MaterialIcon name="add" className="text-3xl" />
    </button>
  );
}
