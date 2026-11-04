import { createServer } from "node:http";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

function loadCoreModules() {
  const distDir = path.resolve(__dirname, "../../dist");
  const enginePath = path.join(distDir, "core/ThemeEngine.js");
  const colorsPath = path.join(distDir, "utils/colors.js");
  const exportPath = path.join(distDir, "exporters/exportEngine.js");

  if (
    !fs.existsSync(enginePath) ||
    !fs.existsSync(colorsPath) ||
    !fs.existsSync(exportPath)
  ) {
    try {
      execSync("npm run build", {
        cwd: path.resolve(__dirname, "../.."),
        stdio: "ignore",
      });
    } catch (e) {
      console.error("[server] Failed to build core modules:", e);
    }
  }

  const { ThemeEngine } = require(enginePath);
  const { contrastRatio } = require(colorsPath);
  const {
    validateThemePayload,
    createZipArchive,
    exportThemeForTarget,
    normalizeTarget,
  } = require(exportPath);

  return {
    ThemeEngine,
    contrastRatio,
    validateThemePayload,
    createZipArchive,
    exportThemeForTarget,
    normalizeTarget,
  };
}

const {
  ThemeEngine,
  contrastRatio,
  validateThemePayload,
  createZipArchive,
  exportThemeForTarget,
  normalizeTarget,
} = loadCoreModules();
const engine = new ThemeEngine();

const MAX_RETRIES = 2;
const MAX_TOTAL_TIMEOUT_MS = 5000;

const PORT = Number(process.env.AI_BACKEND_PORT || 8787);
const SESSION_TTL_MS = Number(process.env.AI_SESSION_TTL_MS || 15 * 60 * 1000);
const RATE_LIMIT_WINDOW_MS = Number(
  process.env.AI_RATE_LIMIT_WINDOW_MS || 60 * 1000,
);
const RATE_LIMIT_MAX_REQUESTS = Number(
  process.env.AI_RATE_LIMIT_MAX_REQUESTS || 20,
);
const LOG_MODE = process.env.AI_LOG_MODE || "metadata"; // none | metadata | full

const sessions = new Map();
const rateLimits = new Map();
const interactionLogs = [];
const validationLogs = [];
const upstreamComponents = [];

function logValidationEvent(type, details) {
  const entry = {
    at: new Date().toISOString(),
    type,
    ...details,
  };
  validationLogs.push(entry);
  if (validationLogs.length > 500) validationLogs.shift();
}

