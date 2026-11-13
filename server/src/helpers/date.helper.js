// today's date as "YYYY-MM-DD" (server local time)
export function getToday() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// true only for real dates like "2026-10-15" (not "2026-02-31")
export function isValidDate(str) {
  if (typeof str !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const d = new Date(str);
  return !isNaN(d) && d.toISOString().slice(0, 10) === str;
}

// "2026-10-15" -> { from: "2026-10-01", to: "2026-10-15" }
export function getMonthToDateRange(date) {
  return { from: date.slice(0, 8) + "01", to: date };
}

// "2026-10-15" -> { from: "2026-09-01", to: "2026-09-30" } (whole previous month)
export function getPreviousMonthRange(date) {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7)); // 1-12

  const prevYear = month === 1 ? year - 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;
  const lastDay = new Date(Date.UTC(year, month - 1, 0)).getUTCDate();

  const mm = String(prevMonth).padStart(2, "0");
  return { from: `${prevYear}-${mm}-01`, to: `${prevYear}-${mm}-${lastDay}` };
}
