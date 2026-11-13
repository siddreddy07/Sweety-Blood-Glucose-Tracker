import { getToday, isValidDate, getMonthToDateRange, getPreviousMonthRange } from "../helpers/date.helper.js";
import { getStats } from "../services/report.service.js";
import { getReadings } from "../services/reading.service.js";

const serverError = "Something went wrong. Please try again.";

// uses ?date=YYYY-MM-DD, or today if not given. Returns null (after replying) if invalid.
function getSelectedDate(req, res) {
  const date = req.query.date || getToday();
  if (!isValidDate(date)) {
    res.status(400).json({ error: "Please select a valid date." });
    return null;
  }
  return date;
}

export async function dailyReport(req, res) {
  try {
    const date = getSelectedDate(req, res);
    if (!date) return;

    const stats = await getStats(req.userId, date, date);
    const readings = await getReadings(req.userId, date);

    res.json({ from: date, to: date, ...stats, readings });
  } catch (err) {
    console.error("dailyReport error:", err.message);
    res.status(500).json({ error: serverError });
  }
}

export async function monthToDateReport(req, res) {
  try {
    const date = getSelectedDate(req, res);
    if (!date) return;

    const { from, to } = getMonthToDateRange(date);
    const stats = await getStats(req.userId, from, to);

    res.json({ from, to, ...stats });
  } catch (err) {
    console.error("monthToDateReport error:", err.message);
    res.status(500).json({ error: serverError });
  }
}

export async function monthlyReport(req, res) {
  try {
    const date = getSelectedDate(req, res);
    if (!date) return;

    const { from, to } = getPreviousMonthRange(date);
    const stats = await getStats(req.userId, from, to);

    res.json({ from, to, ...stats });
  } catch (err) {
    console.error("monthlyReport error:", err.message);
    res.status(500).json({ error: serverError });
  }
}
