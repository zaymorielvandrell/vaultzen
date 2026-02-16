<script lang="ts">
  import { enhance } from "$app/forms";
</script>

<div>
  <h1>Login</h1>
  <form method="post" action="?/signInSocial" use:enhance>
    <input type="hidden" name="provider" value="github" />
    <input type="hidden" name="callbackURL" value="/dashboard" />
    <button>Sign in with GitHub</button>
  </form>
</div>
