<script lang="ts">
  import { APIError } from "better-auth/api";
  import { auth } from "$lib/auth/client";
  import { delay } from "$lib/utils";

  let isSignIn = $state(false);

  const handleSignIn = async () => {
    isSignIn = true;

    await delay();

    try {
      const { error } = await auth.signIn.social({
        provider: "github",
        callbackURL: "/dashboard"
      });

      if (error) {
        console.error("Could not sign in");
      }
    } catch (error) {
      if (error instanceof APIError) {
        console.error(error.message);
      }
    } finally {
      isSignIn = false;
    }
  };
</script>

<div>
  <h1>Welcome to Vaultzen</h1>
  <p>Sign in with GitHub to save and organize your links.</p>
  <button type="button" onclick={handleSignIn}>
    {#if isSignIn}
      Loading...
    {:else}
      Continue with GitHub
    {/if}
  </button>
  <p>By continuing, you agree to our Terms and Privacy Policy.</p>
</div>
