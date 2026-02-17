<script lang="ts">
  import { Bookmark } from "@lucide/svelte";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();
</script>

<Sidebar.Provider style="--sidebar-width: 18rem; --sidebar-width-mobile: 18rem;">
  <AppSidebar {data} />
  <div class="dashboard-typography w-full px-4 sm:px-6 md:px-8 lg:px-10">
    <header class="flex min-h-12 w-full items-center py-4">
      <div class="inline-flex w-1/2 items-center justify-start">
        <Sidebar.Trigger />
      </div>
      <div class="inline-flex w-1/2 items-center justify-end">
        <Button>
          <Bookmark />
          Add Bookmark
        </Button>
      </div>
    </header>
    <main class="py-2">
      {@render children()}
    </main>
  </div>
</Sidebar.Provider>
