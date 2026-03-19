<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { ChevronDownIcon, Settings2Icon, Trash2Icon } from "@lucide/svelte";
  import { syncFlashMessage } from "$lib/client/flash";
  import BookmarkList from "$lib/components/bookmark-list.svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as ButtonGroup from "$lib/components/ui/button-group";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { Spinner } from "$lib/components/ui/spinner";
  import { Textarea } from "$lib/components/ui/textarea";
  import { deleteCollectionSchema, updateCollectionSchema } from "$lib/schemas/collection";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let isUpdateCollectionDialogOpen = $state(false);
  let isDeleteCollectionDialogOpen = $state(false);

  const bookmarks = $derived(
    data.collectionBookmarks.map((bookmark) => ({
      ...bookmark,
      host: new URL(bookmark.url).hostname
    }))
  );

  const hasBookmarks = $derived(bookmarks.length > 0);

  // svelte-ignore state_referenced_locally
  const updateForm = superForm(data.updateCollectionForm, {
    id: "update-collection-form",
    validators: zod4Client(updateCollectionSchema),
    onResult: ({ result }) => {
      if (result.type === "redirect") {
        isUpdateCollectionDialogOpen = false;
      }
    },
    onUpdated: syncFlashMessage
  });

  const {
    form: updateFormData,
    submitting: updateSubmitting,
    reset: updateReset,
    enhance: updateEnhance
  } = updateForm;

  // svelte-ignore state_referenced_locally
  const deleteForm = superForm(data.deleteCollectionForm, {
    id: "delete-collection-form",
    validators: zod4Client(deleteCollectionSchema),
    onResult: ({ result }) => {
      if (result.type === "redirect") {
        isDeleteCollectionDialogOpen = false;
      }
    },
    onUpdated: syncFlashMessage
  });

  const {
    form: deleteFormData,
    submitting: deleteSubmitting,
    reset: deleteReset,
    enhance: deleteEnhance
  } = deleteForm;

  const handleUpdateCollectionDialogOpen = () => {
    updateReset({ data: data.updateCollectionForm.data });
    isUpdateCollectionDialogOpen = true;
  };

  const handleDeleteCollectionDialogOpen = () => {
    deleteReset({ data: data.deleteCollectionForm.data });
    isDeleteCollectionDialogOpen = true;
  };
</script>

<div class="flex flex-col gap-8">
  <div class="flex items-center justify-between gap-2">
    <div>
      <h1>{data.collection.name}</h1>
      <p class="text-muted-foreground">
        {#if data.collection.description}
          {data.collection.description} •
        {/if}
        You have {hasBookmarks ? bookmarks.length : 0}
        {hasBookmarks && bookmarks.length === 1 ? " bookmark" : " bookmarks"} saved.
      </p>
    </div>
    <ButtonGroup.Root>
      <Button variant="outline" size="icon" onclick={handleUpdateCollectionDialogOpen}>
        <Settings2Icon />
        <span class="sr-only">Edit collection</span>
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="outline" size="icon">
              <ChevronDownIcon />
              <span class="sr-only">Manage collection</span>
            </Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Group>
            <DropdownMenu.Item variant="destructive" onclick={handleDeleteCollectionDialogOpen}>
              <Trash2Icon />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </ButtonGroup.Root>
  </div>
  <BookmarkList
    {bookmarks}
    collections={data.collections}
    updateBookmarkForm={data.updateBookmarkForm}
    deleteBookmarkForm={data.deleteBookmarkForm}
    hideHeader
    emptyTitle="No bookmarks yet"
    emptyDescription="Save your first bookmark to this collection." />
</div>

<Dialog.Root bind:open={isUpdateCollectionDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit Collection</Dialog.Title>
      <Dialog.Description>Update the name and description for this collection.</Dialog.Description>
    </Dialog.Header>
    <form
      id="update-collection-form"
      class="flex flex-col gap-4"
      action="?/update"
      method="post"
      use:updateEnhance>
      <Form.Field form={updateForm} name="id">
        <Form.Control>
          {#snippet children({ props })}
            <Input type="hidden" bind:value={$updateFormData.id} {...props} />
          {/snippet}
        </Form.Control>
      </Form.Field>
      <Form.Field form={updateForm} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name</Form.Label>
            <Input
              type="text"
              bind:value={$updateFormData.name}
              placeholder="Enter a name"
              {...props} />
          {/snippet}
        </Form.Control>
        <Form.Description>
          Choose a clear name so this collection is easy to recognize.
        </Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={updateForm} name="description">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Description</Form.Label>
            <Textarea
              bind:value={$updateFormData.description}
              placeholder="Enter a description"
              {...props} />
          {/snippet}
        </Form.Control>
        <Form.Description>Add a short description to explain what belongs here.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
    </form>
    <Dialog.Footer class="pt-4">
      <Dialog.Close class={buttonVariants({ variant: "outline" })}>Cancel</Dialog.Close>
      <Button type="submit" form="update-collection-form" disabled={$updateSubmitting}>
        {#if $updateSubmitting}
          <Spinner />
        {/if}
        Save Changes
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={isDeleteCollectionDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete collection</AlertDialog.Title>
      <AlertDialog.Description>
        This collection will be permanently deleted. Any bookmarks inside it will be moved to
        Unsorted.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <form id="delete-collection-form" action="?/delete" method="post" use:deleteEnhance>
      <Form.Field form={deleteForm} name="id">
        <Form.Control>
          {#snippet children({ props })}
            <Input type="hidden" bind:value={$deleteFormData.id} {...props} />
          {/snippet}
        </Form.Control>
      </Form.Field>
    </form>
    <AlertDialog.Footer class="pt-4">
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action
        type="submit"
        form="delete-collection-form"
        class={buttonVariants({ variant: "destructive" })}
        disabled={$deleteSubmitting}>
        {#if $deleteSubmitting}
          <Spinner />
        {/if}
        Delete Collection
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
