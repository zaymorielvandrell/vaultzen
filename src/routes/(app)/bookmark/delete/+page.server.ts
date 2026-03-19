import { and, eq } from "drizzle-orm";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { error } from "@sveltejs/kit";
import { deleteBookmarkSchema } from "$lib/schemas/bookmark";
import { db } from "$lib/server/db";
import { bookmark } from "$lib/server/db/schema";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(deleteBookmarkSchema));

    if (!form.valid) {
      setFlash({ type: "error", message: "Please check the bookmark details first." }, event);
      return fail(400, { form });
    }

    if (!event.locals.user) {
      return error(401, "You must be signed in to continue.");
    }

    const [existingBookmark] = await db
      .select()
      .from(bookmark)
      .where(and(eq(bookmark.userId, event.locals.user.id), eq(bookmark.id, form.data.id)));

    if (!existingBookmark) {
      return error(404, "The bookmark could not be found.");
    }

    await db.delete(bookmark).where(eq(bookmark.id, form.data.id));

    return redirect(
      302,
      "/dashboard",
      { type: "success", message: "Bookmark deleted successfully." },
      event
    );
  }
};
