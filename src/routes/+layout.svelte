<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import { deepMerge, MetaTags } from "svelte-meta-tags";
  import { toast } from "svelte-sonner";
  import { getFlash } from "sveltekit-flash-message";
  import { page } from "$app/state";
  import { Toaster } from "$lib/components/ui/sonner";
  import type { LayoutProps } from "./$types";
  import "./layout.css";

  let { data, children }: LayoutProps = $props();

  let metaTags = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags));

  const flash = getFlash(page);

  $effect(() => {
    if (!$flash) return;

    toast[$flash.type]($flash.message);

    $flash = undefined;
  });
</script>

<MetaTags {...metaTags} />
<ModeWatcher defaultMode="dark" />
<Toaster />

{@render children()}
