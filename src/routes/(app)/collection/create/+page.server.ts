import { kebabCase } from "string-ts";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { error, redirect } from "@sveltejs/kit";
import { createCollectionSchema } from "$lib/schemas/collection";
import { db } from "$lib/server/db";
import { collection } from "$lib/server/db/schema";
import { delay } from "$lib/utils";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(createCollectionSchema));

    await delay();

    if (!form.valid) {
      return fail(400, { form });
    }

    if (!event.locals.user) {
      return error(401, "Unauthorized");
    }

    const slug = kebabCase(form.data.name);

    await db.insert(collection).values({
      userId: event.locals.user.id,
      name: form.data.name,
      slug,
      description: form.data.description
    });

    return redirect(302, `/collection/${slug}`);
  }
};
