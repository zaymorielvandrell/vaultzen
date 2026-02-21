import { desc, eq } from "drizzle-orm";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { redirect } from "@sveltejs/kit";
import { createBookmarkSchema } from "$lib/schemas/bookmark";
import { createCollectionSchema } from "$lib/schemas/collection";
import { updateProfileSchema } from "$lib/schemas/profile";
import { db } from "$lib/server/db";
import { bookmark, collection } from "$lib/server/db/schema";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/sign-in");
  }

  return {
    user: event.locals.user,
    bookmarks: await db
      .select()
      .from(bookmark)
      .where(eq(bookmark.userId, event.locals.user.id))
      .orderBy(desc(bookmark.updatedAt)),
    collections: await db
      .select()
      .from(collection)
      .where(eq(collection.userId, event.locals.user.id))
      .orderBy(desc(collection.updatedAt)),
    createBookmarkForm: await superValidate(zod4(createBookmarkSchema)),
    createCollectionForm: await superValidate(zod4(createCollectionSchema)),
    updateProfileForm: await superValidate(zod4(updateProfileSchema))
  };
};
