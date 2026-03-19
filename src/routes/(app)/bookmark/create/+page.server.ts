import { eq } from "drizzle-orm";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { error } from "@sveltejs/kit";
import { createBookmarkSchema } from "$lib/schemas/bookmark";
import { db } from "$lib/server/db";
import { bookmark, collection } from "$lib/server/db/schema";
import { extractMetadata } from "$lib/server/extract-metadata";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(createBookmarkSchema));

    if (!form.valid) {
      setFlash({ type: "error", message: "Please check the bookmark details first." }, event);
      return fail(400, { form });
    }

    if (!event.locals.user) {
      return error(401, "You must be signed in to continue.");
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
        return redirect(
          302,
          `/collection/${existingCollection.slug}`,
          { type: "success", message: "Bookmark created successfully." },
          event
        );
      }
    }

    return redirect(
      302,
      "/unsorted",
      { type: "success", message: "Bookmark created successfully." },
      event
    );
  }
};
