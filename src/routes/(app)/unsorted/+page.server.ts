import { desc, isNull } from "drizzle-orm";
import { definePageMetaTags } from "svelte-meta-tags";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { deleteBookmarkSchema, updateBookmarkSchema } from "$lib/schemas/bookmark";
import { db } from "$lib/server/db";
import { bookmark } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const pageTags = definePageMetaTags({
    title: "Unsorted"
  });

  return {
    ...pageTags,
    updateBookmarkForm: await superValidate(zod4(updateBookmarkSchema)),
    deleteBookmarkForm: await superValidate(zod4(deleteBookmarkSchema)),
    unsortedBookmarks: await db
      .select()
      .from(bookmark)
      .where(isNull(bookmark.collectionId))
      .orderBy(desc(bookmark.updatedAt))
  };
};
