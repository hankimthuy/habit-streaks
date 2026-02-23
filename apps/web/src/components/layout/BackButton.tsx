"use client";

import { useRouter } from "next/navigation";
import MaterialIcon from "@/components/icons/MaterialIcon";

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = "" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center text-slate-400 hover:text-white transition-colors ${className}`}
    >
      <MaterialIcon name="chevron_left" />
    </button>
  );
}
