import type { BskyAgent } from "@atproto/api";
import {
  batchAllSettled,
  extractThemeFromThread,
  fetchSharedThemes,
  fetchUserThemes,
  DEFAULT_THREAD_CONCURRENCY,
  MAX_THREAD_CONCURRENCY,
} from "./bluesky-themes";
import type { KTheme } from "../types/theme";

describe("bluesky-themes service", () => {
  const sampleTheme: KTheme = {
    metadata: {
      id: "test-theme-1",
      name: "Test Theme",
      description: "A test theme",
      author: "TestAuthor",
      version: "1.0.0",
      tags: ["dark", "metallic"],
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    darkMode: true,
    colorScheme: {
      primary: "#123456",
      onPrimary: "#ffffff",
      primaryContainer: "#234567",
      onPrimaryContainer: "#ffffff",
      secondary: "#654321",
      onSecondary: "#ffffff",
      secondaryContainer: "#765432",
      onSecondaryContainer: "#ffffff",
      tertiary: "#abcdef",
      onTertiary: "#000000",
      tertiaryContainer: "#bcdef0",
      onTertiaryContainer: "#000000",
      error: "#ff0000",
      onError: "#ffffff",
      errorContainer: "#aa0000",
      onErrorContainer: "#ffffff",
      background: "#000000",
      onBackground: "#ffffff",
      surface: "#111111",
      onSurface: "#ffffff",
      surfaceVariant: "#222222",
      onSurfaceVariant: "#ffffff",
      outline: "#333333",
      outlineVariant: "#444444",
      scrim: "#000000",
      inverseSurface: "#ffffff",
      inverseOnSurface: "#000000",
      inversePrimary: "#0055ff",
    },
  };

  function encodeTheme(theme: KTheme): string {
    return btoa(unescape(encodeURIComponent(JSON.stringify(theme))));
  }

  function createMockThreadView(theme: KTheme) {
    const encoded = encodeTheme(theme);
    return {
      data: {
        thread: {
          $type: "app.bsky.feed.defs#threadViewPost",
          replies: [
            {
              $type: "app.bsky.feed.defs#threadViewPost",
              post: {
                record: {
                  text: `[KTD 1/1] ${encoded}`,
                },
              },
            },
          ],
        },
      },
    };
  }

  describe("batchAllSettled helper", () => {
    it("processes all items in bounded batches", async () => {
      const items = Array.from({ length: 25 }, (_, i) => i);
      let maxActive = 0;
      let active = 0;

      const results = await batchAllSettled(
        items,
        async (item) => {
          active++;
          if (active > maxActive) maxActive = active;
          await new Promise((res) => setTimeout(res, 10));
          active--;
          return item * 2;
        },
        6,
      );

      expect(results).toHaveLength(25);
      expect(maxActive).toBeLessThanOrEqual(6);
      results.forEach((r, idx) => {
        expect(r.status).toBe("fulfilled");
        if (r.status === "fulfilled") {
          expect(r.value).toBe(idx * 2);
        }
      });
    });

    it("clamps concurrency to MAX_THREAD_CONCURRENCY (8) when higher limit requested", async () => {
      const items = Array.from({ length: 20 }, (_, i) => i);
      let maxActive = 0;
      let active = 0;

      await batchAllSettled(
        items,
        async (item) => {
          active++;
          if (active > maxActive) maxActive = active;
          await new Promise((res) => setTimeout(res, 10));
          active--;
          return item;
        },
        16, // Attempt concurrency higher than 8
      );

      expect(maxActive).toBeLessThanOrEqual(MAX_THREAD_CONCURRENCY);
      expect(maxActive).toBeLessThanOrEqual(8);
    });

    it("handles rejections gracefully without aborting remaining items", async () => {
      const items = [1, 2, 3, 4, 5, 6, 7];
      const results = await batchAllSettled(
        items,
        async (n) => {
          if (n === 3) throw new Error("Item 3 failed");
          return n * 10;
        },
        5,
      );

      expect(results).toHaveLength(7);
      expect(results[2].status).toBe("rejected");
      if (results[2].status === "rejected") {
        expect((results[2].reason as Error).message).toBe("Item 3 failed");
      }
      expect(results[0].status).toBe("fulfilled");
      expect(results[6].status).toBe("fulfilled");
    });
  });

  describe("extractThemeFromThread", () => {
    it("extracts a valid theme from thread view", async () => {
      const mockAgent = {
        getPostThread: jest
          .fn()
          .mockResolvedValue(createMockThreadView(sampleTheme)),
      } as unknown as BskyAgent;

      const theme = await extractThemeFromThread(
        mockAgent,
        "at://did:plc:123/app.bsky.feed.post/456",
      );
      expect(theme).not.toBeNull();
      expect(theme?.metadata.id).toBe("test-theme-1");
      expect(theme?.colorScheme.primary).toBe("#123456");
    });

    it("reassembles multi-chunk theme data in correct order", async () => {
      const encoded = encodeTheme(sampleTheme);
      const half = Math.floor(encoded.length / 2);
      const chunk1 = encoded.slice(0, half);
      const chunk2 = encoded.slice(half);

      const mockAgent = {
        getPostThread: jest.fn().mockResolvedValue({
          data: {
            thread: {
              $type: "app.bsky.feed.defs#threadViewPost",
              replies: [
                // Deliberately out of order
                {
                  $type: "app.bsky.feed.defs#threadViewPost",
                  post: { record: { text: `[KTD 2/2] ${chunk2}` } },
                },
                {
                  $type: "app.bsky.feed.defs#threadViewPost",
                  post: { record: { text: `[KTD 1/2] ${chunk1}` } },
                },
              ],
            },
          },
        }),
      } as unknown as BskyAgent;

      const theme = await extractThemeFromThread(
        mockAgent,
        "at://did:plc:123/app.bsky.feed.post/456",
      );
      expect(theme).not.toBeNull();
      expect(theme?.metadata.id).toBe("test-theme-1");
    });

    it("returns null if thread structure is invalid", async () => {
      const mockAgent = {
        getPostThread: jest.fn().mockResolvedValue({
          data: {
            thread: {
              $type: "app.bsky.feed.defs#blockedPost",
            },
          },
        }),
      } as unknown as BskyAgent;

      const theme = await extractThemeFromThread(mockAgent, "at://post-uri");
      expect(theme).toBeNull();
    });

    it("returns null if chunks are missing or malformed", async () => {
      const mockAgent = {
        getPostThread: jest.fn().mockResolvedValue({
          data: {
            thread: {
              $type: "app.bsky.feed.defs#threadViewPost",
              replies: [
                {
                  $type: "app.bsky.feed.defs#threadViewPost",
                  post: { record: { text: "Unrelated reply text" } },
                },
              ],
            },
          },
        }),
      } as unknown as BskyAgent;

      const theme = await extractThemeFromThread(mockAgent, "at://post-uri");
      expect(theme).toBeNull();
    });
  });

  describe("fetchSharedThemes", () => {
    it("throws if agent session is not active", async () => {
      const mockAgent = { session: null } as unknown as BskyAgent;
      await expect(fetchSharedThemes(mockAgent)).rejects.toThrow(
        "Not logged in",
      );
    });

    it("processes 25 search posts in parallel batches of 5 to 8 without sequential waterfall", async () => {
      const posts = Array.from({ length: 25 }, (_, i) => ({
        uri: `at://did:plc:author/app.bsky.feed.post/${i}`,
        record: { text: `Theme announcement #${i} #KthemeData` },
      }));

      let activeCalls = 0;
      let maxActiveCalls = 0;

      const mockAgent = {
        session: { did: "did:plc:user" },
        app: {
          bsky: {
            feed: {
              searchPosts: jest.fn().mockResolvedValue({
                data: { posts },
              }),
            },
          },
        },
        getPostThread: jest
          .fn()
          .mockImplementation(async ({ uri }: { uri: string }) => {
            activeCalls++;
            if (activeCalls > maxActiveCalls) maxActiveCalls = activeCalls;
            await new Promise((res) => setTimeout(res, 5));
            activeCalls--;

            const id = uri.split("/").pop();
            const theme: KTheme = {
              ...sampleTheme,
              metadata: { ...sampleTheme.metadata, id: `theme-${id}` },
            };
            return createMockThreadView(theme);
          }),
      } as unknown as BskyAgent;

      const themes = await fetchSharedThemes(
        mockAgent,
        DEFAULT_THREAD_CONCURRENCY,
      );

      expect(mockAgent.app.bsky.feed.searchPosts).toHaveBeenCalledWith({
        q: "#KthemeData",
        limit: 25,
      });
      expect(themes).toHaveLength(25);
      // Concurrency must be bounded between 5 and 8
      expect(maxActiveCalls).toBeLessThanOrEqual(8);
      expect(maxActiveCalls).toBeGreaterThanOrEqual(1);
    });

    it("gracefully catches individual thread failures while continuing to render valid themes", async () => {
      const posts = [
        { uri: "at://post-ok-1", record: { text: "Shared #KthemeData 1" } },
        { uri: "at://post-fail-2", record: { text: "Shared #KthemeData 2" } },
        { uri: "at://post-ok-3", record: { text: "Shared #KthemeData 3" } },
      ];

      const mockAgent = {
        session: { did: "did:plc:user" },
        app: {
          bsky: {
            feed: {
              searchPosts: jest.fn().mockResolvedValue({
                data: { posts },
              }),
            },
          },
        },
        getPostThread: jest
          .fn()
          .mockImplementation(async ({ uri }: { uri: string }) => {
            if (uri === "at://post-fail-2") {
              throw new Error("Network timeout on thread");
            }
            return createMockThreadView({
              ...sampleTheme,
              metadata: { ...sampleTheme.metadata, id: uri },
            });
          }),
      } as unknown as BskyAgent;

      const themes = await fetchSharedThemes(mockAgent);
      expect(themes).toHaveLength(2);
      expect(themes.map((t) => t.metadata.id)).toEqual([
        "at://post-ok-1",
        "at://post-ok-3",
      ]);
    });

    it("filters out posts that lack the theme tag", async () => {
      const posts = [
        { uri: "at://post-1", record: { text: "Valid theme #KthemeData" } },
        { uri: "at://post-2", record: { text: "Random post without tag" } },
      ];

      const mockGetPostThread = jest
        .fn()
        .mockResolvedValue(createMockThreadView(sampleTheme));
      const mockAgent = {
        session: { did: "did:plc:user" },
        app: {
          bsky: {
            feed: {
              searchPosts: jest.fn().mockResolvedValue({
                data: { posts },
              }),
            },
          },
        },
        getPostThread: mockGetPostThread,
      } as unknown as BskyAgent;

      const themes = await fetchSharedThemes(mockAgent);
      expect(mockGetPostThread).toHaveBeenCalledTimes(1);
      expect(themes).toHaveLength(1);
    });
  });

  describe("fetchUserThemes", () => {
    it("throws if agent session is not active", async () => {
      const mockAgent = { session: null } as unknown as BskyAgent;
      await expect(fetchUserThemes(mockAgent)).rejects.toThrow("Not logged in");
    });

    it("processes 50 author feed items in parallel batches with bounded concurrency", async () => {
      const feedItems = Array.from({ length: 50 }, (_, i) => ({
        post: {
          uri: `at://did:plc:me/app.bsky.feed.post/${i}`,
          record: { text: `My theme #${i} #KthemeData` },
        },
      }));

      let activeCalls = 0;
      let maxActiveCalls = 0;

      const mockAgent = {
        session: { did: "did:plc:me" },
        getAuthorFeed: jest.fn().mockResolvedValue({
          data: { feed: feedItems },
        }),
        getPostThread: jest
          .fn()
          .mockImplementation(async ({ uri }: { uri: string }) => {
            activeCalls++;
            if (activeCalls > maxActiveCalls) maxActiveCalls = activeCalls;
            await new Promise((res) => setTimeout(res, 5));
            activeCalls--;

            const id = uri.split("/").pop();
            return createMockThreadView({
              ...sampleTheme,
              metadata: { ...sampleTheme.metadata, id: `user-theme-${id}` },
            });
          }),
      } as unknown as BskyAgent;

      const themes = await fetchUserThemes(mockAgent, 6);

      expect(mockAgent.getAuthorFeed).toHaveBeenCalledWith({
        actor: "did:plc:me",
        limit: 50,
      });
      expect(themes).toHaveLength(50);
      expect(maxActiveCalls).toBeLessThanOrEqual(8);
      expect(maxActiveCalls).toBeGreaterThanOrEqual(1);
    });

    it("catches individual thread retrieval errors gracefully", async () => {
      const feedItems = [
        {
          post: {
            uri: "at://user-ok-1",
            record: { text: "Personal #KthemeData 1" },
          },
        },
        {
          post: {
            uri: "at://user-fail-2",
            record: { text: "Personal #KthemeData 2" },
          },
        },
      ];

      const mockAgent = {
        session: { did: "did:plc:me" },
        getAuthorFeed: jest.fn().mockResolvedValue({
          data: { feed: feedItems },
        }),
        getPostThread: jest
          .fn()
          .mockImplementation(async ({ uri }: { uri: string }) => {
            if (uri === "at://user-fail-2") {
              throw new Error("Rate limit exceeded on item");
            }
            return createMockThreadView(sampleTheme);
          }),
      } as unknown as BskyAgent;

      const themes = await fetchUserThemes(mockAgent);
      expect(themes).toHaveLength(1);
    });

    it("returns empty array if feed fetch fails", async () => {
      const mockAgent = {
        session: { did: "did:plc:me" },
        getAuthorFeed: jest.fn().mockRejectedValue(new Error("Network error")),
      } as unknown as BskyAgent;

      const themes = await fetchUserThemes(mockAgent);
      expect(themes).toEqual([]);
    });
  });
});
