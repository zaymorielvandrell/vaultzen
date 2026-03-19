import { updateFlash } from "sveltekit-flash-message";
import { page } from "$app/state";

export const syncFlashMessage = async () => {
  await updateFlash(page);
};
