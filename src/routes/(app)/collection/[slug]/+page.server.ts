import { and, eq } from "drizzle-orm";
import { kebabCase } from "string-ts";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { error, redirect } from "@sveltejs/kit";
import { deleteCollectionSchema, updateCollectionSchema } from "$lib/schemas/collection";
import { db } from "$lib/server/db";
import { collection } from "$lib/server/db/schema";
import { delay } from "$lib/utils";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const { user } = await event.parent();

  const [existingCollection] = await db
    .select()
    .from(collection)
    .where(and(eq(collection.userId, user.id), eq(collection.slug, event.params.slug)));

  if (!existingCollection) {
    return error(404, "Collection not found");
  }

  return {
    collection: existingCollection,
    updateCollectionForm: await superValidate(
      { ...existingCollection, description: existingCollection.description || undefined },
      zod4(updateCollectionSchema)
    ),
    deleteCollectionForm: await superValidate(existingCollection, zod4(deleteCollectionSchema))
  };
};

export const actions: Actions = {
  update: async (event) => {
    const form = await superValidate(event, zod4(updateCollectionSchema));

    await delay();

    if (!form.valid) {
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

    return redirect(302, `/collection/${slug}`);
  },
  delete: async (event) => {
    const form = await superValidate(event, zod4(deleteCollectionSchema));

    await delay();

    if (!form.valid) {
      return fail(400, { form });
    }

    await db.delete(collection).where(eq(collection.id, form.data.id));

    return redirect(302, "/dashboard");
  }
};
