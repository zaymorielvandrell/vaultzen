import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { db } from "$lib/server/db";

if (!env.ORIGIN) throw new Error("ORIGIN is not set");
if (!env.BETTER_AUTH_SECRET) throw new Error("BETTER_AUTH_SECRET is not set");
if (!env.GITHUB_CLIENT_ID) throw new Error("GITHUB_CLIENT_ID is not set");
if (!env.GITHUB_CLIENT_SECRET) throw new Error("GITHUB_CLIENT_SECRET is not set");

export const auth = betterAuth({
  baseURL: env.ORIGIN,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "sqlite"
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    }
  },
  advanced: {
    database: {
      generateId: () => crypto.randomUUID()
    }
  },
  plugins: [sveltekitCookies(getRequestEvent)]
});
