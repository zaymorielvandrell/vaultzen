<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<div>
  <h1>Hi, {data.user.name}!</h1>
</div>
