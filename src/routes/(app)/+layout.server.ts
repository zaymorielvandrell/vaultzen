import { desc, eq } from "drizzle-orm";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { redirect } from "@sveltejs/kit";
import { createBookmarkSchema } from "$lib/schemas/bookmark";
import { createCollectionSchema } from "$lib/schemas/collection";
import { db } from "$lib/server/db";
import { collection } from "$lib/server/db/schema";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/sign-in");
  }

  return {
    user: event.locals.user,
    collections: await db
      .select()
      .from(collection)
      .where(eq(collection.userId, event.locals.user.id))
      .orderBy(desc(collection.updatedAt)),
    createBookmarkForm: await superValidate(zod4(createBookmarkSchema)),
    createCollectionForm: await superValidate(zod4(createCollectionSchema))
  };
};
