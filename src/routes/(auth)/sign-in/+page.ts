import { definePageMetaTags } from "svelte-meta-tags";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  const pageTags = definePageMetaTags({
    title: "Welcome to VaultZen"
  });

  return { ...pageTags };
};
