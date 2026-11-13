export async function createReadingsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS readings (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id),
      reading_date DATE NOT NULL,
      slot TEXT NOT NULL,
      value INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, reading_date, slot)
    )
  `);
}
