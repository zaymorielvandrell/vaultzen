import { eq } from "drizzle-orm";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { error, redirect } from "@sveltejs/kit";
import { createBookmarkSchema } from "$lib/schemas/bookmark";
import { db } from "$lib/server/db";
import { bookmark, collection } from "$lib/server/db/schema";
import { extractMetadata } from "$lib/server/metadata";
import { delay } from "$lib/utils";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(createBookmarkSchema));

    await delay();

    if (!form.valid) {
      return fail(400, { form });
    }

    if (!event.locals.user) {
      return error(401, "Unauthorized");
    }

    const metadata = await extractMetadata(form.data.url);

    await db
      .insert(bookmark)
      .values({
        userId: event.locals.user.id,
        collectionId: form.data.collectionId,
        url: form.data.url,
        title: metadata.title,
        description: metadata.description,
        favicon: metadata.favicon
      })
      .onConflictDoNothing();

    if (form.data.collectionId) {
      const [existingCollection] = await db
        .select({ slug: collection.slug })
        .from(collection)
        .where(eq(collection.id, form.data.collectionId))
        .limit(1);

      if (existingCollection) {
        return redirect(302, `/collection/${existingCollection.slug}`);
      }
    }

    return redirect(302, "/unsorted");
  }
};
