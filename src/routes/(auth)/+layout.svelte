<script lang="ts">
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<div class="container">
  <main class="flex min-h-dvh items-center justify-center">
    {@render children()}
  </main>
</div>
