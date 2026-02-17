import { and, eq } from "drizzle-orm";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { collection } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const { user } = await event.parent();

  const [existingCollection] = await db
    .select()
    .from(collection)
    .where(and(eq(collection.userId, user.id), eq(collection.slug, event.params.slug)));

  if (!existingCollection) {
    return error(404, "Collection not found");
  }

  return {
    collection: existingCollection
  };
};