const SYSTEM_PROMPT = `You are Ktheme AI, an expert theme designer for the Ktheme theming engine. You help users create beautiful, accessible application themes.

When a user asks you to create or modify a theme, respond with a single JSON object inside a \`\`\`json code block.

Response contract:
- Top-level object MUST include:
  - "theme": a full Ktheme theme object (same structure as before)
  - "redesignPlan": an optional object with UX/system redesign decisions.
- If redesignPlan is included, it MUST contain:
  - "layoutDensity": string
  - "cornerStrategy": string
  - "navModel": string
  - "iconStyle": string
  - "componentOverrides": string[] (short concrete overrides)

The "theme" object MUST follow this exact structure:

{
  "schemaVersion": 2,
  "metadata": {
    "id": "unique-kebab-case-id",
    "name": "Theme Display Name",
    "description": "A brief description of the theme",
    "author": "AI-Generated",
    "version": "1.0.0",
    "tags": ["tag1", "tag2"],
    "createdAt": "<ISO date>",
    "updatedAt": "<ISO date>"
  },
  "darkMode": true,
  "colorScheme": {
    "primary": "#hex",
    "onPrimary": "#hex",
    "primaryContainer": "#hex",
    "onPrimaryContainer": "#hex",
    "secondary": "#hex",
    "onSecondary": "#hex",
    "secondaryContainer": "#hex",
    "onSecondaryContainer": "#hex",
    "tertiary": "#hex",
    "onTertiary": "#hex",
    "tertiaryContainer": "#hex",
    "onTertiaryContainer": "#hex",
    "error": "#hex",
    "onError": "#hex",
    "errorContainer": "#hex",
    "onErrorContainer": "#hex",
    "background": "#hex",
    "onBackground": "#hex",
    "surface": "#hex",
    "onSurface": "#hex",
    "surfaceVariant": "#hex",
    "onSurfaceVariant": "#hex",
    "outline": "#hex",
    "outlineVariant": "#hex",
    "scrim": "#000000",
    "inverseSurface": "#hex",
    "inverseOnSurface": "#hex",
    "inversePrimary": "#hex"
  },
  "effects": {
    "metallic": {
      "enabled": false,
      "variant": "GOLD",
      "gradient": { "base": "#hex", "highlight": "#hex", "shadow": "#hex", "shimmer": "#hex" },
      "intensity": 0.6
    },
    "shadows": {
      "enabled": true,
      "elevation": 4,
      "blur": 8,
      "color": "#00000040"
    },
    "shimmer": {
      "enabled": false,
      "speed": 3,
      "intensity": 0.5,
      "angle": 135
    }
  },
  "typography": {
    "fontFamily": "system-ui, -apple-system, sans-serif",
    "fontSize": { "small": 12, "medium": 16, "large": 20, "xlarge": 28 },
    "fontWeight": { "light": 300, "regular": 400, "medium": 500, "bold": 700 },
    "lineHeight": 1.5,
    "letterSpacing": 0
  }
}

Guidelines:
- All colors must be valid 6-digit hex codes (e.g. #FF5733)
- Ensure sufficient contrast between foreground/background pairs (4.5:1 minimum for WCAG AA)
- "on" colors go on top of their base (e.g. onPrimary text on primary background)
- Container colors are lighter/darker variants of their base
- Consider the theme's mood, aesthetics, and accessibility
- Metallic variants: GOLD, SILVER, BRONZE, COPPER, PLATINUM, ROSE_GOLD, TITANIUM, CHROME, COBALT, GOLD_ROYAL_BLUE`;

function json(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 4_000_000) reject(new Error("Payload too large"));
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function checkRateLimit(key) {
  const now = Date.now();
  const bucket = rateLimits.get(key) ?? {
    count: 0,
    resetAt: now + RATE_LIMIT_WINDOW_MS,
  };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  bucket.count += 1;
  rateLimits.set(key, bucket);
  return bucket.count <= RATE_LIMIT_MAX_REQUESTS;
}

function maybeLog(entry) {
  if (LOG_MODE === "none") return;
  const log = {
    at: new Date().toISOString(),
    sessionId: entry.sessionId,
    provider: entry.provider,
    promptPreview: entry.promptPreview,
    outputPreview: entry.outputPreview,
    promptLength: entry.promptLength,
  };
  if (LOG_MODE === "full") {
    log.prompt = entry.prompt;
    log.output = entry.output;
  }
  if (entry.retries !== undefined) log.retries = entry.retries;
  if (entry.validationValid !== undefined) log.validationValid = entry.validationValid;
  if (entry.diagnosticLogs) log.diagnosticLogs = entry.diagnosticLogs;
  interactionLogs.push(log);
  if (interactionLogs.length > 500) interactionLogs.shift();
}

const REQUIRED_COLOR_KEYS = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "background",
  "onBackground",
  "surface",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "outline",
  "outlineVariant",
  "scrim",
  "inverseSurface",
  "inverseOnSurface",
  "inversePrimary",
];

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

const CONTRAST_PAIRS = [
  ["primary", "onPrimary"],
  ["secondary", "onSecondary"],
  ["tertiary", "onTertiary"],
  ["background", "onBackground"],
  ["surface", "onSurface"],
  ["surfaceVariant", "onSurfaceVariant"],
  ["error", "onError"],
];

const SEMANTIC_CONTRAST_PAIRS = [
  ["success", "onSuccess"],
  ["warning", "onWarning"],
  ["info", "onInfo"],
  ["critical", "onCritical"],
];

