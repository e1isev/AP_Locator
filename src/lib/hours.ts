import { WeekHours } from '../types/cafe';

const DAY_KEYS: (keyof WeekHours)[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function isOpenNow(hours: WeekHours | null, now: Date = new Date()): boolean | null {
  if (!hours) return null;

  const today = hours[DAY_KEYS[now.getDay()]];
  if (!today || !today.open || !today.close) return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(today.open);
  const close = toMinutes(today.close);

  if (close <= open) {
    return nowMinutes >= open || nowMinutes < close;
  }
  return nowMinutes >= open && nowMinutes < close;
}

export function formatHoursToday(hours: WeekHours | null, now: Date = new Date()): string {
  if (!hours) return 'Hours unavailable';
  const today = hours[DAY_KEYS[now.getDay()]];
  if (!today || !today.open || !today.close) return 'Closed today';
  return `${today.open} - ${today.close}`;
}
