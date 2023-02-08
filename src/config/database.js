import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const { DATABASE_URL } = process.env;
const MODE = process.env.MODE || "dev";
export const db = new Pool({
  connectionString: DATABASE_URL,
  ssl: MODE === "prod",
});
