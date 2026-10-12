"use client";

/**
 * Frontend-only data layer backed by localStorage.
 *
 * `localFetch` mimics the former `/api/*` Next.js route handlers so components
 * can keep their fetch-style code. All data lives in the visitor's browser.
 */

import {
  ACHIEVEMENT_DEFINITIONS,
  XP_ACHIEVEMENT_UNLOCK,
  XP_CHECKIN,
  XP_STREAK_30,
  XP_STREAK_7,
  getLevel,
} from "@/lib/constants/leveling";
import { formatDateISO, vnToday } from "@/lib/date-utils";

export const STORAGE_KEY = "flowstreaks:data:v2";
const USER_ID = "local-user";

type Mode = "daily" | "free" | "do_dont";

interface GoalStreak {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  target_days: number;
  current_streak: number;
  longest_streak: number;
  reward_title: string | null;
  start_date: string | null;
  end_date: string | null;
  mode: Mode;
  last_checkin_date: string | null;
  created_at: string;
}

/** One row per check-in; the source of truth for history-based stats */
interface Checkin {
  id: string;
  goal_id: string;
  date: string;
  created_at: string;
}

interface Achievement {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlocked_at: string | null;
  created_at: string;
}

interface Reward {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  redeemed: boolean;
  valid_until: string;
  created_at: string;
  /** Built-in unlock rule, or the goal whose completion granted it */
  rule?: "streak_7" | "level_5";
  /** Description shown once a rule-based reward unlocks */
  unlocked_description?: string;
  source_goal_id?: string;
}

interface Store {
  profile: {
    id: string;
    display_name: string;
    username: string;
    email: string;
    avatar_url: string | null;
    level: number;
    xp: number;
    created_at: string;
  };
  goalStreaks: GoalStreak[];
  checkins: Checkin[];
  goalsCreated: number;
  achievements: Achievement[];
  rewards: Reward[];
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function addDays(date: string, days: number): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  return formatDateISO(d);
}

function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 86400000).toISOString();
}

/** Demo data so a first-time visitor sees a populated app */
function seedStore(): Store {
  const now = new Date().toISOString();
  const today = vnToday();
  const checkins: Checkin[] = [];

  const streak = (
    s: Partial<GoalStreak> & Pick<GoalStreak, "title" | "mode">,
    pastCheckinDays: number
  ): GoalStreak => {
    const goal: GoalStreak = {
      id: uid(),
      user_id: USER_ID,
      subtitle: "",
      icon: "local_fire_department",
      color: "primary",
      target_days: 7,
      current_streak: pastCheckinDays,
      longest_streak: pastCheckinDays,
      reward_title: null,
      start_date: null,
      end_date: null,
      last_checkin_date: pastCheckinDays > 0 ? addDays(today, -1) : null,
      created_at: now,
      ...s,
    };
    for (let i = 1; i <= pastCheckinDays; i++) {
      const date = addDays(today, -i);
      checkins.push({ id: uid(), goal_id: goal.id, date, created_at: `${date}T08:00:00` });
    }
    return goal;
  };

  const goalStreaks = [
    streak(
      {
        title: "Morning Run",
        subtitle: "30 minutes every day",
        icon: "directions_run",
        mode: "daily",
        target_days: 30,
        start_date: addDays(today, -5),
        end_date: addDays(today, 24),
      },
      5
    ),
    streak(
      {
        title: "Drink Americano",
        subtitle: "7 times → Drink Milk Coffee",
        icon: "local_cafe",
        color: "amber",
        mode: "free",
        reward_title: "Drink Milk Coffee",
      },
      1
    ),
    streak(
      {
        title: "No sugary drinks",
        icon: "no_drinks",
        color: "red",
        mode: "do_dont",
        target_days: 30,
        start_date: addDays(today, -2),
      },
      2
    ),
  ];

  const store: Store = {
    profile: {
      id: USER_ID,
      display_name: "Guest",
      username: "@guest",
      email: "",
      avatar_url: null,
      level: 1,
      xp: checkins.length * XP_CHECKIN,
      created_at: now,
    },
    goalStreaks,
    checkins,
    goalsCreated: goalStreaks.length,
    achievements: ACHIEVEMENT_DEFINITIONS.map((a) => ({
      id: uid(),
      user_id: USER_ID,
      name: a.name,
      icon: a.icon,
      description: a.description,
      unlocked: false,
      unlocked_at: null,
      created_at: now,
    })),
    rewards: [
      {
        title: "Streak Shield",
        description: "Reach a 7-day streak to unlock",
        unlocked_description: "Protect your streak for 1 day if you miss",
        icon: "shield",
        rule: "streak_7" as const,
      },
      {
        title: "Premium Dark Theme",
        description: "Reach Level 5 to unlock this exclusive theme",
        unlocked_description: "Exclusive theme for reaching Level 5",
        icon: "palette",
        rule: "level_5" as const,
      },
    ].map((r) => ({
      ...r,
      id: uid(),
      user_id: USER_ID,
      unlocked: false,
      redeemed: false,
      valid_until: daysFromNow(365),
      created_at: now,
    })),
  };
  evaluateProgress(store);
  return store;
}

