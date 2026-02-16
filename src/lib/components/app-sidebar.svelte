<script lang="ts">
  import { APIError } from "better-auth";
  import type { InferSelectModel } from "drizzle-orm";
  import { charAt, toUpperCase } from "string-ts";
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
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import { Spinner } from "$lib/components/ui/spinner";
  import type { user } from "$lib/server/db/schema";
  import { delay } from "$lib/utils";

  interface Props {
    data: {
      user: Omit<InferSelectModel<typeof user>, "image"> & {
        image?: string | null | undefined;
      };
    };
  }

  let { data }: Props = $props();

  const items = [
    { title: "All Bookmarks", url: "/dashboard", icon: GalleryVerticalEnd },
    { title: "Unsorted", url: "/unsorted", icon: Inbox }
  ] as const;

  const collections = [
    { title: "Collection #1", url: "/dashboard", icon: Folder },
    { title: "Collection #2", url: "/dashboard", icon: Folder },
    { title: "Collection #3", url: "/dashboard", icon: Folder },
    { title: "Collection #4", url: "/dashboard", icon: Folder },
    { title: "Collection #5", url: "/dashboard", icon: Folder }
  ] as const;

  let isSignOut = $state(false);

  const handleSignOut = async () => {
    isSignOut = true;

    await delay();

    try {
      const { error } = await auth.signOut();

      if (error) {
        console.error("Could not sign out");

        return;
      }

      await goto(resolve("/sign-in"));
    } catch (error) {
      if (error instanceof APIError) {
        console.error(error.message);
      }
    } finally {
      isSignOut = false;
    }
  };
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
      <Sidebar.GroupAction>
        <Plus />
        <span class="sr-only">Create Collection</span>
      </Sidebar.GroupAction>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each collections as collection (collection.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={resolve(collection.url)} {...props}>
                    <collection.icon />
                    <span>{collection.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
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
              <DropdownMenu.Item>
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
