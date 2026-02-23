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
    <p class="text-muted-foreground">Save and Organize Your Web Finds Seamlessly.</p>
  </div>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-12">
    <div
      class="flex flex-col justify-between gap-6 rounded-lg border border-card bg-card p-6 text-card-foreground sm:col-span-7">
      <div>
        <h3>Organize Like a Pro</h3>
        <p class="text-muted-foreground">Effortless organization, unmatched simplicity.</p>
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
        <h3>Customizable Views</h3>
        <p class="text-muted-foreground">View your bookmarks your way.</p>
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
        <h3>Personalize to Your Liking</h3>
        <p class="text-muted-foreground">Custom collections, a seamless browsing experience.</p>
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
          <h3>Mobile Experience</h3>
          <p class="text-muted-foreground">
            Access VaultZen seamlessly on the go. Enjoy a great experience on mobile devices.
          </p>
        </div>
        <Button href="/sign-in" variant="outline" size="sm">
          Try VaultZen Now
          <ChevronRightIcon />
        </Button>
      </div>
      <div class="h-72 w-1/2 translate-y-16 overflow-hidden rounded-md">
        <enhanced:img src={MobileDashboardScreenshot} alt="Mobile Dashboard Screenshot" />
      </div>
    </div>
  </div>
</div>
