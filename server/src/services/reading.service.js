import { pool } from "../config/db.js";
import { generateId } from "../helpers/id.helper.js";

// dates are returned as "YYYY-MM-DD" text to avoid timezone shifts
const columns = "id, to_char(reading_date, 'YYYY-MM-DD') AS reading_date, slot, value";

export async function getReadings(userId, date) {
  if (date) {
    const result = await pool.query(
      `SELECT ${columns} FROM readings WHERE user_id = $1 AND reading_date = $2 ORDER BY created_at`,
      [userId, date]
    );
    return result.rows;
  }
  const result = await pool.query(
    `SELECT ${columns} FROM readings WHERE user_id = $1 ORDER BY reading_date DESC, created_at`,
    [userId]
  );
  return result.rows;
}

export async function getReadingById(id, userId) {
  const result = await pool.query(
    `SELECT ${columns} FROM readings WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return result.rows[0];
}

export async function countReadingsOnDate(userId, date) {
  const result = await pool.query(
    "SELECT COUNT(*)::int AS count FROM readings WHERE user_id = $1 AND reading_date = $2",
    [userId, date]
  );
  return result.rows[0].count;
}

// is this slot already used on this date? (excludeId lets an edit ignore itself)
export async function slotExists(userId, date, slot, excludeId = null) {
  const result = await pool.query(
    "SELECT id FROM readings WHERE user_id = $1 AND reading_date = $2 AND slot = $3 AND ($4::uuid IS NULL OR id <> $4)",
    [userId, date, slot, excludeId]
  );
  return result.rows.length > 0;
}

export async function createReading(userId, date, slot, value) {
  const result = await pool.query(
    `INSERT INTO readings (id, user_id, reading_date, slot, value) VALUES ($1, $2, $3, $4, $5)
     RETURNING ${columns}`,
    [generateId(), userId, date, slot, value]
  );
  return result.rows[0];
}

export async function updateReading(id, userId, date, slot, value) {
  const result = await pool.query(
    `UPDATE readings SET reading_date = $3, slot = $4, value = $5, updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING ${columns}`,
    [id, userId, date, slot, value]
  );
  return result.rows[0];
}

export async function deleteReading(id, userId) {
  const result = await pool.query("DELETE FROM readings WHERE id = $1 AND user_id = $2", [id, userId]);
  return result.rowCount > 0;
}
