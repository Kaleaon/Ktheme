import type { BskyAgent } from "@atproto/api";
import type { KTheme, ThemePack } from "../types/theme.ts";

// We use Bluesky posts to share themes. The theme JSON is embedded in the post
// text as a special format, and theme packs are stored as a series of posts in
// a thread. This approach works without a custom lexicon — just regular posts
// with a recognizable tag structure.

const THEME_TAG = "#KthemeData";
const PACK_TAG = "#KthemePack";

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "\u2026" : s;
}

export async function shareTheme(
  agent: BskyAgent,
  theme: KTheme,
): Promise<string> {
  if (!agent.session) throw new Error("Not logged in");

  const themeJson = JSON.stringify(theme);
  const encoded = btoa(unescape(encodeURIComponent(themeJson)));

  // Post a human-readable announcement with the encoded theme data.
  // Bluesky post limit is 300 graphemes for text, but we can use facets
  // and store data in a series of posts for large themes.
  const displayText = [
    `${truncate(theme.metadata.name, 60)} - ${truncate(
      theme.metadata.description || "A Ktheme theme",
      100,
    )}`,
    "",
    `by ${theme.metadata.author || "Anonymous"}`,
    theme.metadata.tags.length ? `Tags: ${theme.metadata.tags.join(", ")}` : "",
    "",
    THEME_TAG,
  ]
    .filter(Boolean)
    .join("\n");

  // Create the main post
  const mainPost = await agent.post({
    text: truncate(displayText, 300),
    createdAt: new Date().toISOString(),
  });

  // Reply with the encoded theme data (can be long, split into chunks)
  const chunkSize = 290;
  const chunks: string[] = [];
  for (let i = 0; i < encoded.length; i += chunkSize) {
    chunks.push(encoded.slice(i, i + chunkSize));
  }

  let parentRef = {
    uri: mainPost.uri,
    cid: mainPost.cid,
  };

  for (let i = 0; i < chunks.length; i++) {
    const reply = await agent.post({
      text: `[KTD ${i + 1}/${chunks.length}] ${chunks[i]}`,
      reply: {
        root: { uri: mainPost.uri, cid: mainPost.cid },
        parent: parentRef,
      },
      createdAt: new Date().toISOString(),
    });
    parentRef = { uri: reply.uri, cid: reply.cid };
  }

  return mainPost.uri;
}

export async function shareThemePack(
  agent: BskyAgent,
  pack: ThemePack,
): Promise<string> {
  if (!agent.session) throw new Error("Not logged in");

  const packJson = JSON.stringify(pack);
  const encoded = btoa(unescape(encodeURIComponent(packJson)));

  const displayText = [
    `${truncate(pack.name, 60)} (${pack.themes.length} themes)`,
    truncate(pack.description || "", 100),
    `by ${pack.author || "Anonymous"}`,
    "",
    PACK_TAG,
  ]
    .filter(Boolean)
    .join("\n");

  const mainPost = await agent.post({
    text: truncate(displayText, 300),
    createdAt: new Date().toISOString(),
  });

  const chunkSize = 290;
  const chunks: string[] = [];
  for (let i = 0; i < encoded.length; i += chunkSize) {
    chunks.push(encoded.slice(i, i + chunkSize));
  }

  let parentRef = { uri: mainPost.uri, cid: mainPost.cid };

  for (let i = 0; i < chunks.length; i++) {
    const reply = await agent.post({
      text: `[KTP ${i + 1}/${chunks.length}] ${chunks[i]}`,
      reply: {
        root: { uri: mainPost.uri, cid: mainPost.cid },
        parent: parentRef,
      },
      createdAt: new Date().toISOString(),
    });
    parentRef = { uri: reply.uri, cid: reply.cid };
  }

  return mainPost.uri;
}

export const DEFAULT_THREAD_CONCURRENCY = 6;
export const MAX_THREAD_CONCURRENCY = 8;

/**
 * Executes async tasks with bounded concurrency using Promise.allSettled.
 * Parallel request concurrency is clamped to a maximum limit (default 6, capped at 8)
 * to prevent API rate throttling while executing requests in parallel batches.
 */
