// Generates bookable appointment slots that roll forward with the calendar.
//
// Two properties matter here:
//   1. Slots must be generated on the CLIENT after mount. They depend on the
//      current date, so computing them during render would make prerendered
//      HTML disagree with hydration.
//   2. Within a single day they must be STABLE. A schedule that reshuffles
//      every time the page is refreshed looks broken, so availability is
//      derived from a deterministic pseudo-random sequence seeded by
//      (calendar day + entity id). It changes when the date rolls over, and
//      differs between doctors/tests, but stays fixed for any given day.

const BUSINESS_START_MINUTES = 9 * 60; // 09:00
const BUSINESS_END_MINUTES = 17 * 60 + 30; // 17:30
const SLOT_STEP_MINUTES = 30;

/** Earliest and latest lead time, in whole days from today. */
const DEFAULT_LEAD_DAYS = [2, 3];
const DEFAULT_SLOTS_PER_DAY = 3;

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Small deterministic PRNG — same seed always yields the same sequence. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Calendar-day identity, used so availability changes when the date rolls over. */
export function currentDateKey(now: Date = new Date()): string {
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export interface AvailabilityOptions {
  /** Which days ahead to offer, e.g. [2, 3] = day-after-tomorrow and the day after. */
  leadDays?: number[];
  slotsPerDay?: number;
  now?: Date;
}

/**
 * Returns ISO timestamps for bookable slots, sorted chronologically.
 * `seedKey` should identify the doctor/test so different entities show
 * different availability.
 */
export function generateAvailability(seedKey: string, options: AvailabilityOptions = {}): string[] {
  const { leadDays = DEFAULT_LEAD_DAYS, slotsPerDay = DEFAULT_SLOTS_PER_DAY, now = new Date() } = options;

  const rand = mulberry32(hashString(`${currentDateKey(now)}::${seedKey}`));

  // All possible half-hour start times within business hours.
  const stepCount = Math.floor((BUSINESS_END_MINUTES - BUSINESS_START_MINUTES) / SLOT_STEP_MINUTES) + 1;
  const allSteps = Array.from({ length: stepCount }, (_, i) => BUSINESS_START_MINUTES + i * SLOT_STEP_MINUTES);

  const slots: string[] = [];

  for (const dayOffset of leadDays) {
    // Seeded Fisher-Yates over a copy, so each day picks a different subset.
    const pool = [...allSteps];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const chosen = pool.slice(0, Math.min(slotsPerDay, pool.length)).sort((a, b) => a - b);

    for (const minutes of chosen) {
      const date = new Date(now);
      date.setDate(date.getDate() + dayOffset);
      date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
      slots.push(date.toISOString());
    }
  }

  return slots.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
}

/** Convenience for "Next available: …" labels. */
export function nextAvailable(seedKey: string, options?: AvailabilityOptions): string | null {
  return generateAvailability(seedKey, options)[0] ?? null;
}
