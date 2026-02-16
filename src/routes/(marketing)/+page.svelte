<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<div>
  <h1>Welcome to Vaultzen</h1>
  <Button href="/sign-in">Sign in</Button>
</div>
