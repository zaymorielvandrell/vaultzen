<script lang="ts">
  import { BookmarkIcon, ChevronRightIcon, PaletteIcon, SmartphoneIcon } from "@lucide/svelte";
  import DashboardScreenshot from "$lib/assets/dashboard-screenshot.png";
  import MobileDashboardScreenshot from "$lib/assets/mobile-dashboard-screenshot.png";
  import { Button } from "$lib/components/ui/button";
</script>

<div id="features" class="container max-w-4xl py-32">
  <div class="mb-16 text-center">
    <div class="flex justify-center">
      <div
        class="flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
        <BookmarkIcon />
      </div>
    </div>
    <h2 class="mt-6 mb-4">
      The all-in-one
      <br />
      bookmark manager
    </h2>
    <p class="text-muted-foreground">Save, sort, and revisit your best finds in one place.</p>
  </div>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-12">
    <div
      class="flex flex-col justify-between gap-6 rounded-lg border border-card bg-card p-6 text-card-foreground sm:col-span-7">
      <div>
        <h3>Organize with clarity</h3>
        <p class="text-muted-foreground">
          Keep related links together with a structure that stays easy to scan.
        </p>
      </div>
      <div class="h-64 w-full overflow-hidden rounded-md">
        <enhanced:img
          class="origin-top-left scale-200"
          src={DashboardScreenshot}
          alt="Dashboard Screenshot" />
      </div>
    </div>
    <div
      class="flex flex-col justify-between gap-6 rounded-lg border border-card bg-card p-6 text-card-foreground sm:col-span-5">
      <div>
        <h3>Flexible views</h3>
        <p class="text-muted-foreground">
          Browse your saved links in a layout that feels simple and familiar.
        </p>
      </div>
      <div class="h-64 w-full overflow-hidden rounded-md">
        <enhanced:img
          class="origin-top-right scale-200"
          src={DashboardScreenshot}
          alt="Dashboard Screenshot" />
      </div>
    </div>
    <div
      class="flex flex-col gap-6 rounded-lg border border-card bg-card p-6 text-card-foreground sm:col-span-4">
      <div
        class="flex size-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
        <PaletteIcon />
      </div>
      <div>
        <h3>Make it yours</h3>
        <p class="text-muted-foreground">
          Create collections that match your projects, interests, and workflow.
        </p>
      </div>
    </div>
    <div
      class="flex justify-between gap-6 overflow-hidden rounded-lg border border-card bg-card p-6 text-card-foreground sm:col-span-8">
      <div class="w-1/2">
        <div
          class="flex size-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
          <SmartphoneIcon />
        </div>
        <div class="mt-6 mb-4">
          <h3>Works on mobile</h3>
          <p class="text-muted-foreground">
            Open VaultZen anywhere and manage your bookmarks comfortably on smaller screens.
          </p>
        </div>
        <Button href="/sign-in" variant="outline" size="sm">
          Try VaultZen
          <ChevronRightIcon />
        </Button>
      </div>
      <div class="h-72 w-1/2 translate-y-16 rotate-3 overflow-hidden rounded-md">
        <enhanced:img src={MobileDashboardScreenshot} alt="Mobile Dashboard Screenshot" />
      </div>
    </div>
  </div>
</div>
