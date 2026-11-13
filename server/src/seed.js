import bcrypt from "bcrypt";
import { pool, connectDB } from "./config/db.js";
import { findUserByEmail, createUser } from "./services/user.service.js";
import { createReading } from "./services/reading.service.js";

// daysAgo: 0 = today, 1 = yesterday ...
const sampleReadings = [
  { daysAgo: 0, slot: "Morning (fasting)", value: 95 },
  { daysAgo: 0, slot: "After lunch", value: 135 },
  { daysAgo: 1, slot: "Morning (fasting)", value: 102 },
  { daysAgo: 1, slot: "After breakfast", value: 160 },
  { daysAgo: 2, slot: "After dinner", value: 130 },
];

await connectDB();

// demo user (reuse it if the seed was already run)
let user = await findUserByEmail("demo@sweety.com");
if (!user) {
  const passwordHash = await bcrypt.hash("demo1234", 10);
  user = await createUser("Demo User", "demo@sweety.com", passwordHash);
}

// clear old demo readings so running the seed twice is fine
await pool.query("DELETE FROM readings WHERE user_id = $1", [user.id]);

for (const r of sampleReadings) {
  const day = new Date();
  day.setDate(day.getDate() - r.daysAgo);
  const date = day.toISOString().slice(0, 10);
  await createReading(user.id, date, r.slot, r.value);
}

console.log("Seeded demo user: demo@sweety.com / demo1234");
await pool.end();
