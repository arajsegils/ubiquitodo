import type { Config } from "drizzle-kit";

console.log("config");
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString:
      "postgres://postgres:Z7ZO8jsmRqIVooAj@db.thdbfvdzmhyezlwpzjyg.supabase.co:6543/postgres",
  },
} satisfies Config;
