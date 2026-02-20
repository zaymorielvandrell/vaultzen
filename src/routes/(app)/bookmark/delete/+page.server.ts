import { and, eq } from "drizzle-orm";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { error, redirect } from "@sveltejs/kit";
import { deleteBookmarkSchema } from "$lib/schemas/bookmark";
import { db } from "$lib/server/db";
import { bookmark } from "$lib/server/db/schema";
import { delay } from "$lib/utils";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(deleteBookmarkSchema));

    await delay();

    if (!form.valid) {
      return fail(400, { form });
    }

    if (!event.locals.user) {
      return error(401, "Unauthorized");
    }

    const [existingBookmark] = await db
      .select()
      .from(bookmark)
      .where(and(eq(bookmark.userId, event.locals.user.id), eq(bookmark.id, form.data.id)));

    if (!existingBookmark) {
      return error(404, "Bookmark not found");
    }

    await db.delete(bookmark).where(eq(bookmark.id, form.data.id));

    return redirect(302, "/dashboard");
  }
};
