// XP & Leveling System Constants
// Formula: level = floor(xp / XP_PER_LEVEL) + 1  (matches DB function award_xp)

export const XP_PER_LEVEL = 500;

/** Calculate level from total XP */
export function getLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/** XP progress within the current level */
export function getLevelProgress(xp: number): { current: number; target: number; percentage: number } {
  const current = xp % XP_PER_LEVEL;
  return {
    current,
    target: XP_PER_LEVEL,
    percentage: Math.round((current / XP_PER_LEVEL) * 100),
  };
}

// XP awards
export const XP_CHECKIN = 10;
export const XP_STREAK_7 = 50;
export const XP_STREAK_30 = 200;
export const XP_ACHIEVEMENT_UNLOCK = 100;

// Mystery Box Tiers
export interface MysteryBoxTier {
  name: string;
  icon: string;
  requiredLevel: number;
  streakDays: number;
  rewards: string[];
  description: string;
}

export const MYSTERY_BOX_TIERS: MysteryBoxTier[] = [
  {
    name: "Weekly Box",
    icon: "inventory_2",
    requiredLevel: 2,
    streakDays: 7,
    rewards: ["Custom Icon Pack", "Streak Shield (1 day)"],
    description: "Complete a 7-day streak to unlock",
  },
  {
    name: "Monthly Box",
    icon: "card_giftcard",
    requiredLevel: 5,
    streakDays: 30,
    rewards: ["Premium Theme", "Double XP (3 days)", "Exclusive Badge"],
    description: "Complete a 30-day streak to unlock",
  },
  {
    name: "Quarterly Box",
    icon: "diamond",
    requiredLevel: 10,
    streakDays: 90,
    rewards: ["Legendary Theme", "Profile Frame", "Mystery Badge", "Streak Shield (7 days)"],
    description: "Complete a 90-day streak to unlock",
  },
];

/** Get the next mystery box tier the user can work toward */
export function getNextMysteryBox(level: number, currentStreak: number): {
  tier: MysteryBoxTier;
  daysRemaining: number;
} | null {
  for (const tier of MYSTERY_BOX_TIERS) {
    if (currentStreak < tier.streakDays) {
      return {
        tier,
        daysRemaining: tier.streakDays - currentStreak,
      };
    }
  }
  // All tiers achieved — loop back to quarterly
  const last = MYSTERY_BOX_TIERS[MYSTERY_BOX_TIERS.length - 1];
  return {
    tier: last,
    daysRemaining: last.streakDays - (currentStreak % last.streakDays),
  };
}

// Achievement definitions (used for seeding)
export const ACHIEVEMENT_DEFINITIONS = [
  { name: "First Step", icon: "flag", description: "Complete your first check-in" },
  { name: "3-Day Spark", icon: "bolt", description: "Maintain a 3-day streak" },
  { name: "Week Warrior", icon: "military_tech", description: "Maintain a 7-day streak" },
  { name: "Two-Week Titan", icon: "shield", description: "Maintain a 14-day streak" },
  { name: "Monthly Master", icon: "workspace_premium", description: "Maintain a 30-day streak" },
  { name: "60-Day Legend", icon: "stars", description: "Maintain a 60-day streak" },
  { name: "100-Day Hero", icon: "emoji_events", description: "Maintain a 100-day streak" },
  { name: "Perfect Week", icon: "event_available", description: "Complete all habits for 7 consecutive days" },
  { name: "Perfect Month", icon: "calendar_month", description: "Complete all habits for 30 consecutive days" },
  { name: "Early Bird", icon: "wb_twilight", description: "Check in before 6 AM" },
  { name: "Night Owl", icon: "dark_mode", description: "Check in after 11 PM" },
  { name: "Weekend Warrior", icon: "surfing", description: "Complete all weekend habits for 4 weeks" },
  { name: "Habit Collector", icon: "collections_bookmark", description: "Create 5 different habits" },
  { name: "Goal Setter", icon: "track_changes", description: "Create your first goal streak" },
  { name: "Overachiever", icon: "rocket_launch", description: "Earn 1000 XP total" },
] as const;
