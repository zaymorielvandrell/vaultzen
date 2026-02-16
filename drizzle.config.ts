import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
if (!process.env.DATABASE_AUTH_TOKEN) throw new Error("DATABASE_AUTH_TOKEN is not set");

const config = defineConfig({
  dialect: "turso",
  schema: "./src/lib/server/db/schema",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN
  }
});

export default config;