function validateThemeOutput(rawText) {
  if (typeof rawText !== "string" || !rawText.trim()) {
    return {
      valid: false,
      errors: ["Response is empty or not a string."],
      issues: [
        {
          severity: "error",
          message: "Response is empty",
          code: "missing-schema",
        },
      ],
      theme: null,
    };
  }

  // 1. Extract JSON code block or raw JSON
  const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
  let codeBlockText = jsonMatch ? jsonMatch[1].trim() : "";
  if (!codeBlockText) {
    const trimmed = rawText.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      codeBlockText = trimmed;
    } else {
      return {
        valid: false,
        errors: [
          "Response does not contain a JSON code block enclosed in ```json ... ```.",
        ],
        issues: [
          {
            severity: "error",
            message: "Missing JSON code block in response",
            code: "missing-schema",
          },
        ],
        theme: null,
      };
    }
  }

  // 2. Parse JSON
  let parsed;
  try {
    parsed = JSON.parse(codeBlockText);
  } catch (err) {
    return {
      valid: false,
      errors: [`JSON syntax error: ${err.message}`],
      issues: [
        {
          severity: "error",
          message: `JSON parse error: ${err.message}`,
          code: "invalid-schema",
        },
      ],
      theme: null,
    };
  }

  // 3. Extract candidate theme object
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      valid: false,
      errors: ["Parsed JSON payload must be an object."],
      issues: [
        {
          severity: "error",
          message: "Parsed JSON payload must be an object",
          code: "invalid-schema",
        },
      ],
      theme: null,
    };
  }

  const candidateTheme =
    parsed.theme && typeof parsed.theme === "object" && !Array.isArray(parsed.theme)
      ? parsed.theme
      : parsed;

  const errors = [];
  const issues = [];

  // 4. Validate with ThemeEngine
  try {
    const valResult = engine.validateTheme(candidateTheme);
    if (!valResult.valid) {
      for (const err of valResult.errors) {
        errors.push(err);
      }
    }
    if (Array.isArray(valResult.issues)) {
      issues.push(...valResult.issues);
    }
  } catch (engineErr) {
    errors.push(`ThemeEngine validation exception: ${engineErr.message}`);
    issues.push({
      severity: "error",
      message: engineErr.message,
      code: "invalid-schema",
    });
  }

  // 5. Validate client schema expectations (all 28 required colorScheme keys as valid hex)
  if (!candidateTheme.colorScheme || typeof candidateTheme.colorScheme !== "object") {
    if (!errors.some((e) => e.includes("Color scheme is required"))) {
      errors.push("Color scheme is required");
      issues.push({
        severity: "error",
        message: "Color scheme is required",
        code: "missing-color",
        path: "colorScheme",
      });
    }
  } else {
    for (const key of REQUIRED_COLOR_KEYS) {
      const val = candidateTheme.colorScheme[key];
      if (!val || typeof val !== "string" || !HEX_COLOR_REGEX.test(val)) {
        const msg = `colorScheme.${key} is missing or not a valid 6-digit hex color (got: ${JSON.stringify(
          val,
        )})`;
        if (!errors.includes(msg)) {
          errors.push(msg);
          issues.push({
            severity: "error",
            message: msg,
            code: "invalid-token",
            path: `colorScheme.${key}`,
          });
        }
      }
    }
  }

  // 6. WCAG AA Contrast Validation (minimum 4.5:1 ratio)
  if (candidateTheme.colorScheme && typeof candidateTheme.colorScheme === "object") {
    for (const [base, on] of CONTRAST_PAIRS) {
      const colorBase = candidateTheme.colorScheme[base];
      const colorOn = candidateTheme.colorScheme[on];
      if (
        colorBase &&
        colorOn &&
        HEX_COLOR_REGEX.test(colorBase) &&
        HEX_COLOR_REGEX.test(colorOn)
      ) {
        try {
          const ratio = contrastRatio(colorBase, colorOn);
          if (ratio < 4.5) {
            const msg = `Low contrast for colorScheme.${base} (${colorBase}) and colorScheme.${on} (${colorOn}): ratio is ${ratio.toFixed(
              2,
            )}:1 (WCAG AA requires >= 4.5:1)`;
            errors.push(msg);
            issues.push({
              severity: "error",
              message: msg,
              code: "low-contrast",
              path: `colorScheme.${base}/${on}`,
            });
          }
        } catch (contrastErr) {
          errors.push(`Contrast check error for ${base}/${on}: ${contrastErr.message}`);
        }
      }
    }

    // Semantic roles contrast check
    if (
      candidateTheme.colorScheme.semanticRoles &&
      typeof candidateTheme.colorScheme.semanticRoles === "object"
    ) {
      for (const [base, on] of SEMANTIC_CONTRAST_PAIRS) {
        const colorBase = candidateTheme.colorScheme.semanticRoles[base];
        const colorOn = candidateTheme.colorScheme.semanticRoles[on];
        if (
          colorBase &&
          colorOn &&
          HEX_COLOR_REGEX.test(colorBase) &&
          HEX_COLOR_REGEX.test(colorOn)
        ) {
          try {
            const ratio = contrastRatio(colorBase, colorOn);
            if (ratio < 4.5) {
              const msg = `Low contrast for semantic role ${base} (${colorBase}) and ${on} (${colorOn}): ratio is ${ratio.toFixed(
                2,
              )}:1 (WCAG AA requires >= 4.5:1)`;
              errors.push(msg);
              issues.push({
                severity: "error",
                message: msg,
                code: "low-contrast",
                path: `colorScheme.semanticRoles.${base}/${on}`,
              });
            }
          } catch {}
        }
      }
    }
  }

  const uniqueErrors = [...new Set(errors)];

  return {
    valid: uniqueErrors.length === 0,
    errors: uniqueErrors,
    issues,
    theme: candidateTheme,
  };
}

