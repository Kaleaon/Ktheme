import http from "node:http";

interface DiagnosticLogEntry {
  attempt: number;
  errors?: string[];
  [key: string]: unknown;
}

interface PostJsonData {
  theme?: unknown;
  reply?: string;
  text?: string;
  retries?: number;
  error?: string;
  errors?: string[];
  attempts?: number;
  issues?: Array<{ severity: string; message: string; code: string; path?: string }>;
  diagnosticLogs?: DiagnosticLogEntry[];
  raw?: string;
}

describe("Strict Backend Validation Gate with Re-Prompt Retry", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let serverModule: any;
  let server: http.Server;
  let port: number;
  let baseUrl: string;

  const validTheme = {
    schemaVersion: 2,
    metadata: {
      id: "valid-theme",
      name: "Valid Theme",
      description: "A valid high contrast theme",
      author: "AI-Generated",
      version: "1.0.0",
      tags: ["accessible", "dark"],
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    darkMode: true,
    colorScheme: {
      primary: "#10B981",
      onPrimary: "#000000",
      primaryContainer: "#064E3B",
      onPrimaryContainer: "#D1FAE5",
      secondary: "#3B82F6",
      onSecondary: "#000000",
      secondaryContainer: "#1E3A8A",
      onSecondaryContainer: "#DBEAFE",
      tertiary: "#6D28D9",
      onTertiary: "#FFFFFF",
      tertiaryContainer: "#4C1D95",
      onTertiaryContainer: "#EDE9FE",
      error: "#EF4444",
      onError: "#000000",
      errorContainer: "#7F1D1D",
      onErrorContainer: "#FEE2E2",
      background: "#0F172A",
      onBackground: "#F8FAFC",
      surface: "#1E293B",
      onSurface: "#F8FAFC",
      surfaceVariant: "#334155",
      onSurfaceVariant: "#F8FAFC",
      outline: "#64748B",
      outlineVariant: "#475569",
      scrim: "#000000",
      inverseSurface: "#F8FAFC",
      inverseOnSurface: "#0F172A",
      inversePrimary: "#10B981",
    },
  };

  const validJsonBlock = "```json\n" + JSON.stringify({ theme: validTheme }) + "\n```";

  const lowContrastTheme = {
    ...validTheme,
    colorScheme: {
      ...validTheme.colorScheme,
      primary: "#FFFFFF",
      onPrimary: "#EEEEEE", // 1.15:1 contrast - fails WCAG AA
    },
  };
  const lowContrastJsonBlock =
    "```json\n" + JSON.stringify({ theme: lowContrastTheme }) + "\n```";

  const missingMetadataTheme = {
    ...validTheme,
    metadata: {
      ...validTheme.metadata,
      id: "", // missing id
      author: "", // missing author
    },
  };
  const missingMetadataJsonBlock =
    "```json\n" + JSON.stringify({ theme: missingMetadataTheme }) + "\n```";

  beforeAll(async () => {
    // Dynamically import ESM server module using new Function so TS compiler does not convert it to require()
    const dynamicImport = new Function("specifier", "return import(specifier)");
    serverModule = await dynamicImport("./server.mjs");
    server = serverModule.createServerInstance();
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        const addr = server.address();
        if (typeof addr === "object" && addr) {
          port = addr.port;
          baseUrl = `http://127.0.0.1:${port}`;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  async function postJson(
    endpoint: string,
    body: Record<string, unknown>,
  ): Promise<{ status: number; data: PostJsonData }> {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify(body);
      const req = http.request(
        `${baseUrl}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload),
          },
        },
        (res) => {
          let rawData = "";
          res.on("data", (chunk) => {
            rawData += chunk;
          });
          res.on("end", () => {
            try {
              const data = rawData ? JSON.parse(rawData) : {};
              resolve({ status: res.statusCode || 500, data });
            } catch {
              resolve({ status: res.statusCode || 500, data: { raw: rawData } });
            }
          });
        },
      );
      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }

  async function createSession(provider: "claude" | "gemini" = "claude") {
    const res = await postJson("/api/ai/session", {
      provider,
      apiKey: "test-api-key-12345",
    });
    return (res.data as { sessionToken: string }).sessionToken;
  }

  it("passes validation on first attempt when theme is compliant", async () => {
    const sessionToken = await createSession("claude");
    const mockClaude = jest.fn().mockResolvedValue(validJsonBlock);
    serverModule.providers.claude = mockClaude;

    const res = await postJson("/api/ai/chat", {
      sessionToken,
      messages: [{ role: "user", content: "Create an accessible dark theme" }],
    });

    expect(res.status).toBe(200);
    expect(res.data.retries).toBe(0);
    expect(res.data.text).toBe(validJsonBlock);
    expect(mockClaude).toHaveBeenCalledTimes(1);
  });

  it("intercepts low-contrast AI output and executes automated re-prompt retry that succeeds", async () => {
    const sessionToken = await createSession("claude");
    // Attempt 0: low contrast, Attempt 1: corrected valid theme
    const mockClaude = jest
      .fn()
      .mockResolvedValueOnce(lowContrastJsonBlock)
      .mockResolvedValueOnce(validJsonBlock);
    serverModule.providers.claude = mockClaude;

    const res = await postJson("/api/ai/chat", {
      sessionToken,
      messages: [{ role: "user", content: "Make a theme" }],
    });

    expect(res.status).toBe(200);
    expect(res.data.retries).toBe(1);
    expect(res.data.text).toBe(validJsonBlock);
    expect(mockClaude).toHaveBeenCalledTimes(2);

    // Verify that the re-prompt message sent to Claude contains specific error feedback
    const secondCallArg = mockClaude.mock.calls[1][0];
    const messages = secondCallArg.messages;
    expect(messages.length).toBe(3); // user initial, assistant attempt 0, user correction prompt
    expect(messages[1].role).toBe("assistant");
    expect(messages[1].content).toBe(lowContrastJsonBlock);
    expect(messages[2].role).toBe("user");
    expect(messages[2].content).toContain("Low contrast for colorScheme.primary");
    expect(messages[2].content).toContain("WCAG AA requires >= 4.5:1");
  });

  it("intercepts schema errors (missing metadata) and recovers on second retry attempt", async () => {
    const sessionToken = await createSession("claude");
    // Attempt 0: missing metadata, Attempt 1: low contrast, Attempt 2: valid
    const mockClaude = jest
      .fn()
      .mockResolvedValueOnce(missingMetadataJsonBlock)
      .mockResolvedValueOnce(lowContrastJsonBlock)
      .mockResolvedValueOnce(validJsonBlock);
    serverModule.providers.claude = mockClaude;

    const res = await postJson("/api/ai/chat", {
      sessionToken,
      messages: [{ role: "user", content: "Design a futuristic theme" }],
    });

    expect(res.status).toBe(200);
    expect(res.data.retries).toBe(2);
    expect(mockClaude).toHaveBeenCalledTimes(3);

    // Call 1 correction message should mention metadata ID / author
    const retry1Messages = mockClaude.mock.calls[1][0].messages;
    expect(retry1Messages.at(-1).content).toContain("Theme ID is required");

    // Call 2 correction message should mention primary contrast
    const retry2Messages = mockClaude.mock.calls[2][0].messages;
    expect(retry2Messages.at(-1).content).toContain("Low contrast for colorScheme.primary");
  });

  it("strictly enforces maximum retry limit of 2 and returns HTTP 422 with diagnostic logs on persistent failure", async () => {
    const sessionToken = await createSession("claude");
    // Attempt 0: fails, Attempt 1 (retry 1): fails, Attempt 2 (retry 2): fails -> STOP!
    const mockClaude = jest.fn().mockResolvedValue(lowContrastJsonBlock);
    serverModule.providers.claude = mockClaude;

    const res = await postJson("/api/ai/chat", {
      sessionToken,
      messages: [{ role: "user", content: "Generate theme" }],
    });

    expect(res.status).toBe(422);
    expect(res.data.attempts).toBe(2);
    expect(res.data.error).toContain("Theme validation failed after 2 retry attempts");
    expect(Array.isArray(res.data.errors)).toBe(true);
    expect(res.data.errors!.some((e: string) => e.includes("Low contrast"))).toBe(true);

    // Verify structured diagnostic logs
    expect(Array.isArray(res.data.diagnosticLogs)).toBe(true);
    expect(res.data.diagnosticLogs!.length).toBe(3); // attempt 0, retry 1, retry 2
    expect(res.data.diagnosticLogs![0].attempt).toBe(0);
    expect(res.data.diagnosticLogs![1].attempt).toBe(1);
    expect(res.data.diagnosticLogs![2].attempt).toBe(2);

    // Strictly maximum 3 calls total: 1 initial + 2 retries
    expect(mockClaude).toHaveBeenCalledTimes(3);
  });

  it("supports Gemini multimodal provider with prompt re-prompting and retries", async () => {
    const sessionToken = await createSession("gemini");
    const mockGemini = jest
      .fn()
      .mockResolvedValueOnce("Not a JSON block at all")
      .mockResolvedValueOnce(validJsonBlock);
    serverModule.providers.gemini = mockGemini;

    const res = await postJson("/api/ai/chat", {
      sessionToken,
      prompt: "Generate a theme from this image",
      screenshots: [{ mimeType: "image/png", dataBase64: "AAAA" }],
    });

    expect(res.status).toBe(200);
    expect(res.data.retries).toBe(1);
    expect(mockGemini).toHaveBeenCalledTimes(2);

    // Verify retry prompt construction
    const secondCallArg = mockGemini.mock.calls[1][0];
    expect(secondCallArg.prompt).toContain("Not a JSON block at all");
    expect(secondCallArg.prompt).toContain("Response does not contain a JSON code block");
    expect(secondCallArg.screenshots).toHaveLength(1);
  });

  it("logs validation failure and retry events for auditing", async () => {
    const sessionToken = await createSession("claude");
    const mockClaude = jest
      .fn()
      .mockResolvedValueOnce(lowContrastJsonBlock)
      .mockResolvedValueOnce(validJsonBlock);
    serverModule.providers.claude = mockClaude;

    await postJson("/api/ai/chat", {
      sessionToken,
      messages: [{ role: "user", content: "Test logging" }],
    });

    const logs = serverModule.validationLogs;
    const retryAttemptLog = logs.find(
      (l: { type?: string }) => l.type === "retry_attempt",
    );
    const retrySuccessLog = logs.find(
      (l: { type?: string }) => l.type === "retry_success",
    );
    expect(retryAttemptLog).toBeDefined();
    expect(retrySuccessLog).toBeDefined();
  });
});
