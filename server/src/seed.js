import bcrypt from "bcrypt";
import { pool, connectDB } from "./config/db.js";
import { SLOTS } from "./constants.js";
import { findUserByEmail, createUser } from "./services/user.service.js";
import { createReading } from "./services/reading.service.js";

// 3 sample days of values (one per slot), repeated over the last 40 days
const sampleValues = [
  [95, 150, 135, 140],
  [102, 160, 128, 155],
  [88, 145, 142, 130],
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

for (let i = 0; i < 40; i++) {
  const day = new Date();
  day.setDate(day.getDate() - i);
  const date = day.toISOString().slice(0, 10);

  for (let s = 0; s < SLOTS.length; s++) {
    await createReading(user.id, date, SLOTS[s], sampleValues[i % 3][s]);
  }
}

console.log("Seeded demo user: demo@sweety.com / demo1234");
await pool.end();
