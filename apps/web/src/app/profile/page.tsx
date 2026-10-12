"use client";

import { useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import AppCredit from "@/components/layout/AppCredit";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import FireCollection from "@/components/profile/FireCollection";
import ProfileSettings from "@/components/profile/ProfileSettings";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useProfile } from "@/lib/hooks/use-profile";

export default function ProfilePage() {
  const { profile, save } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = async (name: string, username: string) => {
    if (await save(name, username)) setIsEditing(false);
  };

  return (
    <>
      <main className="flex-1 flex flex-col pb-24 overflow-y-auto">
        {profile ? (
          <>
            <ProfileHeader
              displayName={profile.display_name}
              username={profile.username}
              avatarUrl={profile.avatar_url}
              level={profile.level}
            />
            <div className="px-6 flex flex-col gap-6">
              <ProfileStats
                totalStreaks={profile.total_checkins}
                giftsEarned={profile.rewards_earned}
              />
              <FireCollection level={profile.level} />
              <ProfileSettings onEditProfile={() => setIsEditing(true)} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <AppCredit />
      </main>
      <BottomNav />
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveProfile}
        initialName={profile?.display_name ?? ""}
        initialUsername={profile?.username ?? ""}
      />
    </>
  );
}
