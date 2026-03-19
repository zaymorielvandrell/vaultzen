<script lang="ts">
  import { BellRingIcon, ChromiumIcon, GlobeIcon, ShieldIcon } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
</script>

<div class="container max-w-4xl py-32">
  <div
    class="relative overflow-hidden rounded-lg border border-card bg-card px-4 py-16 text-center text-card-foreground">
    <div
      class="absolute top-0 right-0 h-3/5 w-2/5 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/20 blur-[6.25rem]">
    </div>
    <div class="mx-auto mb-16 max-w-2xl">
      <div class="flex items-center justify-center gap-6">
        <div
          class="flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
          <ChromiumIcon />
        </div>
        <div
          class="flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
          <ShieldIcon />
        </div>
        <div
          class="flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
          <GlobeIcon />
        </div>
      </div>
      <h2 class="mt-6 mb-4">
        Save from anywhere
        <br />
        VaultZen for every browser
      </h2>
      <p class="text-muted-foreground">
        Browser extensions for Chrome, Edge, Firefox, and Safari are on the way, so saving links
        will feel just as smooth as organizing them.
      </p>
    </div>
    <Button href="/sign-in" size="lg">
      <BellRingIcon />
      Coming Soon
    </Button>
  </div>
</div>
