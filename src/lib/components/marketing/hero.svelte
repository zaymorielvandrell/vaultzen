<script lang="ts">
  import { ArrowRightIcon, MessageCircleIcon } from "@lucide/svelte";
  import DashboardScreenshot from "$lib/assets/dashboard-screenshot.png";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
</script>

<div class="relative overflow-hidden">
  <div class="absolute inset-0 z-20 opacity-80">
    <div
      class="absolute top-0 left-0 h-320 w-140 -translate-y-88.5 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_32.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]">
    </div>
    <div
      class="absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]">
    </div>
    <div
      class="absolute top-0 left-0 h-320 w-60 -translate-y-88.5 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]">
    </div>
  </div>
  <div class="relative z-20 container max-w-2xl py-32 text-center">
    <Badge variant="outline">
      <MessageCircleIcon class="text-primary" />
      Your bookmarks, perfectly organized
    </Badge>
    <h1 class="mt-6 mb-4">Bookmark manager, revolutionized.</h1>
    <p class="mb-16">
      Easy-to-use, VaultZen lets you save, customize, and manage all your bookmarks and important
      links online like a breeze.
    </p>
    <Button href="/sign-in" size="lg" class="mb-2">
      Get Started for Free
      <ArrowRightIcon />
    </Button>
    <p class="text-sm text-muted-foreground">No credit card required</p>
  </div>
  <div class="container max-w-6xl">
    <div class="-mt-16 -mr-16 perspective-distant">
      <div class="transform-[rotateX(10deg)]">
        <div class="relative skew-x-[.50rad]">
          <div
            class="absolute -inset-16 z-10 bg-linear-to-r from-background via-transparent to-background">
          </div>
          <div
            class="absolute -inset-16 z-10 bg-linear-to-b from-background via-transparent to-background">
          </div>
          <div
            class="absolute -inset-16 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[20px_20px] [--color-border:color-mix(in_oklab,var(--color-foreground)_30%,transparent)]">
          </div>
          <div class="absolute inset-0 z-20 bg-linear-to-l from-background to-transparent"></div>
          <div class="absolute inset-0 z-20 bg-linear-to-t from-background to-transparent"></div>
          <img
            class="relative z-10 rounded-md"
            src={DashboardScreenshot}
            alt="Dashboard Screenshot" />
        </div>
      </div>
    </div>
  </div>
</div>