// ── Progress rules ─────────────────────────────────────────────

/** Daily and do/don't streaks break when a whole day passes without a check-in */
function breakMissedStreaks(store: Store): boolean {
  const yesterday = addDays(vnToday(), -1);
  let changed = false;
  for (const goal of store.goalStreaks) {
    if (goal.mode === "free" || goal.current_streak === 0) continue;
    if (!goal.last_checkin_date || goal.last_checkin_date < yesterday) {
      goal.current_streak = 0;
      changed = true;
    }
  }
  return changed;
}

/** Goals that expect a check-in on a given date (free goals have no schedule) */
function scheduledGoals(store: Store, date: string): GoalStreak[] {
  return store.goalStreaks.filter((s) => {
    if (s.mode === "free") return false;
    if (s.mode === "daily" && (!s.start_date || !s.end_date)) return false;
    if (s.start_date && date < s.start_date) return false;
    if (s.end_date && date > s.end_date) return false;
    return true;
  });
}

function dailySummary(store: Store, date: string) {
  const scheduled = scheduledGoals(store, date);
  const checkedIds = new Set(store.checkins.filter((c) => c.date === date).map((c) => c.goal_id));
  return {
    total: scheduled.length,
    completed: scheduled.filter((g) => checkedIds.has(g.id)).length,
    anyCheckin: checkedIds.size > 0,
  };
}

function isPerfectDay(store: Store, date: string): boolean {
  const { total, completed } = dailySummary(store, date);
  return total > 0 && completed === total;
}

/** Longest run of consecutive perfect days ending today (or yesterday) */
function perfectDayRun(store: Store): number {
  let date = vnToday();
  if (!isPerfectDay(store, date)) date = addDays(date, -1);
  let run = 0;
  while (isPerfectDay(store, date)) {
    run++;
    date = addDays(date, -1);
  }
  return run;
}

/** Weekends (Sat + Sun) with at least one check-in on each day */
function activeWeekends(store: Store): number {
  const dates = new Set(store.checkins.map((c) => c.date));
  let count = 0;
  for (const date of Array.from(dates)) {
    if (new Date(date + "T00:00:00").getDay() === 6 && dates.has(addDays(date, 1))) count++;
  }
  return count;
}

function checkinHour(c: Checkin): number {
  return new Date(c.created_at).getHours();
}

const ACHIEVEMENT_RULES: Record<string, (s: Store) => boolean> = {
  "First Step": (s) => s.checkins.length >= 1,
  "3-Day Spark": (s) => bestStreak(s) >= 3,
  "Week Warrior": (s) => bestStreak(s) >= 7,
  "Two-Week Titan": (s) => bestStreak(s) >= 14,
  "Monthly Master": (s) => bestStreak(s) >= 30,
  "60-Day Legend": (s) => bestStreak(s) >= 60,
  "100-Day Hero": (s) => bestStreak(s) >= 100,
  "Perfect Week": (s) => perfectDayRun(s) >= 7,
  "Perfect Month": (s) => perfectDayRun(s) >= 30,
  "Early Bird": (s) => s.checkins.some((c) => checkinHour(c) < 6),
  "Night Owl": (s) => s.checkins.some((c) => checkinHour(c) >= 23),
  "Weekend Warrior": (s) => activeWeekends(s) >= 4,
  "Habit Collector": (s) => s.goalsCreated >= 5,
  "Goal Setter": (s) => s.goalsCreated >= 1,
  Overachiever: (s) => s.profile.xp >= 1000,
};

function bestStreak(store: Store): number {
  return Math.max(0, ...store.goalStreaks.map((g) => g.longest_streak));
}

/**
 * Unlock achievements and rewards whose conditions are now met.
 * Returns the names of newly unlocked items so the UI can celebrate them.
 */
