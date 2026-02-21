<script lang="ts">
  import { APIError } from "better-auth";
  import type { InferSelectModel } from "drizzle-orm";
  import { charAt, toUpperCase } from "string-ts";
  import { toast } from "svelte-sonner";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import {
    ChevronsUpDown,
    Folder,
    GalleryVerticalEnd,
    Inbox,
    LogOut,
    Plus,
    UserCog
  } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { auth } from "$lib/auth/client";
  import * as Avatar from "$lib/components/ui/avatar";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import { Spinner } from "$lib/components/ui/spinner";
  import { Textarea } from "$lib/components/ui/textarea";
  import { createCollectionSchema, type CreateCollectionSchema } from "$lib/schemas/collection";
  import { updateProfileSchema, type UpdateProfileSchema } from "$lib/schemas/profile";
  import type { collection, user } from "$lib/server/db/schema";

  interface Props {
    data: {
      user: Omit<InferSelectModel<typeof user>, "image"> & {
        image?: string | null | undefined;
      };
      collections: InferSelectModel<typeof collection>[];
      createCollectionForm: SuperValidated<Infer<CreateCollectionSchema>>;
      updateProfileForm: SuperValidated<Infer<UpdateProfileSchema>>;
    };
  }

  let { data }: Props = $props();

  let isCollections = $state(true);
  let isCreateCollectionDialogOpen = $state(false);
  let isUpdateProfileDialogOpen = $state(false);
  let isSignOut = $state(false);

  const items = [
    { title: "All Bookmarks", url: "/dashboard", icon: GalleryVerticalEnd },
    { title: "Unsorted", url: "/unsorted", icon: Inbox }
  ] as const;

  // svelte-ignore state_referenced_locally
  const createForm = superForm(data.createCollectionForm, {
    id: "create-collection-form",
    validators: zod4Client(createCollectionSchema),
    onResult: ({ result }) => {
      if (result.type === "redirect") {
        isCreateCollectionDialogOpen = false;
      }
    }
  });

  const { form: createFormData, submitting: createSubmitting, enhance: createEnhance } = createForm;

  // svelte-ignore state_referenced_locally
  const updateForm = superForm(data.updateProfileForm, {
    id: "update-profile-form",
    validators: zod4Client(updateProfileSchema),
    onResult: ({ result }) => {
      if (result.type === "success") {
        isUpdateProfileDialogOpen = false;
      }
    }
  });

  const {
    form: updateFormData,
    submitting: updateSubmitting,
    reset: updateReset,
    enhance: updateEnhance
  } = updateForm;

  const handleUpdateProfileDialogOpen = () => {
    updateReset({
      data: {
        name: data.user.name
      }
    });

    isUpdateProfileDialogOpen = true;
  };

  const handleSignOut = async () => {
    isSignOut = true;

    try {
      const { error } = await auth.signOut();

      if (error) {
        toast.error("Could not sign out");
        return;
      }

      await goto(resolve("/sign-in"));
    } catch (error) {
      if (error instanceof APIError) {
        toast.error(error.message);
      }
    } finally {
      isSignOut = false;
    }
  };

  $effect(() => {
    if (data.collections) {
      isCollections = false;
    }
  });
</script>

<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={resolve(item.url)} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Your Collections</Sidebar.GroupLabel>
      <Sidebar.GroupAction onclick={() => (isCreateCollectionDialogOpen = true)}>
        <Plus />
        <span class="sr-only">Create Collection</span>
      </Sidebar.GroupAction>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#if isCollections}
            {#each Array(6)}
              <Sidebar.MenuItem>
                <Sidebar.MenuSkeleton showIcon />
              </Sidebar.MenuItem>
            {/each}
          {:else}
            {#each data.collections as collection (collection.id)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>
                  {#snippet child({ props })}
                    <a href={resolve(`/collection/${collection.slug}`)} {...props}>
                      <Folder />
                      <span>{collection.name}</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          {/if}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Sidebar.MenuButton {...props}>
                {#if isSignOut}
                  <Spinner />
                {:else}
                  <Avatar.Root class="size-6 rounded-lg">
                    <Avatar.Image src={data.user.image} alt={data.user.name} />
                    <Avatar.Fallback class="rounded-lg">
                      {toUpperCase(charAt(data.user.name, 0))}
                    </Avatar.Fallback>
                  </Avatar.Root>
                {/if}
                {data.user.name}
                <ChevronsUpDown class="ms-auto" />
              </Sidebar.MenuButton>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            side="top"
            sideOffset={8}
            class="w-(--bits-dropdown-menu-anchor-width)">
            <DropdownMenu.Group>
              <DropdownMenu.Label>
                <div class="flex items-center gap-2">
                  <Avatar.Root class="rounded-lg">
                    <Avatar.Image src={data.user.image} alt={data.user.name} />
                    <Avatar.Fallback class="rounded-lg">
                      {toUpperCase(charAt(data.user.name, 0))}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div>
                    <p class="truncate">{data.user.name}</p>
                    <p class="truncate text-xs font-medium text-muted-foreground">
                      {data.user.email}
                    </p>
                  </div>
                </div>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onclick={handleUpdateProfileDialogOpen}>
                <UserCog />
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item variant="destructive" onclick={handleSignOut}>
                {#if isSignOut}
                  <Spinner />
                {:else}
                  <LogOut />
                {/if}
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
</Sidebar.Root>

<Dialog.Root bind:open={isCreateCollectionDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Collection</Dialog.Title>
      <Dialog.Description>
        Organize your bookmarks by topic, project, or any category you like.
      </Dialog.Description>
    </Dialog.Header>
    <form
      id="create-collection-form"
      class="flex flex-col gap-4"
      action="/collection/create"
      method="post"
      use:createEnhance>
      <Form.Field form={createForm} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name</Form.Label>
            <Input type="text" bind:value={$createFormData.name} {...props} />
          {/snippet}
        </Form.Control>
        <Form.Description>Give your collection a clear and descriptive name.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={createForm} name="description">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Description</Form.Label>
            <Textarea bind:value={$createFormData.description} {...props} />
          {/snippet}
        </Form.Control>
        <Form.Description>Add context to remember what this collection contains.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
    </form>
    <Dialog.Footer class="pt-4">
      <Dialog.Close class={buttonVariants({ variant: "outline" })}>Cancel</Dialog.Close>
      <Button type="submit" form="create-collection-form" disabled={$createSubmitting}>
        {#if $createSubmitting}
          <Spinner />
        {/if}
        Create Collection
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={isUpdateProfileDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Update Profile</Dialog.Title>
      <Dialog.Description>Change how your name appears in VaultZen.</Dialog.Description>
    </Dialog.Header>
    <form id="update-profile-form" action="/profile" method="post" use:updateEnhance>
      <Form.Field form={updateForm} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name</Form.Label>
            <Input type="text" bind:value={$updateFormData.name} {...props} />
          {/snippet}
        </Form.Control>
        <Form.Description>This name will be displayed throughout the app.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
    </form>
    <Dialog.Footer class="pt-4">
      <Dialog.Close class={buttonVariants({ variant: "outline" })}>Cancel</Dialog.Close>
      <Button type="submit" form="update-profile-form" disabled={$updateSubmitting}>
        {#if $updateSubmitting}
          <Spinner />
        {/if}
        Update Profile
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