function formatCorrectionPrompt(errors, issues = []) {
  const bulletErrors = errors.map((err, idx) => `${idx + 1}. ${err}`).join("\n");
  return `The theme candidate you generated failed strict backend validation against the Ktheme specification and WCAG AA contrast rules:\n\n${bulletErrors}\n\nPlease regenerate the theme and correct all the errors listed above. Return the entire corrected response containing a single valid JSON object enclosed in a \`\`\`json code block.
Ensure that:
1. schemaVersion is 2.
2. All metadata fields (id, name, description, author, version, tags, createdAt, updatedAt) are present and valid.
3. darkMode is a boolean.
4. All 28 colorScheme colors are valid 6-digit hex codes (#RRGGBB).
5. All foreground/background color pairs strictly meet WCAG AA contrast ratio of at least 4.5:1 (e.g. primary/onPrimary, secondary/onSecondary, tertiary/onTertiary, background/onBackground, surface/onSurface, surfaceVariant/onSurfaceVariant, error/onError).
6. Do not include any text outside the \`\`\`json code block.`;
}

const providers = {
  async claude({ apiKey, messages }) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        err?.error?.message || `Claude API failed: ${response.status}`,
      );
    }

    const data = await response.json();
    const content = data.content?.[0];
    if (content?.type === "text") return content.text;
    throw new Error("Unexpected Claude response format");
  },

  async gemini({ apiKey, prompt, screenshots }) {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${SYSTEM_PROMPT}\n\nUser request:\n${prompt}` },
                ...(screenshots || []).map((image) => ({
                  inline_data: {
                    mime_type: image.mimeType,
                    data: image.dataBase64,
                  },
                })),
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) throw new Error(`Gemini API failed: ${response.status}`);

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n");

    if (!text) throw new Error("Unexpected Gemini response format");
    return text;
  },
};

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt <= now) sessions.delete(token);
  }
}

async function requestHandler(req, res) {
  if (req.method === "OPTIONS") return json(res, 200, { ok: true });

  if (req.method === "POST" && req.url.startsWith("/api/export/")) {
    const clientKey =
      req.headers["x-client-ip"] || req.socket.remoteAddress || "global";
    if (!checkRateLimit(`export:${clientKey}`)) {
      return json(res, 429, {
        error:
          "Rate limit exceeded. Please wait before issuing additional export requests.",
      });
    }

    try {
      const urlObj = new URL(
        req.url,
        `http://${req.headers.host || "localhost"}`,
      );
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      const rawTarget = pathParts[2] || "";

      const body = await parseBody(req);

      const validation = validateThemePayload(body);
      if (!validation.valid) {
        return json(res, 400, {
          error: "Invalid theme payload schema",
          details: validation.errors,
        });
      }

      const normTarget = normalizeTarget(rawTarget);
      if (!normTarget) {
        return json(res, 400, {
          error: `Unsupported target '${rawTarget}'. Supported targets: android, swiftui, css, tailwind, flutter, json, blender`,
        });
      }

      const isZipRequested =
        urlObj.searchParams.get("archive") === "true" ||
        urlObj.searchParams.get("zip") === "true" ||
        urlObj.searchParams.get("format") === "zip" ||
        body.archive === true ||
        body.format === "zip" ||
        (req.headers.accept && req.headers.accept.includes("application/zip"));

      const exportResult = await exportThemeForTarget(
        validation.theme,
        normTarget,
      );

      if (isZipRequested) {
        const zipBuffer = createZipArchive(exportResult.files);
        const themeId = validation.theme.metadata?.id || "ktheme";
        res.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${themeId}-${normTarget}.zip"`,
          "Content-Length": zipBuffer.length,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
        });
        return res.end(zipBuffer);
      } else {
        return json(res, 200, {
          ok: true,
          target: normTarget,
          filename: exportResult.defaultFilename,
          contentType: exportResult.contentType,
          code: exportResult.singleCode,
          files: exportResult.files,
        });
      }
    } catch (err) {
      if (err.message === "Payload too large") {
        return json(res, 413, {
          error: "Payload size exceeds maximum allowed limit of 4MB.",
        });
      }
      if (err.message === "Invalid JSON") {
        return json(res, 400, {
          error: "Invalid JSON body payload.",
        });
      }
      return json(res, 500, {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (req.method === "POST" && req.url === "/api/ai/session") {
    try {
      const body = await parseBody(req);
      const provider = body.provider;
      const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
      if (!providers[provider])
        return json(res, 400, { error: "Unsupported provider" });
      if (!apiKey) return json(res, 400, { error: "API key is required" });

      cleanupExpiredSessions();
      const token = crypto.randomBytes(24).toString("base64url");
      const expiresAt = Date.now() + SESSION_TTL_MS;
      sessions.set(token, { provider, apiKey, expiresAt });
      return json(res, 200, {
        sessionToken: token,
        expiresAt: new Date(expiresAt).toISOString(),
      });
    } catch (error) {
      return json(res, 400, {
        error: error instanceof Error ? error.message : "Invalid request",
      });
    }
  }

  if (req.method === "POST" && req.url === "/api/ai/chat") {
    try {
      cleanupExpiredSessions();
      const body = await parseBody(req);
      const sessionToken = body.sessionToken;
      const session = sessions.get(sessionToken);
      if (!session)
        return json(res, 401, { error: "Session expired or invalid" });
      if (!checkRateLimit(sessionToken))
        return json(res, 429, { error: "Rate limit exceeded" });

      const provider = session.provider;
      const startTime = Date.now();
      const diagnosticLogs = [];

      let currentMessages = Array.isArray(body.messages) ? [...body.messages] : [];
      let currentPrompt = typeof body.prompt === "string" ? body.prompt : "";

      async function invokeProvider(messagesParam, promptParam) {
        if (provider === "claude") {
          return await providers.claude({
            apiKey: session.apiKey,
            messages: messagesParam,
          });
        } else {
          return await providers.gemini({
            apiKey: session.apiKey,
            prompt: promptParam,
            screenshots: body.screenshots,
          });
        }
      }

      // Initial invocation (Attempt 0)
      let currentOutput = await invokeProvider(currentMessages, currentPrompt);
      let validation = validateThemeOutput(currentOutput);

      if (validation.valid) {
        logValidationEvent("validation_success", {
          sessionId: sessionToken.slice(0, 8),
          provider,
          attempt: 0,
        });

        maybeLog({
          sessionId: sessionToken.slice(0, 8),
          provider,
          promptPreview:
            typeof body.prompt === "string"
              ? body.prompt.slice(0, 120)
              : (body.messages?.at?.(-1)?.content || "").slice(0, 120),
          prompt: body.prompt || JSON.stringify(body.messages || []),
          promptLength: JSON.stringify(body.messages || body.prompt || "").length,
          outputPreview: String(currentOutput).slice(0, 120),
          output: currentOutput,
          retries: 0,
          validationValid: true,
        });

        return json(res, 200, { text: currentOutput, provider, retries: 0 });
      }

      // Initial attempt failed validation
      diagnosticLogs.push({
        attempt: 0,
        errors: validation.errors,
        issues: validation.issues,
        timestamp: new Date().toISOString(),
      });

      logValidationEvent("validation_failure", {
        sessionId: sessionToken.slice(0, 8),
        provider,
        attempt: 0,
        errors: validation.errors,
      });

      console.warn(
        `[AI Validation Gate] Session ${sessionToken.slice(0, 8)} attempt 0 failed validation:`,
        validation.errors,
      );

      // Automated Re-prompt Retry Loop (up to MAX_RETRIES)
      let retryAttempt = 0;
      while (retryAttempt < MAX_RETRIES) {
        const elapsed = Date.now() - startTime;
        if (elapsed >= MAX_TOTAL_TIMEOUT_MS) {
          console.warn(
            `[AI Validation Gate] Exceeded total retry timeout (${elapsed}ms >= ${MAX_TOTAL_TIMEOUT_MS}ms). Aborting retries.`,
          );
          logValidationEvent("timeout_abort", {
            sessionId: sessionToken.slice(0, 8),
            provider,
            elapsed,
            retryAttempt,
          });
          break;
        }

        retryAttempt++;
        const correctionMsg = formatCorrectionPrompt(
          validation.errors,
          validation.issues,
        );

        if (provider === "claude") {
          currentMessages = [
            ...currentMessages,
            { role: "assistant", content: currentOutput },
            { role: "user", content: correctionMsg },
          ];
        } else {
          currentPrompt = `${currentPrompt}\n\n[Previous Candidate Theme Output]:\n${currentOutput}\n\n[Validation Correction Request]:\n${correctionMsg}`;
        }

        logValidationEvent("retry_attempt", {
          sessionId: sessionToken.slice(0, 8),
          provider,
          retryAttempt,
          errorsToCorrect: validation.errors,
        });

        console.log(
          `[AI Validation Gate] Executing retry attempt ${retryAttempt}/${MAX_RETRIES} for session ${sessionToken.slice(
            0,
            8,
          )} via ${provider}...`,
        );

        currentOutput = await invokeProvider(currentMessages, currentPrompt);
        validation = validateThemeOutput(currentOutput);

        if (validation.valid) {
          console.log(
            `[AI Validation Gate] Theme successfully corrected on retry attempt ${retryAttempt}!`,
          );
          logValidationEvent("retry_success", {
            sessionId: sessionToken.slice(0, 8),
            provider,
            retryAttempt,
          });

          maybeLog({
            sessionId: sessionToken.slice(0, 8),
            provider,
            promptPreview:
              typeof body.prompt === "string"
                ? body.prompt.slice(0, 120)
                : (body.messages?.at?.(-1)?.content || "").slice(0, 120),
            prompt: body.prompt || JSON.stringify(body.messages || []),
            promptLength: JSON.stringify(body.messages || body.prompt || "").length,
            outputPreview: String(currentOutput).slice(0, 120),
            output: currentOutput,
            retries: retryAttempt,
            validationValid: true,
            diagnosticLogs,
          });

          return json(res, 200, {
            text: currentOutput,
            provider,
            retries: retryAttempt,
          });
        }

        // Retry failed validation
        diagnosticLogs.push({
          attempt: retryAttempt,
          errors: validation.errors,
          issues: validation.issues,
          timestamp: new Date().toISOString(),
        });

        logValidationEvent("retry_failure", {
          sessionId: sessionToken.slice(0, 8),
          provider,
          retryAttempt,
          errors: validation.errors,
        });

        console.warn(
          `[AI Validation Gate] Retry attempt ${retryAttempt} failed validation:`,
          validation.errors,
        );
      }

      // If we reach here, all retries failed (or timed out)
      console.error(
        `[AI Validation Gate] All retry attempts failed (${retryAttempt} retries). Emitting HTTP 422.`,
      );

      logValidationEvent("validation_exhausted", {
        sessionId: sessionToken.slice(0, 8),
        provider,
        attempts: retryAttempt,
        finalErrors: validation.errors,
      });

      maybeLog({
        sessionId: sessionToken.slice(0, 8),
        provider,
        promptPreview:
          typeof body.prompt === "string"
            ? body.prompt.slice(0, 120)
            : (body.messages?.at?.(-1)?.content || "").slice(0, 120),
        prompt: body.prompt || JSON.stringify(body.messages || []),
        promptLength: JSON.stringify(body.messages || body.prompt || "").length,
        outputPreview: String(currentOutput).slice(0, 120),
        output: currentOutput,
        retries: retryAttempt,
        validationValid: false,
        diagnosticLogs,
      });

      return json(res, 422, {
        error: `Theme validation failed after ${retryAttempt} retry attempt${
          retryAttempt === 1 ? "" : "s"
        }: ${validation.errors.join("; ")}`,
        errors: validation.errors,
        issues: validation.issues,
        diagnosticLogs,
        attempts: retryAttempt,
      });
    } catch (error) {
      return json(res, 500, {
        error: error instanceof Error ? error.message : "Request failed",
      });
    }
  }

  if (
    req.method === "POST" &&
    req.url.startsWith("/api/sync/component-upstream")
  ) {
    try {
      const body = await parseBody(req);
      const newItems = Array.isArray(body.components)
        ? body.components
        : body.id
          ? [body]
          : [];

      for (const item of newItems) {
        if (item && item.id && item.name) {
          item.receivedAt = new Date().toISOString();
          const existingIdx = upstreamComponents.findIndex(
            (c) => c.id === item.id,
          );
          if (existingIdx !== -1) {
            upstreamComponents[existingIdx] = item;
          } else {
            upstreamComponents.push(item);
          }
        }
      }

      return json(res, 200, {
        ok: true,
        count: newItems.length,
        total: upstreamComponents.length,
        message: `Successfully received ${newItems.length} upstream components`,
      });
    } catch (err) {
      return json(res, 400, { error: err.message });
    }
  }

  if (
    req.method === "GET" &&
    req.url.startsWith("/api/sync/component-upstream")
  ) {
    return json(res, 200, {
      ok: true,
      count: upstreamComponents.length,
      components: upstreamComponents,
    });
  }

  if (req.url.startsWith("/api/sync/token-downstream")) {
    const urlObj = new URL(
      req.url,
      `http://${req.headers.host || "localhost"}`,
    );
    const themeId = urlObj.searchParams.get("themeId") || "navy-gold";

    const tokens = {
      light: {
        primary: "0xFF1E3A8A",
        onPrimary: "0xFFFFFFFF",
        primaryContainer: "0xFFDBEAFE",
        onPrimaryContainer: "0xFF1E40AF",
        secondary: "0xFFD97706",
        onSecondary: "0xFFFFFFFF",
        background: "0xFFF8FAFC",
        onBackground: "0xFF0F172A",
        surface: "0xFFFFFFFF",
        onSurface: "0xFF0F172A",
      },
      dark: {
        primary: "0xFF60A5FA",
        onPrimary: "0xFF1E3A8A",
        primaryContainer: "0xFF1E40AF",
        onPrimaryContainer: "0xFFDBEAFE",
        secondary: "0xFFFBBF24",
        onSecondary: "0xFF78350F",
        background: "0xFF0F172A",
        onBackground: "0xFFF8FAFC",
        surface: "0xFF1E293B",
        onSurface: "0xFFF8FAFC",
      },
    };

    return json(res, 200, {
      ok: true,
      themeId,
      tokens,
    });
  }

  if (req.method === "POST" && req.url === "/api/ai/session/revoke") {
    try {
      const body = await parseBody(req);
      if (body.sessionToken) sessions.delete(body.sessionToken);
      return json(res, 200, { revoked: true });
    } catch {
      return json(res, 400, { error: "Invalid request" });
    }
  }

  return json(res, 404, { error: "Not found" });
}

function createServerInstance() {
  return createServer(requestHandler);
}

const server = createServerInstance();

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  server.listen(PORT, () => {
    console.log(`AI proxy listening on http://localhost:${PORT}`);
  });
}

export {
  providers,
  sessions,
  rateLimits,
  interactionLogs,
  validationLogs,
  validateThemeOutput,
  formatCorrectionPrompt,
  requestHandler,
  createServerInstance,
  SYSTEM_PROMPT,
  MAX_RETRIES,
  MAX_TOTAL_TIMEOUT_MS,
};
