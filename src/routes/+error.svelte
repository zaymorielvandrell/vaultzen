<script lang="ts">
  import { HatGlassesIcon } from "@lucide/svelte";
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button";
  import * as Empty from "$lib/components/ui/empty";

  const isNotFound = $derived(page.status === 404);
</script>

<main class="container">
  <Empty.Root class="my-24 sm:my-48">
    <Empty.Header class="max-w-md">
      <Empty.Media variant="icon">
        <HatGlassesIcon />
      </Empty.Media>
      <Empty.Title>
        {page.status} • {isNotFound ? "Page Not Found" : "Something Went Wrong"}
      </Empty.Title>
      <Empty.Description>
        {isNotFound
          ? "The page you requested does not exist or may have been moved."
          : (page.error?.message ?? "An unexpected error occurred. Please try again.")}
      </Empty.Description>
    </Empty.Header>
    <Empty.Content>
      <div class="flex items-center gap-2">
        <Button href="/">Go Home</Button>
        <Button href="/dashboard" variant="outline">Dashboard</Button>
      </div>
    </Empty.Content>
  </Empty.Root>
</main>
