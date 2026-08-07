import raw from "./posts.json";

/**
 * Every blog post, in one place.
 *
 * To publish a new one: drop the markdown in public/, add an entry here.
 * That's it — the index page, the /blog/:slug route, the sitemap and the
 * prerendered HTML all read from this same list. posts.json rather than a
 * .ts literal so the build script can read it too without a TS toolchain.
 */
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  topic: string;
  minutes: number;
  markdown: string;
};

// Newest first.
export const posts: Post[] = [...(raw as Post[])].sort((a, b) =>
  b.date.localeCompare(a.date)
);

export const findPost = (slug?: string) => posts.find((p) => p.slug === slug);
