import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { deleteBookmarkSchema, updateBookmarkSchema } from "$lib/schemas/bookmark";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  return {
    updateBookmarkForm: await superValidate(zod4(updateBookmarkSchema)),
    deleteBookmarkForm: await superValidate(zod4(deleteBookmarkSchema))
  };
};
