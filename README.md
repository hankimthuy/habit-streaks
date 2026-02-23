# Habit Streaks PWA

A Progressive Web App for tracking daily habits, building streaks, and earning rewards. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Monorepo Structure

```
habit-streaks/
├── apps/
│   ├── web/                    # Next.js frontend (PWA)
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router pages
│   │   │   │   ├── page.tsx              # Dashboard
│   │   │   │   ├── achievements/page.tsx # Achievements & Rewards
│   │   │   │   └── daily-log/page.tsx    # Daily Checklist Log
│   │   │   ├── components/
│   │   │   │   ├── icons/          # MaterialIcon wrapper
│   │   │   │   ├── layout/         # Header, BottomNav, FAB
│   │   │   │   ├── dashboard/      # WeeklyCalendar, Stats, Tasks, GoalStreaks
│   │   │   │   ├── achievements/   # StreakCounter, Heatmap, Badges, Rewards, XP
│   │   │   │   └── daily-log/      # DailyLogHeader, HabitChecklist, CompletionCard
│   │   │   ├── lib/            # Supabase client config & types
│   │   │   └── middleware.ts   # Supabase auth session refresh
│   │   └── public/             # PWA manifest & icons
│   └── supabase/
│       └── migrations/         # PostgreSQL migration files
│           └── 00001_initial_schema.sql
└── package.json                # Root scripts
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- A [Supabase](https://supabase.com) project (free tier works)

### Installation

```bash
cd apps/web
npm install
```

### Environment Variables

Copy the example env file and fill in your Supabase project credentials:

```bash
cp apps/web/.env.example apps/web/.env.local
```

You need two values from your Supabase dashboard (Settings → API):
- `NEXT_PUBLIC_SUPABASE_URL` — Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `anon` / `public` key

### Database Setup

Run the SQL migration in your Supabase project:

1. Open the **SQL Editor** in your Supabase Dashboard
2. Paste the contents of `apps/supabase/migrations/00001_initial_schema.sql`
3. Click **Run**

Or use the Supabase CLI:

```bash
npx supabase db push
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Regenerate Database Types

After schema changes, regenerate the TypeScript types:

```bash
npm run db:types
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, PostgreSQL, Row Level Security)
- **Auth**: Supabase Auth with SSR cookie-based sessions via `@supabase/ssr`
- **PWA**: Web App Manifest, Service Worker ready
- **Font**: Plus Jakarta Sans (Google Fonts)
- **Icons**: Material Symbols Outlined (Google Fonts)

## Views

### Dashboard (`/`)
- Weekly calendar strip with day status indicators
- Stats overview cards (current streak, completion rate)
- Daily task checklist with positive/negative habit support
- Goal streaks with segmented progress bars

### Achievements (`/achievements`)
- Streak counter with glow effect
- Timeframe toggle (Week/Month/Year)
- Activity heatmap (contribution graph)
- Badges carousel (unlocked/locked states)
- Reward card with redeem functionality
- XP progress bar toward next level

### Daily Log (`/daily-log`)
- Date header with streak badge
- Daily progress bar
- Positive habits checklist ("The Do's")
- Negative habits checklist ("The Don'ts")
- Streak completion celebration card

## Supabase Backend

### PostgreSQL Tables
- `profiles` — User profiles (level, XP), auto-created on signup via trigger
- `habits` — Habit definitions (title, icon, positive/negative type)
- `habit_logs` — Daily habit completion logs (unique per habit+date)
- `goal_streaks` — Goal streak tracking with current/longest streak
- `achievements` — Unlocked achievements per user
- `rewards` — Earned rewards with redeem status

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only read/write their own data
- Achievements are read-only for users (managed server-side)
- Rewards allow user updates only for the `redeemed` field

### Database Functions
- `handle_new_user()` — Trigger that auto-creates a profile on auth signup
- `award_xp(user_id, amount)` — RPC function to award XP and recalculate level
