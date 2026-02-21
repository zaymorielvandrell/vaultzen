<script lang="ts">
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<div class="container">
  <main>
    {@render children()}
  </main>
</div>
