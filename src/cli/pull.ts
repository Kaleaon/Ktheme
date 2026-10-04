import fs from 'node:fs';
import path from 'node:path';
import { httpFetch } from './http';

export interface PullOptions {
  endpoint?: string;
  themeId?: string;
  outKotlin?: string;
  outCss?: string;
}

export interface TokenSyncResult {
  success: boolean;
  usedFallback: boolean;
  message: string;
}

export const DEFAULT_TOKENS = {
  light: {
    primary: '0xFF1E3A8A',
    onPrimary: '0xFFFFFFFF',
    primaryContainer: '0xFFDBEAFE',
    onPrimaryContainer: '0xFF1E40AF',
    secondary: '0xFFD97706',
    onSecondary: '0xFFFFFFFF',
    background: '0xFFF8FAFC',
    onBackground: '0xFF0F172A',
    surface: '0xFFFFFFFF',
    onSurface: '0xFF0F172A',
  },
  dark: {
    primary: '0xFF60A5FA',
    onPrimary: '0xFF1E3A8A',
    primaryContainer: '0xFF1E40AF',
    onPrimaryContainer: '0xFFDBEAFE',
    secondary: '0xFFFBBF24',
    onSecondary: '0xFF78350F',
    background: '0xFF0F172A',
    onBackground: '0xFFF8FAFC',
    surface: '0xFF1E293B',
    onSurface: '0xFFF8FAFC',
  },
};

export async function pullTokens(options: PullOptions): Promise<TokenSyncResult> {
  const endpoint = options.endpoint || 'http://localhost:8787/api/sync/token-downstream';
  const themeId = options.themeId || 'navy-gold';

  let tokens = DEFAULT_TOKENS;
  let usedFallback = false;

  try {
    const url = `${endpoint}?themeId=${encodeURIComponent(themeId)}`;
    const response = await httpFetch(url, { timeoutMs: 3000 });

    if (response.ok) {
      const data = await response.json<{ tokens?: typeof DEFAULT_TOKENS }>();
      if (data && data.tokens) {
        tokens = data.tokens;
      }
    } else {
      usedFallback = true;
      console.warn(`[Ktheme] Downstream sync returned status ${response.status}. Using default fallback tokens.`);
    }
  } catch (err) {
    usedFallback = true;
    console.warn(`[Ktheme] Downstream token sync endpoint unreachable (${err instanceof Error ? err.message : String(err)}). Using fallback tokens.`);
  }

  // Update Kotlin Theme file if path specified
  if (options.outKotlin) {
    const kotlinPath = path.resolve(options.outKotlin);
    const kotlinDir = path.dirname(kotlinPath);
    if (!fs.existsSync(kotlinDir)) {
      fs.mkdirSync(kotlinDir, { recursive: true });
    }

    const kotlinContent = `package com.charmorph.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color
import androidx.compose.runtime.Composable

// Ktheme Dynamic Sync Tokens (${usedFallback ? 'Fallback' : 'Synced from Ktheme'})
private val LightColors = lightColorScheme(
    primary = Color(${tokens.light.primary}),
    onPrimary = Color(${tokens.light.onPrimary}),
    primaryContainer = Color(${tokens.light.primaryContainer}),
    onPrimaryContainer = Color(${tokens.light.onPrimaryContainer}),
    secondary = Color(${tokens.light.secondary}),
    onSecondary = Color(${tokens.light.onSecondary}),
    background = Color(${tokens.light.background}),
    onBackground = Color(${tokens.light.onBackground}),
    surface = Color(${tokens.light.surface}),
    onSurface = Color(${tokens.light.onSurface})
)

private val DarkColors = darkColorScheme(
    primary = Color(${tokens.dark.primary}),
    onPrimary = Color(${tokens.dark.onPrimary}),
    primaryContainer = Color(${tokens.dark.primaryContainer}),
    onPrimaryContainer = Color(${tokens.dark.onPrimaryContainer}),
    secondary = Color(${tokens.dark.secondary}),
    onSecondary = Color(${tokens.dark.onSecondary}),
    background = Color(${tokens.dark.background}),
    onBackground = Color(${tokens.dark.onBackground}),
    surface = Color(${tokens.dark.surface}),
    onSurface = Color(${tokens.dark.onSurface})
)

@Composable
fun CharMorphTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) DarkColors else LightColors
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content,
    )
}
`;
    fs.writeFileSync(kotlinPath, kotlinContent, 'utf-8');
  }

  return {
    success: true,
    usedFallback,
    message: usedFallback
      ? `Token sync completed using fallback definitions.`
      : `Token sync completed successfully from ${endpoint}.`,
  };
}
