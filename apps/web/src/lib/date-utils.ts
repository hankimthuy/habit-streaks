const VN_TIMEZONE = "Asia/Ho_Chi_Minh";
const VN_LOCALE = "vi-VN";

/** Get current date in Vietnam timezone */
export function vnNow(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: VN_TIMEZONE })
  );
}

/** Format: "2024-02-24" in VN timezone */
export function vnToday(): string {
  return formatDateISO(vnNow());
}

/** Format Date to "YYYY-MM-DD" */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Vietnamese day labels (short) */
const VN_DAY_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

/** English day labels (short) */
const EN_DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface WeekDay {
  date: string;       // "YYYY-MM-DD"
  dayOfMonth: number; // 1-31
  label: string;      // "T2", "T3", etc.
  labelEn: string;    // "Mon", "Tue", etc.
  isToday: boolean;
}

/** Get the current week (Mon-Sun) based on VN timezone */
export function getVNWeek(): WeekDay[] {
  const now = vnNow();
  const today = formatDateISO(now);
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  const days: WeekDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = formatDateISO(d);
    const dow = d.getDay();
    days.push({
      date: iso,
      dayOfMonth: d.getDate(),
      label: VN_DAY_SHORT[dow],
      labelEn: EN_DAY_SHORT[dow],
      isToday: iso === today,
    });
  }
  return days;
}

/** Format Vietnamese date: "Thứ Tư, 24 Tháng 2" */
export function formatVNDate(date?: Date): string {
  const d = date ?? vnNow();
  return d.toLocaleDateString(VN_LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: VN_TIMEZONE,
  });
}

/** Format Vietnamese date short: "24/02/2024" */
export function formatVNDateShort(date?: Date): string {
  const d = date ?? vnNow();
  return d.toLocaleDateString(VN_LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: VN_TIMEZONE,
  });
}

/** Get month name in Vietnamese */
export function getVNMonthYear(date?: Date): string {
  const d = date ?? vnNow();
  return d.toLocaleDateString(VN_LOCALE, {
    month: "long",
    year: "numeric",
    timeZone: VN_TIMEZONE,
  });
}
