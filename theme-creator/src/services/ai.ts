import type { KTheme } from '../types/theme.ts';

const API_KEY_STORAGE = 'ktheme-claude-api-key';

export function getStoredApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE);
}

export function setStoredApiKey(key: string) {
  localStorage.setItem(API_KEY_STORAGE, key);
}

export function clearStoredApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIRedesignPlan {
  layoutDensity: string;
  cornerStrategy: string;
  navModel: string;
  iconStyle: string;
  componentOverrides: string[];
}

export interface AIThemeResponse {
  theme: KTheme;
  redesignPlan?: AIRedesignPlan;
}

export interface AIScreenshotInput {
  mimeType: string;
  dataBase64: string;
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

Style recipes for app-wide redesign guidance:
- Windows Metro: prioritize flat tile hierarchy, sharp corners (0-2px), bold type scale, and strict accent color usage on interactive/high-priority elements only.
- LCARS: use rail-based geometry, segmented panels, asymmetrical-but-ordered information bands, and high-contrast labeled regions.
- Art Nouveau: use organic motifs, flowing separators/dividers, botanical curve language, and gentle decorative rhythm without harming readability.
- Art Deco: use symmetry, stepped/geometric ornament, framed sections, and premium contrast pairings (dark base + metallic/light highlights).

Guidelines:
- All colors must be valid 6-digit hex codes (e.g. #FF5733)
- Ensure sufficient contrast between foreground/background pairs (4.5:1 minimum for WCAG AA)
- "on" colors go on top of their base (e.g. onPrimary text on primary background)
- Container colors are lighter/darker variants of their base
- Consider the theme's mood, aesthetics, and accessibility
- Metallic variants: GOLD, SILVER, BRONZE, COPPER, PLATINUM, ROSE_GOLD, TITANIUM, CHROME, COBALT, GOLD_ROYAL_BLUE
- If a user describes an aesthetic, mood, or cultural reference, translate it into appropriate colors and effects

When explaining your design choices, be concise. Always include the full JSON response object so users can load the theme directly.`;

export async function sendAIMessage(
  messages: AIMessage[],
  apiKey: string
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as Record<string, Record<string, string>>)?.error?.message ||
        `API request failed: ${response.status}`
    );
  }

  const data = await response.json();
  const content = data.content?.[0];
  if (content?.type === 'text') {
    return content.text;
  }
  throw new Error('Unexpected API response format');
}

export async function sendGeminiMultimodalMessage(
  prompt: string,
  apiKey: string,
  screenshots: AIScreenshotInput[] = []
): Promise<string> {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nUse screenshots when provided to infer layout and generate precise redesignPlan decisions.\n\nUser request:\n${prompt}`,
              },
              ...screenshots.map((image) => ({
                inline_data: {
                  mime_type: image.mimeType,
                  data: image.dataBase64,
                },
              })),
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API request failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text)
    .filter(Boolean)
    .join('\n');

  if (!text) {
    throw new Error('Unexpected Gemini API response format');
  }

  return text;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function parseRedesignPlan(value: unknown): AIRedesignPlan | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.layoutDensity !== 'string' ||
    typeof candidate.cornerStrategy !== 'string' ||
    typeof candidate.navModel !== 'string' ||
    typeof candidate.iconStyle !== 'string' ||
    !isStringArray(candidate.componentOverrides)
  ) {
    return undefined;
  }

  return {
    layoutDensity: candidate.layoutDensity,
    cornerStrategy: candidate.cornerStrategy,
    navModel: candidate.navModel,
    iconStyle: candidate.iconStyle,
    componentOverrides: candidate.componentOverrides,
  };
}

export function extractThemeFromResponse(text: string): AIThemeResponse | null {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[1]);

    const themeCandidate = parsed?.theme ?? parsed;

    if (themeCandidate?.metadata?.id && themeCandidate?.colorScheme?.primary) {
      return {
        theme: themeCandidate as KTheme,
        redesignPlan: parseRedesignPlan(parsed?.redesignPlan),
      };
    }
  } catch {
    // Not valid JSON
  }
  return null;
}
