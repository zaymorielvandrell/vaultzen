import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { redirect } from "@sveltejs/kit";
import { createCollectionSchema } from "$lib/schemas/collection";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/sign-in");
  }

  return {
    user: event.locals.user,
    createCollectionForm: await superValidate(zod4(createCollectionSchema))
  };
};
