<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { PlusIcon } from "@lucide/svelte";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import * as Select from "$lib/components/ui/select";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import { Spinner } from "$lib/components/ui/spinner";
  import { createBookmarkSchema } from "$lib/schemas/bookmark";
  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();

  let isCreateBookmarkDialogOpen = $state(false);
  let selectedCollectionId = $state("");

  // svelte-ignore state_referenced_locally
  const form = superForm(data.createBookmarkForm, {
    id: "create-bookmark-form",
    validators: zod4Client(createBookmarkSchema),
    onResult: ({ result }) => {
      if (result.type === "redirect") {
        isCreateBookmarkDialogOpen = false;
      }
    }
  });

  const { form: formData, submitting, enhance } = form;

  const collectionsById = $derived(
    Object.fromEntries(data.collections.map((collection) => [collection.id, collection]))
  );

  const collectionLabel = $derived(
    selectedCollectionId
      ? (collectionsById[selectedCollectionId].name ?? "Choose a collection")
      : "Unsorted"
  );

  $effect(() => {
    $formData.collectionId = selectedCollectionId === "" ? null : selectedCollectionId;
  });
</script>

<Sidebar.Provider style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;">
  <AppSidebar {data} />
  <Sidebar.Inset>
    <div class="dashboard-typography w-full px-4 sm:px-6 md:px-8 lg:px-10">
      <header class="flex min-h-12 w-full items-center py-4">
        <div class="inline-flex w-1/2 items-center justify-start">
          <Sidebar.Trigger />
        </div>
        <div class="inline-flex w-1/2 items-center justify-end">
          <Button onclick={() => (isCreateBookmarkDialogOpen = true)}>
            <PlusIcon />
            Add Bookmark
          </Button>
        </div>
      </header>
      <main class="py-2">
        {@render children()}
      </main>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>

<Dialog.Root bind:open={isCreateBookmarkDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add Bookmark</Dialog.Title>
      <Dialog.Description>Save a new link to your bookmark collection.</Dialog.Description>
    </Dialog.Header>
    <form
      id="create-bookmark-form"
      class="flex flex-col gap-4"
      action="/bookmark/create"
      method="post"
      use:enhance>
      <Form.Field {form} name="url">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>URL</Form.Label>
            <Input type="url" bind:value={$formData.url} {...props} />
          {/snippet}
        </Form.Control>
        <Form.Description>Paste the URL of the webpage you want to save.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="collectionId">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Collection</Form.Label>
            <Select.Root type="single" bind:value={selectedCollectionId} name={props.name}>
              <Select.Trigger class="w-full" {...props}>
                {collectionLabel}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="">Unsorted</Select.Item>
                <Select.Separator class="mx-0" />
                {#each data.collections as collection (collection.id)}
                  <Select.Item value={collection.id}>{collection.name}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
        <Form.Description>
          Choose a collection to organize this bookmark, or leave unsorted.
        </Form.Description>
        <Form.FieldErrors />
      </Form.Field>
    </form>
    <Dialog.Footer class="pt-4">
      <Dialog.Close class={buttonVariants({ variant: "outline" })}>Cancel</Dialog.Close>
      <Button type="submit" form="create-bookmark-form" disabled={$submitting}>
        {#if $submitting}
          <Spinner />
        {/if}
        Add Bookmark
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