function evaluateProgress(store: Store): string[] {
  const unlocked: string[] = [];
  const now = new Date().toISOString();

  // Loop because achievement XP can itself unlock XP-based items
  for (let pass = 0; pass < 3; pass++) {
    let changed = false;
    store.profile.level = getLevel(store.profile.xp);

    for (const a of store.achievements) {
      if (a.unlocked || !ACHIEVEMENT_RULES[a.name]?.(store)) continue;
      a.unlocked = true;
      a.unlocked_at = now;
      store.profile.xp += XP_ACHIEVEMENT_UNLOCK;
      unlocked.push(a.name);
      changed = true;
    }

    for (const r of store.rewards) {
      if (r.unlocked) continue;
      const met =
        (r.rule === "streak_7" && bestStreak(store) >= 7) ||
        (r.rule === "level_5" && getLevel(store.profile.xp) >= 5);
      if (!met) continue;
      r.unlocked = true;
      r.description = r.unlocked_description ?? r.description;
      r.valid_until = daysFromNow(90);
      unlocked.push(r.title);
      changed = true;
    }

    for (const g of store.goalStreaks) {
      if (!g.reward_title || g.current_streak < g.target_days) continue;
      if (store.rewards.some((r) => r.source_goal_id === g.id)) continue;
      store.rewards.unshift({
        id: uid(),
        user_id: USER_ID,
        title: g.reward_title,
        description: `You completed "${g.title}"!`,
        icon: g.icon,
        unlocked: true,
        redeemed: false,
        valid_until: daysFromNow(90),
        created_at: now,
        source_goal_id: g.id,
      });
      unlocked.push(g.reward_title);
      changed = true;
    }

    if (!changed) break;
  }

  store.profile.level = getLevel(store.profile.xp);
  return unlocked;
}

// ── Storage ────────────────────────────────────────────────────

let memoryStore: Store | null = null;

function load(): Store {
  if (!memoryStore) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) memoryStore = JSON.parse(raw) as Store;
    } catch {
      // storage unavailable or corrupt — fall back to fresh demo data
    }
  }
  if (!memoryStore) {
    memoryStore = seedStore();
    save(memoryStore);
  }
  if (breakMissedStreaks(memoryStore)) save(memoryStore);
  return memoryStore;
}

function save(store: Store) {
  memoryStore = store;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // keep in-memory copy only
  }
}

/** Wipe everything and start again from the demo seed */
export function resetLocalData() {
  memoryStore = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ── Read models ────────────────────────────────────────────────

function rangeFor(timeframe: string): [string, string] {
  const now = new Date();
  if (timeframe === "week") {
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() + (day === 0 ? -6 : 1 - day));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return [formatDateISO(monday), formatDateISO(sunday)];
  }
  if (timeframe === "year") {
    const yearAgo = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1);
    yearAgo.setDate(yearAgo.getDate() + 1);
    return [formatDateISO(yearAgo), formatDateISO(now)];
  }
  return [
    formatDateISO(new Date(now.getFullYear(), now.getMonth(), 1)),
    formatDateISO(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  ];
}

function getActivity(store: Store, timeframe: string) {
  const [startDate, endDate] = rangeFor(timeframe);

  const days: { date: string; level: number; total: number; completed: number }[] = [];
  for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
    const { total, completed, anyCheckin } = dailySummary(store, d);
    let level = 0;
    if (total > 0 && completed > 0) {
      const ratio = completed / total;
      level = ratio >= 1 ? 3 : ratio >= 0.5 ? 2 : 1;
    } else if (anyCheckin) {
      level = 1;
    }
    days.push({ date: d, level, total, completed });
  }

  const totalDays = days.length;
  const activeDays = days.filter((d) => d.level > 0).length;
  return {
    timeframe,
    startDate,
    endDate,
    days,
    stats: {
      totalDays,
      activeDays,
      perfectDays: days.filter((d) => d.level === 3).length,
      coverageRate: totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0,
    },
  };
}

function getDashboard(store: Store, date: string) {
  const all = [...store.goalStreaks].sort((a, b) => a.created_at.localeCompare(b.created_at));

  const todayStreaks = all.filter(
    (s) => s.mode === "daily" && !!s.start_date && !!s.end_date && date >= s.start_date && date <= s.end_date
  );
  const doDonts = all.filter(
    (s) =>
      s.mode === "do_dont" &&
      !(s.start_date && date < s.start_date) &&
      !(s.end_date && date > s.end_date)
  );

  const totalToday = todayStreaks.length;
  const completedToday = todayStreaks.filter((s) => s.last_checkin_date === date).length;

  return {
    todayStreaks,
    goalStreaks: all.filter((s) => s.mode === "free"),
    doDonts,
    stats: {
      currentStreak: all.length > 0 ? Math.max(...all.map((s) => s.current_streak)) : 0,
      completionRate: totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0,
      completedToday,
      totalToday,
    },
  };
}

