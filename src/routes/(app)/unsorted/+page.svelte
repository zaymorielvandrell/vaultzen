<script lang="ts">
  import BookmarkList from "$lib/components/bookmark-list.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const bookmarks = $derived(
    data.unsortedBookmarks.map((bookmark) => ({
      ...bookmark,
      host: new URL(bookmark.url).hostname
    }))
  );
</script>

<BookmarkList
  {bookmarks}
  collections={data.collections}
  updateBookmarkForm={data.updateBookmarkForm}
  deleteBookmarkForm={data.deleteBookmarkForm}
  title="Unsorted"
  emptyTitle="No bookmarks yet"
  emptyDescription="Save your first bookmark to get started." />