export async function batchAllSettled<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number = DEFAULT_THREAD_CONCURRENCY,
): Promise<PromiseSettledResult<R>[]> {
  const boundedConcurrency = Math.max(
    1,
    Math.min(concurrency, MAX_THREAD_CONCURRENCY),
  );
  const results: PromiseSettledResult<R>[] = [];

  for (let i = 0; i < items.length; i += boundedConcurrency) {
    const chunk = items.slice(i, i + boundedConcurrency);
    const chunkResults = await Promise.allSettled(
      chunk.map((item) => fn(item)),
    );
    results.push(...chunkResults);
  }

  return results;
}

/**
 * Retrieves a post thread and reassembles encoded theme data.
 * Returns null if the thread does not contain a valid KTheme or if data is malformed.
 */
export async function extractThemeFromThread(
  agent: BskyAgent,
  uri: string,
): Promise<KTheme | null> {
  const thread = await agent.getPostThread({ uri, depth: 10 });

  if (thread.data.thread.$type !== "app.bsky.feed.defs#threadViewPost") {
    return null;
  }

  const replies = (
    thread.data.thread as {
      replies?: Array<{
        $type: string;
        post: { record: Record<string, string> };
      }>;
    }
  ).replies;
  if (!replies) return null;

  // Collect and reassemble chunks
  const chunks: Array<{ index: number; data: string }> = [];
  for (const reply of replies) {
    if (reply.$type !== "app.bsky.feed.defs#threadViewPost") continue;
    const replyText = reply.post?.record?.text || "";
    const chunkMatch = replyText.match(/^\[KTD (\d+)\/\d+\] (.+)$/);
    if (chunkMatch) {
      chunks.push({
        index: parseInt(chunkMatch[1], 10),
        data: chunkMatch[2],
      });
    }
  }

  if (chunks.length === 0) return null;

  chunks.sort((a, b) => a.index - b.index);
  const encoded = chunks.map((c) => c.data).join("");
  const json = decodeURIComponent(escape(atob(encoded)));
  const theme = JSON.parse(json) as KTheme;

  if (theme.metadata?.id && theme.colorScheme?.primary) {
    return theme;
  }

  return null;
}

export async function fetchSharedThemes(
  agent: BskyAgent,
  concurrency: number = DEFAULT_THREAD_CONCURRENCY,
): Promise<KTheme[]> {
  if (!agent.session) throw new Error("Not logged in");

  const themes: KTheme[] = [];

  try {
    // Search for posts with our theme tag
    const searchResult = await agent.app.bsky.feed.searchPosts({
      q: THEME_TAG,
      limit: 25,
    });

    const targetPosts = (searchResult.data.posts || []).filter((post) => {
      const text = (post.record as Record<string, string>)?.text || "";
      return text.includes(THEME_TAG);
    });

    const settledResults = await batchAllSettled(
      targetPosts,
      (post) => extractThemeFromThread(agent, post.uri),
      concurrency,
    );

    for (const result of settledResults) {
      if (result.status === "fulfilled" && result.value) {
        themes.push(result.value);
      }
    }
  } catch {
    // Search may fail if not available
  }

  return themes;
}

export async function fetchUserThemes(
  agent: BskyAgent,
  concurrency: number = DEFAULT_THREAD_CONCURRENCY,
): Promise<KTheme[]> {
  if (!agent.session) throw new Error("Not logged in");

  const themes: KTheme[] = [];

  try {
    const feed = await agent.getAuthorFeed({
      actor: agent.session.did,
      limit: 50,
    });

    const targetItems = (feed.data.feed || []).filter((item) => {
      const text = (item.post?.record as Record<string, string>)?.text || "";
      return text.includes(THEME_TAG);
    });

    const settledResults = await batchAllSettled(
      targetItems,
      (item) => extractThemeFromThread(agent, item.post.uri),
      concurrency,
    );

    for (const result of settledResults) {
      if (result.status === "fulfilled" && result.value) {
        themes.push(result.value);
      }
    }
  } catch {
    // feed fetch failed
  }

  return themes;
}
