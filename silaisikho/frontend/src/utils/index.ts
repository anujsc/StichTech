/**
 * Converts total seconds to a human-readable duration string.
 * e.g. 9000 → "2h 30m"
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Formats a number as Indian Rupee price.
 * e.g. 499 → "₹499"
 */
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Formats an ISO date string to a readable date.
 * e.g. "2025-03-15T00:00:00Z" → "15 March 2025"
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Truncates a string to n characters and appends ellipsis if needed.
 */
export function truncateText(text: string, n: number): string {
  if (text.length <= n) return text;
  return `${text.slice(0, n)}…`;
}
