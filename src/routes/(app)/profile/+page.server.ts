import { eq } from "drizzle-orm";
import { setFlash } from "sveltekit-flash-message/server";
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
      setFlash({ type: "error", message: "Please check your profile details first." }, event);
      return fail(400, { form });
    }

    if (!event.locals.user) {
      return error(401, "You must be signed in to continue.");
    }

    await db
      .update(user)
      .set({
        name: form.data.name
      })
      .where(eq(user.id, event.locals.user.id));

    setFlash({ type: "success", message: "Profile updated successfully." }, event);

    return { form };
  }
};
