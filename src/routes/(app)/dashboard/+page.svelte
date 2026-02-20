<script lang="ts">
  import BookmarkList from "$lib/components/bookmark-list.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const bookmarks = $derived(
    data.bookmarks.map((bookmark) => ({
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
  title="All Bookmarks"
  emptyTitle="No Bookmark Yet"
  emptyDescription="Save your first link to get started." />
