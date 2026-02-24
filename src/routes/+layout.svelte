<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import { deepMerge, MetaTags } from "svelte-meta-tags";
  import { page } from "$app/state";
  import { Toaster } from "$lib/components/ui/sonner";
  import type { LayoutProps } from "./$types";
  import "./layout.css";

  let { data, children }: LayoutProps = $props();

  let metaTags = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags));
</script>

<MetaTags {...metaTags} />
<ModeWatcher defaultMode="dark" />
<Toaster />

{@render children()}
