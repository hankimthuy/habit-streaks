"use client";

interface ProfileHeaderProps {
  avatarUrl?: string;
  displayName?: string;
  username?: string;
  level?: number;
}

export default function ProfileHeader({
  avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBmL0dE48NK0iF23YvzQ-gSNVkNQC36GFh8ySGyQZERGLjcnuar87QbmC42hxxOtcalZ2-Wk1IbYP588aKvsXdK4MTXgcXDGZcoZqZDsL7oZbd2HKU64dWMl5vOIJVCvlSo3eDhhHOEZqY12NkftXRMCX7whZmccBuXsL0XI1ftzf5lMZH0gSR_y9Eg3DXL1gVEh9Vzsuh762y6rqZXgzolg6SEQzJqxaIYt2brAG3RRAE-1GmjUkxiotUxPvOnOL_TxvhK2JNqZ0Ez",
  displayName = "Alex Rivera",
  username = "@habit_striker",
  level = 12,
}: ProfileHeaderProps) {
  return (
    <section className="pt-12 pb-8 flex flex-col items-center gap-4 relative">
      <div className="relative">
        <div className="w-32 h-32 rounded-full p-1 bg-primary">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-background-dark">
            <img
              alt="User Avatar"
              className="w-full h-full object-cover"
              src={avatarUrl}
            />
          </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-background-dark whitespace-nowrap uppercase tracking-wider">
          Level {level}
        </div>
      </div>
      <div className="text-center mt-2">
        <h1 className="text-2xl font-black text-white">{displayName}</h1>
        <p className="text-slate-400 text-sm font-medium">{username}</p>
      </div>
    </section>
  );
}
