import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const { DATABASE_URL, MODE } = process.env;
export const db = new Pool({
  connectionString: DATABASE_URL,
  ssl: MODE === "prod",
});
