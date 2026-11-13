import "dotenv/config";
import pg from "pg";
import { createUsersTable } from "../schemas/users.schema.js";
import { createReadingsTable } from "../schemas/readings.schema.js";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export async function connectDB() {
  await pool.query("SELECT 1");
  await createUsersTable(pool);
  await createReadingsTable(pool);
  console.log("Database connected");
}
