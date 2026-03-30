import { createServer } from 'node:http';
import crypto from 'node:crypto';

const PORT = Number(process.env.AI_BACKEND_PORT || 8787);
const SESSION_TTL_MS = Number(process.env.AI_SESSION_TTL_MS || 15 * 60 * 1000);
const RATE_LIMIT_WINDOW_MS = Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60 * 1000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.AI_RATE_LIMIT_MAX_REQUESTS || 20);
const LOG_MODE = process.env.AI_LOG_MODE || 'metadata'; // none | metadata | full

const sessions = new Map();
const rateLimits = new Map();
const interactionLogs = [];

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
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 4_000_000) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function checkRateLimit(key) {
  const now = Date.now();
  const bucket = rateLimits.get(key) ?? { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  bucket.count += 1;
  rateLimits.set(key, bucket);
  return bucket.count <= RATE_LIMIT_MAX_REQUESTS;
}

function maybeLog(entry) {
  if (LOG_MODE === 'none') return;
  const log = {
    at: new Date().toISOString(),
    sessionId: entry.sessionId,
    provider: entry.provider,
    promptPreview: entry.promptPreview,
    outputPreview: entry.outputPreview,
    promptLength: entry.promptLength,
  };
  if (LOG_MODE === 'full') {
    log.prompt = entry.prompt;
    log.output = entry.output;
  }
  interactionLogs.push(log);
  if (interactionLogs.length > 500) interactionLogs.shift();
}

const providers = {
  async claude({ apiKey, messages }) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Claude API failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content?.[0];
    if (content?.type === 'text') return content.text;
    throw new Error('Unexpected Claude response format');
  },

  async gemini({ apiKey, prompt, screenshots }) {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { text: `${SYSTEM_PROMPT}\n\nUser request:\n${prompt}` },
            ...(screenshots || []).map((image) => ({
              inline_data: {
                mime_type: image.mimeType,
                data: image.dataBase64,
              },
            })),
          ],
        }],
      }),
    });

    if (!response.ok) throw new Error(`Gemini API failed: ${response.status}`);

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join('\n');

    if (!text) throw new Error('Unexpected Gemini response format');
    return text;
  },
};

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt <= now) sessions.delete(token);
  }
}

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });

  if (req.method === 'POST' && req.url === '/api/ai/session') {
    try {
      const body = await parseBody(req);
      const provider = body.provider;
      const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';
      if (!providers[provider]) return json(res, 400, { error: 'Unsupported provider' });
      if (!apiKey) return json(res, 400, { error: 'API key is required' });

      cleanupExpiredSessions();
      const token = crypto.randomBytes(24).toString('base64url');
      const expiresAt = Date.now() + SESSION_TTL_MS;
      sessions.set(token, { provider, apiKey, expiresAt });
      return json(res, 200, { sessionToken: token, expiresAt: new Date(expiresAt).toISOString() });
    } catch (error) {
      return json(res, 400, { error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  if (req.method === 'POST' && req.url === '/api/ai/chat') {
    try {
      cleanupExpiredSessions();
      const body = await parseBody(req);
      const sessionToken = body.sessionToken;
      const session = sessions.get(sessionToken);
      if (!session) return json(res, 401, { error: 'Session expired or invalid' });
      if (!checkRateLimit(sessionToken)) return json(res, 429, { error: 'Rate limit exceeded' });

      const provider = session.provider;
      const output = provider === 'claude'
        ? await providers.claude({ apiKey: session.apiKey, messages: Array.isArray(body.messages) ? body.messages : [] })
        : await providers.gemini({
          apiKey: session.apiKey,
          prompt: typeof body.prompt === 'string' ? body.prompt : '',
          screenshots: body.screenshots,
        });

      maybeLog({
        sessionId: sessionToken.slice(0, 8),
        provider,
        promptPreview: typeof body.prompt === 'string'
          ? body.prompt.slice(0, 120)
          : (body.messages?.at?.(-1)?.content || '').slice(0, 120),
        prompt: body.prompt || JSON.stringify(body.messages || []),
        promptLength: JSON.stringify(body.messages || body.prompt || '').length,
        outputPreview: String(output).slice(0, 120),
        output,
      });

      return json(res, 200, { text: output, provider });
    } catch (error) {
      return json(res, 500, { error: error instanceof Error ? error.message : 'Request failed' });
    }
  }

  if (req.method === 'POST' && req.url === '/api/ai/session/revoke') {
    try {
      const body = await parseBody(req);
      if (body.sessionToken) sessions.delete(body.sessionToken);
      return json(res, 200, { revoked: true });
    } catch {
      return json(res, 400, { error: 'Invalid request' });
    }
  }

  return json(res, 404, { error: 'Not found' });
}).listen(PORT, () => {
  console.log(`AI proxy listening on http://localhost:${PORT}`);
});
