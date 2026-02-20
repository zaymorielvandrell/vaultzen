import type { Session, User } from "better-auth";

declare global {
  type BookmarkWithHost = import("drizzle-orm").InferSelectModel<
    typeof import("$lib/server/db/schema/bookmark.schema").bookmark
  > & {
    host: string;
  };

  type Collection = import("drizzle-orm").InferSelectModel<
    typeof import("$lib/server/db/schema/collection.schema").collection
  >;

  namespace App {
    interface Locals {
      user?: User;
      session?: Session;
    }

    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
