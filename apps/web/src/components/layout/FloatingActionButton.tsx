"use client";

import MaterialIcon from "@/components/icons/MaterialIcon";

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none z-20">
      <button
        onClick={onClick}
        className="absolute bottom-0 right-6 w-14 h-14 bg-gradient-to-r from-primary to-orange-500 rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center text-white pointer-events-auto hover:scale-105 transition-transform active:scale-95"
      >
        <MaterialIcon name="add" className="text-3xl" />
      </button>
    </div>
  );
}
