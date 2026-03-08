"use client";

import { useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import FireCollection from "@/components/profile/FireCollection";
import ProfileSettings from "@/components/profile/ProfileSettings";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "Hàn Kim Thủy",
    username: "@thuyhankim",
    avatar: "https://i.pravatar.cc/150?img=47",
    streaks: 15,
    rewards: 5,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (name: string, username: string) => {
    setUserData((prev) => ({ ...prev, name, username }));
    setIsEditing(false);
  };

  return (
    <>
      <main className="flex-1 flex flex-col pb-24 overflow-y-auto">
        <ProfileHeader
          displayName={userData.name}
          username={userData.username}
          avatarUrl={userData.avatar}
        />
        <div className="px-6 flex flex-col gap-6">
          <ProfileStats
            totalStreaks={userData.streaks}
            giftsEarned={userData.rewards}
          />
          <FireCollection />
          <ProfileSettings onEditProfile={() => setIsEditing(true)} />
        </div>
      </main>
      <BottomNav />
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveProfile}
        initialName={userData.name}
        initialUsername={userData.username}
      />
    </>
  );
}
