<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";
  import type { LayoutProps } from "./$types";
  import "./layout.css";

  let { children }: LayoutProps = $props();
</script>

<ModeWatcher />
<Toaster />

{@render children()}
