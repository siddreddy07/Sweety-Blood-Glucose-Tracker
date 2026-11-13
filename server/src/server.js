import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pg from "pg";

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Database ----------
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Neon needs SSL
});

// Return DATE columns as plain "YYYY-MM-DD" strings (avoids timezone shifts)
pg.types.setTypeParser(1082, (value) => value);

// "Models": create the tables if they don't exist yet
async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS readings (
      id           SERIAL PRIMARY KEY,
      user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reading_date DATE NOT NULL,
      slot         TEXT NOT NULL CHECK (slot IN (
                     'Morning (fasting)', 'After breakfast',
                     'After lunch', 'After dinner')),
      value        INTEGER NOT NULL CHECK (value BETWEEN 40 AND 600),
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, reading_date, slot)
    )
  `);
}

// ---------- Middleware ----------
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ---------- Routes ----------
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---------- Start ----------
createTables()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Could not set up the database:", err.message);
    process.exit(1);
  });
