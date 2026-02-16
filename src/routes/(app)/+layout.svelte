<script lang="ts">
  import { APIError } from "better-auth";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { auth } from "$lib/auth/client";
  import { delay } from "$lib/utils";
  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();

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

<div>
  <header>
    <button type="button" onclick={handleSignOut}>
      {#if isSignOut}
        Loading...
      {:else}
        Sign out
      {/if}
    </button>
  </header>
  <main>
    {@render children()}
  </main>
</div>