function getInsights(store: Store, date: string) {
  const [y, m, d] = date.split("-").map((n) => parseInt(n, 10));
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  const weekStart = new Date(dateObj);
  weekStart.setUTCDate(dateObj.getUTCDate() - ((dateObj.getUTCDay() + 6) % 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
  const iso = (x: Date) => x.toISOString().split("T")[0];
  const [yearStr, monthStr] = date.split("-");

  const streaks = store.goalStreaks.filter((s) => s.mode === "daily");
  const computeStats = (rangeStart: string, rangeEnd: string) => {
    const active = streaks.filter(
      (s) => s.start_date && s.end_date && s.start_date <= rangeEnd && s.end_date >= rangeStart
    );
    const completed = active.filter((s) =>
      store.checkins.some((c) => c.goal_id === s.id && c.date >= rangeStart && c.date <= rangeEnd)
    ).length;
    const total = active.length;
    return { total, completed, failed: total - completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  return {
    day: computeStats(date, date),
    week: computeStats(iso(weekStart), iso(weekEnd)),
    month: computeStats(`${yearStr}-${monthStr}-01`, iso(new Date(Date.UTC(y, m, 0)))),
    year: computeStats(`${yearStr}-01-01`, `${yearStr}-12-31`),
  };
}

// ── Mutations ──────────────────────────────────────────────────

function checkInGoal(store: Store, id: string, body: any): Response {
  const goal = store.goalStreaks.find((s) => s.id === id);
  if (!goal) return json({ error: "Goal streak not found" }, 404);

  const { action, current_streak } = body ?? {};
  const date: string = body?.date ?? vnToday();
  const before = goal.current_streak;

  if (action === "increment") {
    // Scheduled goals count once per day; free goals allow catch-up check-ins
    if (goal.mode !== "free" && goal.last_checkin_date === date) {
      return json({ error: "Already checked in today" }, 409);
    }
    if (goal.current_streak >= goal.target_days) {
      return json({ error: "Goal already completed" }, 409);
    }
    goal.current_streak += 1;
    goal.last_checkin_date = date;
    store.checkins.push({ id: uid(), goal_id: goal.id, date, created_at: new Date().toISOString() });
    store.profile.xp += XP_CHECKIN;
    if (before < 7 && goal.current_streak >= 7) store.profile.xp += XP_STREAK_7;
    if (before < 30 && goal.current_streak >= 30) store.profile.xp += XP_STREAK_30;
  } else if (action === "decrement") {
    if (goal.current_streak === 0) return json(goal);
    // Undo the most recent check-in on this date (or the latest one for free goals)
    let idx = -1;
    store.checkins.forEach((c, i) => {
      if (c.goal_id === goal.id && (goal.mode === "free" || c.date === date)) idx = i;
    });
    if (idx === -1) return json({ error: "Nothing to undo" }, 409);
    store.checkins.splice(idx, 1);
    goal.current_streak -= 1;
    const remaining = store.checkins.filter((c) => c.goal_id === goal.id).map((c) => c.date).sort();
    goal.last_checkin_date = remaining[remaining.length - 1] ?? null;
    store.profile.xp = Math.max(0, store.profile.xp - XP_CHECKIN);
    if (before >= 7 && goal.current_streak < 7) store.profile.xp = Math.max(0, store.profile.xp - XP_STREAK_7);
    if (before >= 30 && goal.current_streak < 30) store.profile.xp = Math.max(0, store.profile.xp - XP_STREAK_30);
  } else if (typeof current_streak === "number") {
    goal.current_streak = Math.max(0, Math.min(current_streak, goal.target_days));
  }

  goal.longest_streak = Math.max(goal.longest_streak, goal.current_streak);
  const unlocked = evaluateProgress(store);
  save(store);
  return json({ ...goal, unlocked });
}

/** Drop-in replacement for `fetch("/api/...")` that reads/writes localStorage */
export async function localFetch(input: string, init?: RequestInit): Promise<Response> {
  const url = new URL(input, "http://local");
  const path = url.pathname.replace(/\/+$/, "");
  const params = url.searchParams;
  const method = (init?.method ?? "GET").toUpperCase();
  const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
  const store = load();
  const now = new Date().toISOString();

  if (path === "/api/achievements" && method === "GET") {
    return json([...store.achievements].sort((a, b) => Number(b.unlocked) - Number(a.unlocked)));
  }
  if (path === "/api/rewards" && method === "GET") {
    return json([...store.rewards].sort((a, b) => Number(b.unlocked) - Number(a.unlocked)));
  }
  const rewardMatch = path.match(/^\/api\/rewards\/([^/]+)$/);
  if (rewardMatch && method === "PATCH") {
    const reward = store.rewards.find((r) => r.id === decodeURIComponent(rewardMatch[1]));
    if (!reward) return json({ error: "Reward not found" }, 404);
    if (!reward.unlocked) return json({ error: "Reward is still locked" }, 409);
    reward.redeemed = true;
    save(store);
    return json(reward);
  }

  if (path === "/api/profile") {
    if (method === "GET") {
      return json({
        ...store.profile,
        total_checkins: store.checkins.length,
        rewards_earned: store.rewards.filter((r) => r.unlocked).length,
        achievements_unlocked: store.achievements.filter((a) => a.unlocked).length,
      });
    }
    if (method === "PUT") {
      const name = String(body?.display_name ?? "").trim();
      let username = String(body?.username ?? "").trim();
      if (!name) return json({ error: "Name is required" }, 400);
      if (username && !username.startsWith("@")) username = `@${username}`;
      store.profile.display_name = name.slice(0, 40);
      store.profile.username = username.slice(0, 30);
      save(store);
      return json(store.profile);
    }
  }

  if (path === "/api/activity" && method === "GET") {
    return json(getActivity(store, params.get("timeframe") || "month"));
  }
  if (path === "/api/dashboard" && method === "GET") {
    const date = params.get("date");
    if (!date) return json({ error: "date param required" }, 400);
    return json(getDashboard(store, date));
  }
  if (path === "/api/insights" && method === "GET") {
    return json(getInsights(store, params.get("date") ?? vnToday()));
  }
  if (path === "/api/habit-logs/week" && method === "GET") {
    const start = params.get("start");
    const end = params.get("end");
    if (!start || !end) return json({ error: "start and end query params required" }, 400);
    const summary: Record<string, { total: number; completed: number }> = {};
    for (let d = start; d <= end; d = addDays(d, 1)) {
      const { total, completed } = dailySummary(store, d);
      if (total > 0) summary[d] = { total, completed };
    }
    return json(summary);
  }

  if (path === "/api/goal-streaks") {
    if (method === "GET") {
      return json([...store.goalStreaks].sort((a, b) => b.created_at.localeCompare(a.created_at)));
    }
    if (method === "POST") {
      if (!body?.title) return json({ error: "Title is required" }, 400);
      const goal: GoalStreak = {
        id: uid(),
        user_id: USER_ID,
        title: body.title,
        subtitle: body.subtitle ?? "",
        icon: body.icon ?? "local_fire_department",
        color: body.color ?? "primary",
        target_days: body.target_days ?? 7,
        current_streak: 0,
        longest_streak: 0,
        reward_title: body.reward_title ?? null,
        start_date: body.start_date ?? null,
        end_date: body.end_date ?? null,
        mode: body.mode ?? "daily",
        last_checkin_date: null,
        created_at: now,
      };
      store.goalStreaks.push(goal);
      store.goalsCreated += 1;
      const unlocked = evaluateProgress(store);
      save(store);
      return json({ ...goal, unlocked }, 201);
    }
  }

  const goalMatch = path.match(/^\/api\/goal-streaks\/([^/]+)$/);
  if (goalMatch) {
    const id = decodeURIComponent(goalMatch[1]);
    if (method === "PATCH") return checkInGoal(store, id, body);
    if (method === "PUT") {
      const goal = store.goalStreaks.find((s) => s.id === id);
      if (!goal) return json({ error: "Goal streak not found" }, 404);
      const { id: _id, user_id: _uid, created_at: _c, current_streak: _cs, longest_streak: _ls, last_checkin_date: _l, ...fields } = body ?? {};
      Object.assign(goal, fields);
      save(store);
      return json(goal);
    }
    if (method === "DELETE") {
      store.goalStreaks = store.goalStreaks.filter((s) => s.id !== id);
      store.checkins = store.checkins.filter((c) => c.goal_id !== id);
      save(store);
      return json({ success: true });
    }
  }

  return json({ error: `Unknown endpoint: ${method} ${path}` }, 404);
}
