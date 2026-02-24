<script lang="ts">
  import { charAt, toUpperCase } from "string-ts";
  import * as Avatar from "$lib/components/ui/avatar";

  const testimonials = [
    {
      name: "Luz Camarillo",
      image: "https://randomuser.me/api/portraits/women/39.jpg",
      quote:
        "Finally, a bookmark manager that actually works. I can finally find my saved articles in seconds instead of scrolling through endless folders."
    },
    {
      name: "Claire Wagner",
      image: "https://randomuser.me/api/portraits/women/13.jpg",
      quote:
        "I used to lose track of important links all the time. VaultZen changed that - everything is organized and just a search away."
    },
    {
      name: "Margrethe Kvinge",
      image: "https://randomuser.me/api/portraits/women/76.jpg",
      quote:
        "The clean interface and fast search make VaultZen my go-to for saving everything from tutorials to product links."
    },
    {
      name: "Jonas Madsen",
      image: "https://randomuser.me/api/portraits/men/10.jpg",
      quote:
        "Love how I can access my bookmarks on both desktop and mobile. It's made my research workflow so much smoother."
    }
  ];
</script>

<div class="container max-w-4xl py-32">
  <div class="mb-16 text-center">
    <h2 class="mb-2">Loved by users</h2>
    <p class="text-muted-foreground">See what people are saying about VaultZen.</p>
  </div>
  <div class="grid grid-cols-1 gap-x-2 gap-y-6 sm:grid-cols-2">
    {#each testimonials as testimonial (testimonial.name)}
      <div class="not-typography flex flex-col gap-4">
        <div class="rounded-lg rounded-bl border border-card bg-card p-4 text-card-foreground">
          <p>{testimonial.quote}</p>
        </div>
        <div class="flex items-center gap-2">
          <Avatar.Root class="size-6 rounded-lg">
            <Avatar.Image src={testimonial.image} alt={testimonial.name} />
            <Avatar.Fallback class="rounded-lg">
              {toUpperCase(charAt(testimonial.name, 0))}
            </Avatar.Fallback>
          </Avatar.Root>
          <p class="text-sm font-medium">{testimonial.name}</p>
        </div>
      </div>
    {/each}
  </div>
</div>
