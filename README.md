# Habit Streaks PWA

A Progressive Web App for tracking daily habits, building streaks, and earning rewards. Built with Next.js, TypeScript, and Tailwind CSS.

This is a **frontend-only demo**: there is no backend or database. All data is stored in the browser's `localStorage`, and first-time visitors get sample data to play with.

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
│   │   │   ├── lib/            # localStorage data layer (local-api.ts), hooks, utils
│   │   │   └── middleware.ts   # Default locale cookie
│   │   └── public/             # PWA manifest & icons
└── package.json                # Root scripts
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
cd apps/web
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Data**: Browser `localStorage` (no backend). Clear site data to reset to the demo seed.
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

## Copyright

© FlowStreaks. Designed & built by [Hàn Kim Thủy](https://hankimthuy.com/en/connect).
