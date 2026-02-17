<script lang="ts">
  import { ChevronDown, Settings2, Trash2 } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import * as ButtonGroup from "$lib/components/ui/button-group";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let isLoading = $state(true);

  $effect(() => {
    if (data.collection) {
      isLoading = false;
    }
  });
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between gap-2">
    {#if isLoading}
      <div>
        <Skeleton class="h-8 w-60" />
        <Skeleton class="mt-2 h-5 w-80" />
      </div>
      <div>
        <Skeleton class="h-9 w-18" />
      </div>
    {:else}
      <div>
        <h1>{data.collection.name}</h1>
        <p class="text-muted-foreground">
          {#if data.collection.description}
            <span>{data.collection.description} •</span>
          {/if}
          <span>You have 99 bookmark(s) saved.</span>
        </p>
      </div>
      <ButtonGroup.Root>
        <Button variant="outline" size="icon">
          <Settings2 />
          <span class="sr-only">Edit Collection</span>
        </Button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Button {...props} variant="outline" size="icon">
                <ChevronDown />
                <span class="sr-only">Manage Collection</span>
              </Button>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Group>
              <DropdownMenu.Item variant="destructive">
                <Trash2 />
                Delete Collection
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </ButtonGroup.Root>
    {/if}
  </div>
</div>
