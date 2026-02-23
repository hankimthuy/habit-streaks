"use client";

interface MaterialIconProps {
  name: string;
  filled?: boolean;
  className?: string;
}

export default function MaterialIcon({
  name,
  filled = false,
  className = "",
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined leading-none inline-flex items-center justify-center ${filled ? "filled" : ""} ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
