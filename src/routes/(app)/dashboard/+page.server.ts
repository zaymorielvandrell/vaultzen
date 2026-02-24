import { definePageMetaTags } from "svelte-meta-tags";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { deleteBookmarkSchema, updateBookmarkSchema } from "$lib/schemas/bookmark";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const pageTags = definePageMetaTags({
    title: "All Bookmarks"
  });

  return {
    ...pageTags,
    updateBookmarkForm: await superValidate(zod4(updateBookmarkSchema)),
    deleteBookmarkForm: await superValidate(zod4(deleteBookmarkSchema))
  };
};
