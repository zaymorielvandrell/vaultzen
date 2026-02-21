<script lang="ts">
  import { format } from "date-fns";
  import { charAt, toUpperCase } from "string-ts";
  import { superForm } from "sveltekit-superforms";
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { BookmarkIcon, ChevronDownIcon, Settings2Icon, Trash2Icon } from "@lucide/svelte";
  import { resolve } from "$app/paths";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import * as Avatar from "$lib/components/ui/avatar";
  import { badgeVariants } from "$lib/components/ui/badge";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as ButtonGroup from "$lib/components/ui/button-group";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Empty from "$lib/components/ui/empty";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import * as Select from "$lib/components/ui/select";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { Spinner } from "$lib/components/ui/spinner";
  import { Textarea } from "$lib/components/ui/textarea";
  import { deleteBookmarkSchema, updateBookmarkSchema } from "$lib/schemas/bookmark";
  import type { DeleteBookmarkSchema, UpdateBookmarkSchema } from "$lib/schemas/bookmark";

  interface Props {
    bookmarks: Bookmark[];
    collections: Collection[];
    updateBookmarkForm: SuperValidated<Infer<UpdateBookmarkSchema>>;
    deleteBookmarkForm: SuperValidated<Infer<DeleteBookmarkSchema>>;
    hideHeader?: boolean;
    title?: string;
    emptyTitle: string;
    emptyDescription: string;
  }

  let {
    bookmarks,
    collections,
    updateBookmarkForm,
    deleteBookmarkForm,
    hideHeader = false,
    title,
    emptyTitle,
    emptyDescription
  }: Props = $props();

  let isBookmarks = $state(true);
  let isUpdateBookmarkDialogOpen = $state(false);
  let isDeleteBookmarkDialogOpen = $state(false);
  let selectedCollectionId = $state("");

  const hasBookmarks = $derived(bookmarks.length > 0);

  const collectionsById = $derived(
    Object.fromEntries(collections.map((collection) => [collection.id, collection]))
  );

  const collectionLabel = $derived(
    selectedCollectionId
      ? (collectionsById[selectedCollectionId]?.name ?? "Choose a collection")
      : "Unsorted"
  );

  // svelte-ignore state_referenced_locally
  const updateForm = superForm(updateBookmarkForm, {
    id: "update-bookmark-form",
    validators: zod4Client(updateBookmarkSchema),
    onResult: ({ result }) => {
      if (result.type === "redirect") {
        isUpdateBookmarkDialogOpen = false;
      }
    }
  });

  const {
    form: updateFormData,
    submitting: updateSubmitting,
    reset: updateReset,
    enhance: updateEnhance
  } = updateForm;

  // svelte-ignore state_referenced_locally
  const deleteForm = superForm(deleteBookmarkForm, {
    id: "delete-bookmark-form",
    validators: zod4Client(deleteBookmarkSchema),
    onResult: ({ result }) => {
      if (result.type === "redirect") {
        isDeleteBookmarkDialogOpen = false;
      }
    }
  });

  const {
    form: deleteFormData,
    submitting: deleteSubmitting,
    reset: deleteReset,
    enhance: deleteEnhance
  } = deleteForm;

  const handleUpdateBookmarkDialogOpen = (data: Bookmark) => {
    selectedCollectionId = data.collectionId ?? "";

    updateReset({
      data: {
        id: data.id,
        collectionId: data.collectionId,
        url: data.url,
        title: data.title,
        description: data.description
      }
    });

    isUpdateBookmarkDialogOpen = true;
  };

  const handleDeleteBookmarkDialogOpen = (data: Bookmark) => {
    deleteReset({
      data: {
        id: data.id
      }
    });

    isDeleteBookmarkDialogOpen = true;
  };

  $effect(() => {
    if (bookmarks) {
      isBookmarks = false;
    }

    $updateFormData.collectionId = selectedCollectionId === "" ? null : selectedCollectionId;
  });
</script>

