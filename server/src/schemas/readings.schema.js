export async function createReadingsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS readings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      reading_date DATE NOT NULL,
      slot TEXT NOT NULL,
      value INTEGER NOT NULL,
      UNIQUE (user_id, reading_date, slot)
    )
  `);
}
