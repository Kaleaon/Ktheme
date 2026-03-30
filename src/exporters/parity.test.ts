import { Theme } from '../core/types';
import { toAndroidCompose } from './toAndroidCompose';
import { toCssVars } from './toCssVars';
import { toDesignTokensJson } from './toDesignTokensJson';
import { toFlutterTheme } from './toFlutterTheme';
import { toSwiftUI } from './toSwiftUI';
import { toTailwindConfig } from './toTailwindConfig';

const fixtureTheme: Theme = {
  metadata: {
    id: 'export-fixture',
    name: 'Exporter Fixture',
    description: 'Fixture used for exporter parity tests',
    author: 'tests',
    version: '1.0.0',
    tags: ['test'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  darkMode: true,
  colorScheme: {
    primary: '#111111',
    onPrimary: '#FFFFFF',
    primaryContainer: '#333333',
    onPrimaryContainer: '#FFFFFF',
    secondary: '#222222',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#444444',
    onSecondaryContainer: '#FFFFFF',
    tertiary: '#555555',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#666666',
    onTertiaryContainer: '#FFFFFF',
    error: '#D32F2F',
    onError: '#FFFFFF',
    errorContainer: '#FFCDD2',
    onErrorContainer: '#000000',
    background: '#121212',
    onBackground: '#F5F5F5',
    surface: '#1E1E1E',
    onSurface: '#FAFAFA',
    surfaceVariant: '#2A2A2A',
    onSurfaceVariant: '#EEEEEE',
    outline: '#777777',
    outlineVariant: '#888888',
    scrim: '#000000',
    inverseSurface: '#F5F5F5',
    inverseOnSurface: '#111111',
    inversePrimary: '#999999',
    semanticRoles: {
      success: '#00C853',
      onSuccess: '#FFFFFF',
      warning: '#FFAB00',
      onWarning: '#000000',
      info: '#2196F3',
      onInfo: '#FFFFFF',
      critical: '#B00020',
      onCritical: '#FFFFFF'
    }
  }
};

describe('exporter parity', () => {
  it('maps semantic role colors consistently across all export adapters', () => {
    const cssVars = toCssVars(fixtureTheme);
    const tailwind = toTailwindConfig(fixtureTheme);
    const compose = toAndroidCompose(fixtureTheme);
    const swift = toSwiftUI(fixtureTheme);
    const flutter = toFlutterTheme(fixtureTheme);
    const designTokens = toDesignTokensJson(fixtureTheme);

    expect(cssVars.vars['--ktheme-semantic-success']).toBe('#00C853');
    expect(cssVars.vars['--ktheme-semantic-warning']).toBe('#FFAB00');
    expect(cssVars.vars['--ktheme-semantic-info']).toBe('#2196F3');
    expect(cssVars.vars['--ktheme-semantic-critical']).toBe('#B00020');

    expect(tailwind.theme.extend.colors.success).toBe('#00C853');
    expect(compose.colorScheme.success).toBe('#00C853');
    expect(swift.colors.success).toBe('#00C853');
    expect(flutter.colorScheme.success).toBe('#00C853');
    expect(designTokens.theme.color.semantic.success.$value).toBe('#00C853');

    expect(tailwind.theme.extend.colors.warning).toBe('#FFAB00');
    expect(compose.colorScheme.warning).toBe('#FFAB00');
    expect(swift.colors.warning).toBe('#FFAB00');
    expect(flutter.colorScheme.warning).toBe('#FFAB00');
    expect(designTokens.theme.color.semantic.warning.$value).toBe('#FFAB00');

    expect(tailwind.theme.extend.colors.info).toBe('#2196F3');
    expect(compose.colorScheme.info).toBe('#2196F3');
    expect(swift.colors.info).toBe('#2196F3');
    expect(flutter.colorScheme.info).toBe('#2196F3');
    expect(designTokens.theme.color.semantic.info.$value).toBe('#2196F3');

    expect(tailwind.theme.extend.colors.critical).toBe('#B00020');
    expect(compose.colorScheme.critical).toBe('#B00020');
    expect(swift.colors.critical).toBe('#B00020');
    expect(flutter.colorScheme.critical).toBe('#B00020');
    expect(designTokens.theme.color.semantic.critical.$value).toBe('#B00020');
  });
});
