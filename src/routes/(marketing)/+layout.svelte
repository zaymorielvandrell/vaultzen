<script lang="ts">
  import { setMode } from "mode-watcher";
  import Footer from "$lib/components/marketing/footer.svelte";
  import Header from "$lib/components/marketing/header.svelte";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();

  setMode("dark");
</script>

<div class="marketing-typography">
  <Header />
  <main>{@render children()}</main>
  <Footer />
</div>
