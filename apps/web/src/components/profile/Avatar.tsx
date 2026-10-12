interface AvatarProps {
  name?: string;
  url?: string | null;
  className?: string;
}

/** Profile picture, falling back to the name's initials */
export default function Avatar({ name = "", url, className = "" }: AvatarProps) {
  if (url) {
    return <img alt={name} src={url} className={`w-full h-full object-cover ${className}`} />;
  }
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-orange-600 font-black text-white ${className}`}
    >
      {initials || "?"}
    </div>
  );
}