<div class="flex flex-col gap-8">
  {#if !hideHeader}
    <div>
      <h1>{title}</h1>
      <p class="text-muted-foreground">
        You have {hasBookmarks ? bookmarks.length : 0} bookmark(s) saved.
      </p>
    </div>
  {/if}
  {#if !hasBookmarks}
    <Empty.Root class="my-28 sm:my-56">
      <Empty.Header>
        <Empty.Media variant="icon">
          <BookmarkIcon />
        </Empty.Media>
        <Empty.Title>{emptyTitle}</Empty.Title>
        <Empty.Description>{emptyDescription}</Empty.Description>
      </Empty.Header>
    </Empty.Root>
  {:else}
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#if isBookmarks}
        {#each Array(8)}
          <Card.Root class="border-transparent">
            <Card.Header>
              <Card.Title class="flex items-center gap-2">
                <Skeleton class="size-4" />
                <Skeleton class="h-4 w-4/5" />
              </Card.Title>
              <Card.Description>
                <Skeleton class="h-4 w-2/5" />
              </Card.Description>
              <Card.Action>
                <Skeleton class="size-9" />
              </Card.Action>
            </Card.Header>
            <Card.Content>
              <Skeleton class="h-12 w-full" />
            </Card.Content>
            <Card.Footer class="mt-auto flex items-center justify-between gap-2">
              <Skeleton class="h-4 w-16" />
              <Skeleton class="h-4 w-20" />
            </Card.Footer>
          </Card.Root>
        {/each}
      {:else}
        {#each bookmarks as bookmark (bookmark.id)}
          <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
            <Card.Root class="not-typography h-full">
              <Card.Header>
                <Card.Title class="flex items-center gap-2">
                  <Avatar.Root class="size-4 rounded-lg">
                    <Avatar.Image src={bookmark.favicon} alt={bookmark.title} />
                    <Avatar.Fallback class="rounded-lg">
                      {toUpperCase(charAt(bookmark.title, 0))}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <p class="line-clamp-1">{bookmark.title}</p>
                </Card.Title>
                <Card.Description>{bookmark.host}</Card.Description>
                <Card.Action>
                  <ButtonGroup.Root>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onclick={() => handleUpdateBookmarkDialogOpen(bookmark)}>
                      <Settings2Icon />
                      <span class="sr-only">Update</span>
                    </Button>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        {#snippet child({ props })}
                          <Button {...props} variant="outline" size="icon-sm">
                            <ChevronDownIcon />
                            <span class="sr-only">Manage Bookmark</span>
                          </Button>
                        {/snippet}
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content align="end">
                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            variant="destructive"
                            onclick={() => handleDeleteBookmarkDialogOpen(bookmark)}>
                            <Trash2Icon />
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Group>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </ButtonGroup.Root>
                </Card.Action>
              </Card.Header>
              <Card.Content>
                <p class="line-clamp-2">{bookmark.description}</p>
              </Card.Content>
              <Card.Footer class="mt-auto flex items-center justify-between gap-2">
                {#if bookmark.collectionId}
                  <a
                    href={resolve(`/collection/${collectionsById[bookmark.collectionId].slug}`)}
                    class={badgeVariants({ variant: "secondary" })}>
                    {collectionsById[bookmark.collectionId].name}
                  </a>
                {:else}
                  <a href={resolve("/unsorted")} class={badgeVariants({ variant: "secondary" })}>
                    Unsorted
                  </a>
                {/if}
                <p class="line-clamp-1 text-xs text-muted-foreground">
                  {format(bookmark.updatedAt, "PP")}
                </p>
              </Card.Footer>
            </Card.Root>
          </a>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<Dialog.Root bind:open={isUpdateBookmarkDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Update Bookmark</Dialog.Title>
      <Dialog.Description>Modify the URL, title, description, or collection.</Dialog.Description>
    </Dialog.Header>
    <form
      id="update-bookmark-form"
      class="flex flex-col gap-4"
      action="/bookmark/update"
      method="post"
      use:updateEnhance>
      <Form.Field form={updateForm} name="id">
        <Form.Control>
          {#snippet children({ props })}
            <Input type="hidden" bind:value={$updateFormData.id} {...props} />
          {/snippet}
        </Form.Control>
      </Form.Field>
      <Form.Field form={updateForm} name="collectionId">
        <Form.Control>
          {#snippet children({ props })}
            <Input type="hidden" bind:value={$updateFormData.collectionId} {...props} />
          {/snippet}
        </Form.Control>
      </Form.Field>
      <Form.Field form={updateForm} name="url">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>URL</Form.Label>
            <Input type="url" bind:value={$updateFormData.url} {...props} />
          {/snippet}
        </Form.Control>
        <Form.Description>Paste the URL of the webpage you want to save.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={updateForm} name="title">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Title</Form.Label>
            <Input type="text" bind:value={$updateFormData.title} {...props} />
          {/snippet}
        </Form.Control>
        <Form.Description>A title to help you identify this bookmark.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={updateForm} name="description">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Description</Form.Label>
            <Textarea bind:value={$updateFormData.description} {...props} />
          {/snippet}
        </Form.Control>
        <Form.Description>Add notes or context about this webpage.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={updateForm} name="collectionId">
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
                {#each collections as collection (collection.id)}
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
      <Button type="submit" form="update-bookmark-form" disabled={$updateSubmitting}>
        {#if $updateSubmitting}
          <Spinner />
        {/if}
        Update Bookmark
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={isDeleteBookmarkDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete Bookmark</AlertDialog.Title>
      <AlertDialog.Description>
        This bookmark will be permanently deleted and cannot be recovered.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <form id="delete-bookmark-form" action="/bookmark/delete" method="post" use:deleteEnhance>
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
        form="delete-bookmark-form"
        class={buttonVariants({ variant: "destructive" })}
        disabled={$deleteSubmitting}>
        {#if $deleteSubmitting}
          <Spinner />
        {/if}
        Delete Bookmark
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
