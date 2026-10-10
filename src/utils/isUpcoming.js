/** True when an ISO date (YYYY-MM-DD) is today or later, in the visitor's local time. */
export default function isUpcoming(date, now = new Date()) {
  if (!date) return false;
  const pad = (n) => String(n).padStart(2, '0');
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return date.trim() >= today;
}
