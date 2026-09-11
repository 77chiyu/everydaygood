import { DailyLifePlan, ScheduledItem } from '../types';

const STORAGE_PREFIX = 'life_os_plan_';
const VERSIONS_PREFIX = 'life_os_versions_';

/**
 * Get date string in Asia/Taipei timezone: YYYY-MM-DD
 */
export function getTaipeiDateKey(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date); // returns YYYY-MM-DD
  } catch (e) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

/**
 * Retrieve cached plan from LocalStorage synchronously
 */
export function getLocalCachedPlan(dateKey: string): DailyLifePlan | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${dateKey}`);
    if (raw) {
      const parsed = JSON.parse(raw) as DailyLifePlan;
      if (parsed && (parsed.dateKey === dateKey || parsed.date === dateKey)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading plan from localStorage:', err);
  }
  return null;
}

/**
 * Save plan to LocalStorage synchronously
 */
export function setLocalCachedPlan(plan: DailyLifePlan): void {
  try {
    const key = plan.dateKey || plan.date;
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(plan));

    // Also update history of versions
    const versionsRaw = localStorage.getItem(`${VERSIONS_PREFIX}${key}`);
    const versions: DailyLifePlan[] = versionsRaw ? JSON.parse(versionsRaw) : [];
    const exists = versions.find((v) => v.planVersion === plan.planVersion);
    if (!exists) {
      versions.push(plan);
      localStorage.setItem(`${VERSIONS_PREFIX}${key}`, JSON.stringify(versions.slice(-10)));
    }
  } catch (err) {
    console.error('Error writing plan to localStorage:', err);
  }
}

/**
 * Fetch plan from Server API with fallback to LocalStorage
 */
export async function fetchDailyPlanFromServer(
  dateKey: string
): Promise<{ plan: DailyLifePlan | null; versions: DailyLifePlan[] }> {
  try {
    const res = await fetch(`/api/daily-plan?date=${encodeURIComponent(dateKey)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.plan) {
        setLocalCachedPlan(data.plan);
        return { plan: data.plan, versions: data.versions || [] };
      }
    }
  } catch (err) {
    console.warn('Network request to /api/daily-plan failed, using local cache:', err);
  }

  const cached = getLocalCachedPlan(dateKey);
  let versions: DailyLifePlan[] = [];
  try {
    const versionsRaw = localStorage.getItem(`${VERSIONS_PREFIX}${dateKey}`);
    if (versionsRaw) versions = JSON.parse(versionsRaw);
  } catch (e) {}

  return { plan: cached, versions };
}

/**
 * Persist plan to Server API and LocalStorage
 */
export async function persistDailyPlan(plan: DailyLifePlan): Promise<DailyLifePlan> {
  const updatedPlan: DailyLifePlan = {
    ...plan,
    updatedAt: new Date().toISOString()
  };

  // 1. Immediately cache locally
  setLocalCachedPlan(updatedPlan);

  // 2. Persist to server disk
  try {
    const res = await fetch('/api/daily-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPlan)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.plan) {
        setLocalCachedPlan(data.plan);
        return data.plan;
      }
    }
  } catch (err) {
    console.warn('Failed to persist plan to server, stored in localStorage:', err);
  }

  return updatedPlan;
}

/**
 * Call Server API to reschedule today's plan
 */
export async function requestReschedulePlan(
  dateKey: string,
  vibeOrPrompt?: string
): Promise<{ plan: DailyLifePlan; versions: DailyLifePlan[] }> {
  try {
    const res = await fetch('/api/daily-plan/reschedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateKey, vibeOrPrompt })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.plan) {
        setLocalCachedPlan(data.plan);
        return { plan: data.plan, versions: data.versions || [] };
      }
    }
  } catch (err) {
    console.error('Failed to call /api/daily-plan/reschedule:', err);
  }

  // Fallback if offline
  const current = getLocalCachedPlan(dateKey);
  if (current) {
    const nextVersion = (current.planVersion || 1) + 1;
    const newPlan: DailyLifePlan = {
      ...current,
      planVersion: nextVersion,
      updatedAt: new Date().toISOString()
    };
    setLocalCachedPlan(newPlan);
    return { plan: newPlan, versions: [current, newPlan] };
  }

  throw new Error('Could not reschedule plan');
}
