import { pool } from "../config/db.js";

// highest, lowest, average (1 decimal) and count for a date range (inclusive)
export async function getStats(userId, from, to) {
  const result = await pool.query(
    `SELECT MAX(value) AS highest,
            MIN(value) AS lowest,
            ROUND(AVG(value), 1) AS average,
            COUNT(*)::int AS count
     FROM readings
     WHERE user_id = $1 AND reading_date BETWEEN $2 AND $3`,
    [userId, from, to]
  );

  const row = result.rows[0];
  return {
    highest: row.highest,
    lowest: row.lowest,
    average: row.average === null ? null : Number(row.average),
    count: row.count,
  };
}
