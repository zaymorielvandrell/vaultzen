import type { Session, User } from "better-auth";

declare global {
  type Bookmark = import("drizzle-orm").InferSelectModel<
    typeof import("$lib/server/db/schema/bookmark.schema").bookmark
  > & {
    host: string;
  };

  type Collection = import("drizzle-orm").InferSelectModel<
    typeof import("$lib/server/db/schema/collection.schema").collection
  >;

  namespace App {
    interface Flash {
      type: "success" | "error";
      message: string;
    }

    interface Locals {
      user?: User;
      session?: Session;
    }

    interface PageData {
      flash?: Flash;
    }

    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
