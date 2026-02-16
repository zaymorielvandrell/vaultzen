import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";
import { collection } from "./collection.schema";

export const bookmark = sqliteTable(
  "bookmark",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    collectionId: text("collection_id").references(() => collection.id, { onDelete: "set null" }),
    url: text("url").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    favicon: text("favicon").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => [
    index("bookmark_user_id_idx").on(table.userId),
    index("bookmark_collection_id_idx").on(table.collectionId),
    index("bookmark_user_id_url_idx").on(table.userId, table.url)
  ]
);
