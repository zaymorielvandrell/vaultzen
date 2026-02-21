import { eq } from "drizzle-orm";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { error } from "@sveltejs/kit";
import { updateProfileSchema } from "$lib/schemas/profile";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(updateProfileSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    if (!event.locals.user) {
      return error(401, "Unauthorized");
    }

    await db
      .update(user)
      .set({
        name: form.data.name
      })
      .where(eq(user.id, event.locals.user.id));

    return { form };
  }
};
