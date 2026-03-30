import type { KTheme } from '../types/theme.ts';

const AI_API_BASE = '/api/ai';
const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;
const METALLIC_VARIANTS = new Set([
  'SILVER',
  'GOLD',
  'GOLD_ROYAL_BLUE',
  'BRONZE',
  'COPPER',
  'PLATINUM',
  'ROSE_GOLD',
  'TITANIUM',
  'CHROME',
  'COBALT',
]);

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

export interface AISession {
  sessionToken: string;
  expiresAt: string;
  provider: AIProvider;
}

export type AIProvider = 'claude' | 'gemini';

async function postJson<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${AI_API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string })?.error ?? `AI request failed: ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}

export async function createAISession(
  provider: AIProvider,
  apiKey: string
): Promise<AISession> {
  const data = await postJson<{ sessionToken: string; expiresAt: string }>('/session', {
    provider,
    apiKey,
  });
  return { ...data, provider };
}

export async function revokeAISession(sessionToken: string): Promise<void> {
  await postJson('/session/revoke', { sessionToken });
}

export async function sendAIMessage(
  messages: AIMessage[],
  sessionToken: string
): Promise<string> {
  const data = await postJson<{ text: string }>('/chat', { sessionToken, messages });
  return data.text;
}

export async function sendGeminiMultimodalMessage(
  prompt: string,
  sessionToken: string,
  screenshots: AIScreenshotInput[] = []
): Promise<string> {
  const data = await postJson<{ text: string }>('/chat', {
    sessionToken,
    prompt,
    screenshots,
  });
  return data.text;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_REGEX.test(value);
}

function parseRedesignPlan(value: unknown): AIRedesignPlan | undefined {
  if (!isRecord(value)) return undefined;

  if (
    typeof value.layoutDensity !== 'string' ||
    typeof value.cornerStrategy !== 'string' ||
    typeof value.navModel !== 'string' ||
    typeof value.iconStyle !== 'string' ||
    !isStringArray(value.componentOverrides)
  ) {
    return undefined;
  }

  return {
    layoutDensity: value.layoutDensity,
    cornerStrategy: value.cornerStrategy,
    navModel: value.navModel,
    iconStyle: value.iconStyle,
    componentOverrides: value.componentOverrides,
  };
}

function validateThemeSchema(theme: unknown): theme is KTheme {
  if (!isRecord(theme)) return false;
  const metadata = theme.metadata;
  const colorScheme = theme.colorScheme;
  if (!isRecord(metadata) || !isRecord(colorScheme)) return false;

  const metadataFields = ['id', 'name', 'description', 'author', 'version', 'createdAt', 'updatedAt'];
  const validMetadata = metadataFields.every((field) => typeof metadata[field] === 'string');
  if (!validMetadata || !isStringArray(metadata.tags)) return false;

  if (typeof theme.darkMode !== 'boolean') return false;

  const requiredColorKeys = [
    'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer', 'secondary', 'onSecondary',
    'secondaryContainer', 'onSecondaryContainer', 'tertiary', 'onTertiary', 'tertiaryContainer',
    'onTertiaryContainer', 'error', 'onError', 'errorContainer', 'onErrorContainer', 'background',
    'onBackground', 'surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant', 'outline',
    'outlineVariant', 'scrim', 'inverseSurface', 'inverseOnSurface', 'inversePrimary',
  ];

  if (!requiredColorKeys.every((key) => isHexColor(colorScheme[key]))) return false;

  if (!isRecord(theme.effects) || !isRecord(theme.typography)) return true;

  if (isRecord(theme.effects.metallic)) {
    const metallic = theme.effects.metallic;
    if (
      typeof metallic.enabled !== 'boolean' ||
      typeof metallic.intensity !== 'number' ||
      !METALLIC_VARIANTS.has(String(metallic.variant)) ||
      !isRecord(metallic.gradient) ||
      !isHexColor(metallic.gradient.base) ||
      !isHexColor(metallic.gradient.highlight) ||
      !isHexColor(metallic.gradient.shadow) ||
      !isHexColor(metallic.gradient.shimmer)
    ) return false;
  }

  return true;
}

export function extractThemeFromResponse(text: string): AIThemeResponse | null {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[1]);
    const themeCandidate = parsed?.theme ?? parsed;

    if (!validateThemeSchema(themeCandidate)) {
      return null;
    }

    return {
      theme: themeCandidate as KTheme,
      redesignPlan: parseRedesignPlan(parsed?.redesignPlan),
    };
  } catch {
    return null;
  }
}
