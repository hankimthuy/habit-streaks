"use client";

/**
 * Frontend-only data layer backed by localStorage.
 *
 * `localFetch` mimics the former `/api/*` Next.js route handlers so components
 * can keep their fetch-style code. All data lives in the visitor's browser.
 */

import { ACHIEVEMENT_DEFINITIONS } from "@/lib/constants/leveling";
import { formatDateISO, vnToday } from "@/lib/date-utils";

const STORAGE_KEY = "flowstreaks:data:v1";
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

interface Habit {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: string;
  category: string;
  created_at: string;
}

interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  completed: boolean;
  created_at: string;
}

interface Store {
  profile: {
    id: string;
    display_name: string;
    email: string;
    avatar_url: string | null;
    level: number;
    xp: number;
    created_at: string;
  };
  goalStreaks: GoalStreak[];
  habits: Habit[];
  habitLogs: HabitLog[];
  achievements: {
    id: string;
    user_id: string;
    name: string;
    icon: string;
    description: string;
    unlocked: boolean;
    unlocked_at: string | null;
    created_at: string;
  }[];
  rewards: {
    id: string;
    user_id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    redeemed: boolean;
    valid_until: string;
    created_at: string;
  }[];
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

/** Demo data so a first-time visitor sees a populated app */
function seedStore(): Store {
  const now = new Date().toISOString();
  const today = vnToday();
  const unlocked = new Set(["First Step", "3-Day Spark", "Week Warrior", "Goal Setter", "Early Bird"]);
  const daysFromNow = (n: number) => new Date(Date.now() + n * 86400000).toISOString();

  const gymId = uid();
  const habitLogs: HabitLog[] = [];
  for (let i = 1; i <= 35; i++) {
    const date = addDays(today, -i);
    if ([0, 1, 3, 5].includes(new Date(date + "T00:00:00").getDay())) {
      habitLogs.push({ id: uid(), habit_id: gymId, user_id: USER_ID, date, completed: true, created_at: now });
    }
  }

  const streak = (s: Partial<GoalStreak> & Pick<GoalStreak, "title" | "mode">): GoalStreak => ({
    id: uid(),
    user_id: USER_ID,
    subtitle: "",
    icon: "local_fire_department",
    color: "primary",
    target_days: 7,
    current_streak: 0,
    longest_streak: 0,
    reward_title: null,
    start_date: null,
    end_date: null,
    last_checkin_date: null,
    created_at: now,
    ...s,
  });

  return {
    profile: {
      id: USER_ID,
      display_name: "Guest",
      email: "",
      avatar_url: null,
      level: 3,
      xp: 1350,
      created_at: now,
    },
    goalStreaks: [
      streak({
        title: "Morning Run",
        subtitle: "30 minutes every day",
        icon: "directions_run",
        color: "primary",
        mode: "daily",
        target_days: 30,
        current_streak: 5,
        longest_streak: 5,
        start_date: addDays(today, -5),
        end_date: addDays(today, 24),
      }),
      streak({
        title: "Drink Americano",
        subtitle: "7 times → Drink Milk Coffee",
        icon: "local_cafe",
        color: "amber",
        mode: "free",
        target_days: 7,
        current_streak: 1,
        longest_streak: 1,
        reward_title: "Drink Milk Coffee",
      }),
      streak({
        title: "No sugary drinks",
        icon: "no_drinks",
        color: "red",
        mode: "do_dont",
        target_days: 30,
        start_date: addDays(today, -3),
      }),
    ],
    habits: [
      {
        id: gymId,
        user_id: USER_ID,
        title: "Gym Workout",
        subtitle: "4 days/week — Mon, Wed, Fri, Sun",
        icon: "fitness_center",
        type: "positive",
        category: "Health",
        created_at: now,
      },
    ],
    habitLogs,
    achievements: ACHIEVEMENT_DEFINITIONS.map((a) => ({
      id: uid(),
      user_id: USER_ID,
      name: a.name,
      icon: a.icon,
      description: a.description,
      unlocked: unlocked.has(a.name),
      unlocked_at: unlocked.has(a.name) ? now : null,
      created_at: now,
    })),
    rewards: [
      { title: "Free Milk Coffee", description: "You hit your 7-day Americano goal!", icon: "local_cafe", unlocked: true, valid_until: daysFromNow(90) },
      { title: "Premium Dark Theme", description: "Reach Level 5 to unlock this exclusive theme", icon: "palette", unlocked: false, valid_until: daysFromNow(365) },
      { title: "Streak Shield", description: "Protect your streak for 1 day if you miss", icon: "shield", unlocked: false, valid_until: daysFromNow(180) },
    ].map((r) => ({ ...r, id: uid(), user_id: USER_ID, redeemed: false, created_at: now })),
  };
}

let memoryStore: Store | null = null;

function load(): Store {
  if (memoryStore) return memoryStore;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      memoryStore = JSON.parse(raw) as Store;
      return memoryStore;
    }
  } catch {
    // storage unavailable or corrupt — fall back to fresh demo data
  }
  memoryStore = seedStore();
  save(memoryStore);
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

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

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
  const habitsCount = store.habits.length || 1;

  const completedByDate: Record<string, number> = {};
  for (const log of store.habitLogs) {
    if (log.date >= startDate && log.date <= endDate && log.completed) {
      completedByDate[log.date] = (completedByDate[log.date] ?? 0) + 1;
    }
  }

  const days: { date: string; level: number; total: number; completed: number }[] = [];
  for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
    const completed = completedByDate[d] ?? 0;
    const ratio = completed / habitsCount;
    const level = completed === 0 ? 0 : ratio >= 1 ? 3 : ratio >= 0.5 ? 2 : 1;
    days.push({ date: d, level, total: habitsCount, completed });
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
  const completedToday = todayStreaks.filter((s) => s.current_streak >= s.target_days).length;

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
    const completed = active.filter(
      (s) => s.last_checkin_date && s.last_checkin_date >= rangeStart && s.last_checkin_date <= rangeEnd
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

function updateGoalStreak(store: Store, id: string, body: any): Response {
  const goal = store.goalStreaks.find((s) => s.id === id);
  if (!goal) return json({ error: "Goal streak not found" }, 404);

  const { action, current_streak, date } = body ?? {};
  let newStreak = goal.current_streak;
  let newLastCheckin = goal.last_checkin_date;

  if (action === "increment") {
    newStreak = Math.min(goal.current_streak + 1, goal.target_days);
    if (date) newLastCheckin = date;
  } else if (action === "decrement") {
    newStreak = Math.max(goal.current_streak - 1, 0);
    if (date && goal.last_checkin_date === date) newLastCheckin = null;
  } else if (typeof current_streak === "number") {
    newStreak = Math.max(0, Math.min(current_streak, goal.target_days));
  }

  goal.current_streak = newStreak;
  goal.longest_streak = Math.max(goal.longest_streak, newStreak);
  goal.last_checkin_date = newLastCheckin;
  save(store);
  return json(goal);
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
  if (path === "/api/profile" && method === "GET") {
    return json(store.profile);
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
    for (const log of store.habitLogs) {
      if (log.date < start || log.date > end) continue;
      summary[log.date] ??= { total: 0, completed: 0 };
      summary[log.date].total++;
      if (log.completed) summary[log.date].completed++;
    }
    return json(summary);
  }

  if (path === "/api/habits") {
    if (method === "GET") return json([...store.habits].reverse());
    if (method === "POST") {
      if (!body?.title) return json({ error: "Title is required" }, 400);
      const habit: Habit = {
        id: uid(),
        user_id: USER_ID,
        title: body.title,
        subtitle: body.subtitle ?? "",
        icon: body.icon ?? "check_circle",
        type: body.type ?? "positive",
        category: body.category ?? "",
        created_at: now,
      };
      store.habits.push(habit);
      save(store);
      return json(habit, 201);
    }
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
      save(store);
      return json(goal, 201);
    }
  }

  const goalMatch = path.match(/^\/api\/goal-streaks\/([^/]+)$/);
  if (goalMatch) {
    const id = decodeURIComponent(goalMatch[1]);
    if (method === "PATCH") return updateGoalStreak(store, id, body);
    if (method === "PUT") {
      const goal = store.goalStreaks.find((s) => s.id === id);
      if (!goal) return json({ error: "Goal streak not found" }, 404);
      const { id: _id, user_id: _uid, created_at: _c, ...fields } = body ?? {};
      Object.assign(goal, fields);
      save(store);
      return json(goal);
    }
    if (method === "DELETE") {
      store.goalStreaks = store.goalStreaks.filter((s) => s.id !== id);
      save(store);
      return json({ success: true });
    }
  }

  return json({ error: `Unknown endpoint: ${method} ${path}` }, 404);
}
