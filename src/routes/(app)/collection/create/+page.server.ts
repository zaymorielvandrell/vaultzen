import { kebabCase } from "string-ts";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
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
      return message(form, { type: "error", text: "Invalid form" });
    }

    if (!event.locals.user) {
      return message(form, { type: "error", text: "Unauthorized" });
    }

    await db.insert(collection).values({
      userId: event.locals.user.id,
      name: form.data.name,
      slug: kebabCase(form.data.name),
      description: form.data.description
    });

    return message(form, { type: "success", text: "Collection created" });
  }
};
