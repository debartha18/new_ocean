const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Returns a formatted date string matching the app convention: "DD Mon YYYY" (e.g., "7 Sep 2026")
 */
export function getFormattedCurrentDate(date = new Date()) {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Returns current UTC time as decimal hour (0.0 to 23.99)
 */
export function getCurrentUtcTimeHour(date = new Date()) {
  return date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
}

/**
 * Parses date string in format "DD Mon YYYY" into { day, month, year }
 */
export function parseDateString(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    const now = new Date();
    return { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() };
  }

  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTH_NAMES.findIndex(
      (m) => m.toLowerCase() === parts[1].toLowerCase()
    );
    const year = parseInt(parts[2], 10);

    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return { day, month: monthIndex, year };
    }
  }

  const now = new Date();
  return { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() };
}
