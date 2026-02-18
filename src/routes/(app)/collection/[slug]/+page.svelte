<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { ChevronDown, Settings2, Trash2 } from "@lucide/svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as ButtonGroup from "$lib/components/ui/button-group";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { Spinner } from "$lib/components/ui/spinner";
  import { Textarea } from "$lib/components/ui/textarea";
  import { deleteCollectionSchema, updateCollectionSchema } from "$lib/schemas/collection";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let isCollection = $state(true);
  let isUpdateCollectionDialogOpen = $state(false);
  let isDeleteCollectionDialogOpen = $state(false);

  // svelte-ignore state_referenced_locally
  const updateForm = superForm(data.updateCollectionForm, {
    id: "update-collection-form",
    validators: zod4Client(updateCollectionSchema),
    onResult: ({ result }) => {
      if (result.type === "redirect") {
        isUpdateCollectionDialogOpen = false;
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
  const deleteForm = superForm(data.deleteCollectionForm, {
    id: "delete-collection-form",
    validators: zod4Client(deleteCollectionSchema),
    onResult: ({ result }) => {
      if (result.type === "redirect") {
        isDeleteCollectionDialogOpen = false;
      }
    }
  });

  const {
    form: deleteFormData,
    submitting: deleteSubmitting,
    reset: deleteReset,
    enhance: deleteEnhance
  } = deleteForm;

  $effect(() => {
    if (data.collection) {
      isCollection = false;
    }

    updateReset({ data: data.updateCollectionForm.data });
    deleteReset({ data: data.deleteCollectionForm.data });
  });
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between gap-2">
    {#if isCollection}
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
        <Button variant="outline" size="icon" onclick={() => (isUpdateCollectionDialogOpen = true)}>
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
              <DropdownMenu.Item
                variant="destructive"
                onclick={() => (isDeleteCollectionDialogOpen = true)}>
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

<Dialog.Root bind:open={isUpdateCollectionDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit Collection</Dialog.Title>
      <Dialog.Description>Rename this collection or add a description.</Dialog.Description>
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
            <Input type="hidden" bind:value={$deleteFormData.id} {...props} />
          {/snippet}
        </Form.Control>
      </Form.Field>
      <Form.Field form={updateForm} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name</Form.Label>
            <Input type="text" bind:value={$updateFormData.name} {...props} />
          {/snippet}
        </Form.Control>
        <Form.Description>A memorable name for this collection.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={updateForm} name="description">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Description</Form.Label>
            <Textarea bind:value={$updateFormData.description} {...props} />
          {/snippet}
        </Form.Control>
        <Form.Description>What this collection is for (optional).</Form.Description>
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
      <AlertDialog.Title>Delete this collection?</AlertDialog.Title>
      <AlertDialog.Description>
        This will remove the collection and its bookmarks. You can always add them to another
        collection later.
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
