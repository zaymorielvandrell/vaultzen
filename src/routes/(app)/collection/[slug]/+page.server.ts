import { and, desc, eq } from "drizzle-orm";
import { kebabCase } from "string-ts";
import { definePageMetaTags } from "svelte-meta-tags";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { error } from "@sveltejs/kit";
import { deleteBookmarkSchema, updateBookmarkSchema } from "$lib/schemas/bookmark";
import { deleteCollectionSchema, updateCollectionSchema } from "$lib/schemas/collection";
import { db } from "$lib/server/db";
import { bookmark, collection } from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return error(401, "You must be signed in to continue.");
  }

  const [existingCollection] = await db
    .select()
    .from(collection)
    .where(
      and(eq(collection.userId, event.locals.user.id), eq(collection.slug, event.params.slug))
    );

  if (!existingCollection) {
    return error(404, "The collection could not be found.");
  }

  const pageTags = definePageMetaTags({
    title: existingCollection.name
  });

  return {
    ...pageTags,
    collection: existingCollection,
    updateBookmarkForm: await superValidate(zod4(updateBookmarkSchema)),
    deleteBookmarkForm: await superValidate(zod4(deleteBookmarkSchema)),
    updateCollectionForm: await superValidate(
      { ...existingCollection, description: existingCollection.description || undefined },
      zod4(updateCollectionSchema)
    ),
    deleteCollectionForm: await superValidate(existingCollection, zod4(deleteCollectionSchema)),
    collectionBookmarks: await db
      .select()
      .from(bookmark)
      .where(
        and(
          eq(bookmark.userId, event.locals.user.id),
          eq(bookmark.collectionId, existingCollection.id)
        )
      )
      .orderBy(desc(bookmark.updatedAt))
  };
};

export const actions: Actions = {
  update: async (event) => {
    const form = await superValidate(event, zod4(updateCollectionSchema));

    if (!form.valid) {
      setFlash({ type: "error", message: "Please check the collection details first." }, event);
      return fail(400, { form });
    }

    const slug = kebabCase(form.data.name);

    await db
      .update(collection)
      .set({
        name: form.data.name,
        slug,
        description: form.data.description || null
      })
      .where(eq(collection.id, form.data.id));

    return redirect(
      302,
      `/collection/${slug}`,
      { type: "success", message: "Collection updated successfully." },
      event
    );
  },
  delete: async (event) => {
    const form = await superValidate(event, zod4(deleteCollectionSchema));

    if (!form.valid) {
      setFlash({ type: "error", message: "Please check the collection details first." }, event);
      return fail(400, { form });
    }

    await db.delete(collection).where(eq(collection.id, form.data.id));

    return redirect(
      302,
      "/dashboard",
      { type: "success", message: "Collection deleted successfully." },
      event
    );
  }
};
