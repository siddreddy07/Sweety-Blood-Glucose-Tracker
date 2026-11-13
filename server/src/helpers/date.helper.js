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
