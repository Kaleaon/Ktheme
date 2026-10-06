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

export type ThemeExtractionStatus =
  | 'NO_JSON_BLOCK'
  | 'INVALID_JSON'
  | 'INVALID_SCHEMA'
  | 'SUCCESS';

export interface ThemeExtractionNoJsonResult {
  status: 'NO_JSON_BLOCK';
}

export interface ThemeExtractionInvalidJsonResult {
  status: 'INVALID_JSON';
  errorDetails: string;
}

export interface ThemeExtractionInvalidSchemaResult {
  status: 'INVALID_SCHEMA';
  errorDetails: string;
}

export interface ThemeExtractionSuccessResult {
  status: 'SUCCESS';
  response: AIThemeResponse;
}

export type ThemeExtractionResult =
  | ThemeExtractionNoJsonResult
  | ThemeExtractionInvalidJsonResult
  | ThemeExtractionInvalidSchemaResult
  | ThemeExtractionSuccessResult;

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

function validateThemeSchemaDetailed(theme: unknown): { valid: boolean; errorDetails?: string } {
  if (!isRecord(theme)) {
    return { valid: false, errorDetails: 'Theme payload must be a JSON object' };
  }

  const metadata = theme.metadata;
  if (!isRecord(metadata)) {
    return { valid: false, errorDetails: 'Missing "metadata" object in theme schema' };
  }

  const metadataFields = ['id', 'name', 'description', 'author', 'version', 'createdAt', 'updatedAt'];
  const missingMetadataField = metadataFields.find((field) => typeof metadata[field] !== 'string');
  if (missingMetadataField) {
    return { valid: false, errorDetails: `Missing or invalid string field "${missingMetadataField}" in metadata` };
  }

  if (!isStringArray(metadata.tags)) {
    return { valid: false, errorDetails: 'Metadata "tags" must be an array of strings' };
  }

  if (typeof theme.darkMode !== 'boolean') {
    return { valid: false, errorDetails: 'Field "darkMode" must be a boolean' };
  }

  const colorScheme = theme.colorScheme;
  if (!isRecord(colorScheme)) {
    return { valid: false, errorDetails: 'Missing "colorScheme" object in theme schema' };
  }

  const requiredColorKeys = [
    'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer', 'secondary', 'onSecondary',
    'secondaryContainer', 'onSecondaryContainer', 'tertiary', 'onTertiary', 'tertiaryContainer',
    'onTertiaryContainer', 'error', 'onError', 'errorContainer', 'onErrorContainer', 'background',
    'onBackground', 'surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant', 'outline',
    'outlineVariant', 'scrim', 'inverseSurface', 'inverseOnSurface', 'inversePrimary',
  ];

  const missingOrInvalidColor = requiredColorKeys.find((key) => !isHexColor(colorScheme[key]));
  if (missingOrInvalidColor) {
    return {
      valid: false,
      errorDetails: `Color "${missingOrInvalidColor}" in colorScheme is missing or not a valid hex color code (e.g. #FFFFFF)`,
    };
  }

  if (isRecord(theme.effects) && isRecord(theme.effects.metallic)) {
    const metallic = theme.effects.metallic;
    if (typeof metallic.enabled !== 'boolean') {
      return { valid: false, errorDetails: 'effects.metallic.enabled must be a boolean' };
    }
    if (typeof metallic.intensity !== 'number') {
      return { valid: false, errorDetails: 'effects.metallic.intensity must be a number' };
    }
    if (!METALLIC_VARIANTS.has(String(metallic.variant))) {
      return { valid: false, errorDetails: `Invalid metallic variant "${String(metallic.variant)}"` };
    }
    if (!isRecord(metallic.gradient)) {
      return { valid: false, errorDetails: 'effects.metallic.gradient must be an object' };
    }
    const gradientObj = metallic.gradient as Record<string, unknown>;
    const gradientKeys = ['base', 'highlight', 'shadow', 'shimmer'];
    const invalidGradKey = gradientKeys.find((k) => !isHexColor(gradientObj[k]));
    if (invalidGradKey) {
      return { valid: false, errorDetails: `effects.metallic.gradient.${invalidGradKey} is missing or invalid hex color` };
    }
  }

  return { valid: true };
}

export function validateThemeSchema(theme: unknown): theme is KTheme {
  return validateThemeSchemaDetailed(theme).valid;
}

export function extractThemeResult(text: string): ThemeExtractionResult {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (!jsonMatch) {
    return { status: 'NO_JSON_BLOCK' };
  }

  const codeBlockText = jsonMatch[1].trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(codeBlockText);
  } catch (err) {
    return {
      status: 'INVALID_JSON',
      errorDetails: err instanceof Error ? err.message : 'Failed to parse JSON code block',
    };
  }

  const themeCandidate = isRecord(parsed) && parsed.theme ? parsed.theme : parsed;
  const validation = validateThemeSchemaDetailed(themeCandidate);

  if (!validation.valid) {
    return {
      status: 'INVALID_SCHEMA',
      errorDetails: validation.errorDetails ?? 'Theme object failed schema validation',
    };
  }

  return {
    status: 'SUCCESS',
    response: {
      theme: themeCandidate as KTheme,
      redesignPlan: parseRedesignPlan(isRecord(parsed) ? parsed.redesignPlan : undefined),
    },
  };
}

export function extractThemeFromResponse(text: string): AIThemeResponse | null {
  const result = extractThemeResult(text);
  return result.status === 'SUCCESS' ? result.response : null;
}
