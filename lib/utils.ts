import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * "checked 14 minutes ago" — the status-line's measured timestamp.
 * Rendered server-side from the revalidated check time.
 */
export function relativeTime(from: Date | number, now: Date | number = Date.now()): string {
  const ms = new Date(now).getTime() - new Date(from).getTime();
  const minutes = Math.max(0, Math.round(ms / 60000));

  if (minutes < 1) return 'just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.round(minutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.round(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}
