# System Architecture & Design Principles

## 1. System Overview
**Product Name:** FlowStreaks
**Architecture Paradigm:** Life OS Ecosystem

FlowStreaks shifts the architectural focus from simple, isolated time-series data (streaks) to a complex relational model that accounts for user capacity, context, and daily realities.

## 2. Core Domain Models

### 2.1 Capacity & Energy Management
- **Daily Capacity Engine:** Calculates available energy based on prior activities, sleep, and external stressors.
- **Context Nodes:** Entities representing life events (e.g., "Workout", "High-Stress Meeting") that dynamically adjust the expectations for habitual tasks.

### 2.2 The Flow Engine
- Replaces the traditional "Streak Engine."
- Evaluates success not by unbroken chains, but by the ratio of completed tasks relative to available capacity and daily context.
- **Grace Periods & Context Adjustments:** Built-in logic to handle days with extreme cognitive or physical load without breaking the user's visual sense of momentum.

## 3. UI/UX Architecture Principles
- **Cognitive Load Reduction:** The interface must surface only what matters *right now*. Minimize context switching.
- **Visual Accomplishment:** UI elements should aggregate daily efforts to provide a composite "Peace of Mind" score or visual representation at the end of the day.
- **Pressure-Free Reality:** Design language must avoid red warnings or punitive UX for missed habits. Focus on calm and flowing UI elements.

## 4. Technical Stack Implications
- **State Management:** Requires robust global state to correlate habits, calendar events, and energy metrics.
- **Data Integrations:** Future architecture should anticipate integrations with calendar, fitness, and health APIs to accurately gauge capacity.
