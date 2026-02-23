import BottomNav from "@/components/layout/BottomNav";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import FireCollection from "@/components/profile/FireCollection";
import ProfileSettings from "@/components/profile/ProfileSettings";

export default function ProfilePage() {
  return (
    <>
      <main className="flex-1 flex flex-col pb-24 overflow-y-auto">
        <ProfileHeader />
        <div className="px-6 flex flex-col gap-6">
          <ProfileStats />
          <FireCollection />
          <ProfileSettings />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
