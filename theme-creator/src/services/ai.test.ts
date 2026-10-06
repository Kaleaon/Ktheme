import {
  extractThemeResult,
  extractThemeFromResponse,
} from './ai';

const sampleValidTheme = {
  metadata: {
    id: 'valid-test-theme',
    name: 'Valid Test Theme',
    description: 'A valid theme for testing',
    author: 'Test Author',
    version: '1.0.0',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    tags: ['test', 'dark'],
  },
  darkMode: true,
  colorScheme: {
    primary: '#10B981',
    onPrimary: '#FFFFFF',
    primaryContainer: '#064E3B',
    onPrimaryContainer: '#D1FAE5',
    secondary: '#3B82F6',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#1E3A8A',
    onSecondaryContainer: '#DBEAFE',
    tertiary: '#8B5CF6',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#4C1D95',
    onTertiaryContainer: '#EDE9FE',
    error: '#EF4444',
    onError: '#FFFFFF',
    errorContainer: '#7F1D1D',
    onErrorContainer: '#FEE2E2',
    background: '#0F172A',
    onBackground: '#F8FAFC',
    surface: '#1E293B',
    onSurface: '#F8FAFC',
    surfaceVariant: '#334155',
    onSurfaceVariant: '#CBD5E1',
    outline: '#64748B',
    outlineVariant: '#475569',
    scrim: '#000000',
    inverseSurface: '#F8FAFC',
    inverseOnSurface: '#0F172A',
    inversePrimary: '#10B981',
  },
};

describe('AI Theme Extraction Service', () => {
  describe('extractThemeResult', () => {
    it('returns SUCCESS for a valid theme response in a json block', () => {
      const response = `Here is your requested theme:

\`\`\`json
${JSON.stringify(sampleValidTheme, null, 2)}
\`\`\`

Enjoy your new theme!`;

      const result = extractThemeResult(response);
      expect(result.status).toBe('SUCCESS');
      if (result.status === 'SUCCESS') {
        expect(result.response.theme.metadata.id).toBe('valid-test-theme');
        expect(result.response.theme.colorScheme.primary).toBe('#10B981');
        expect(result.response.redesignPlan).toBeUndefined();
      }
    });

    it('returns SUCCESS and parses redesignPlan when wrapped in a container object', () => {
      const payload = {
        theme: sampleValidTheme,
        redesignPlan: {
          layoutDensity: 'compact',
          cornerStrategy: 'rounded',
          navModel: 'sidebar',
          iconStyle: 'line',
          componentOverrides: ['button-radius'],
        },
      };

      const response = `\`\`\`json
${JSON.stringify(payload)}
\`\`\``;

      const result = extractThemeResult(response);
      expect(result.status).toBe('SUCCESS');
      if (result.status === 'SUCCESS') {
        expect(result.response.theme.metadata.id).toBe('valid-test-theme');
        expect(result.response.redesignPlan).toBeDefined();
        expect(result.response.redesignPlan?.layoutDensity).toBe('compact');
        expect(result.response.redesignPlan?.componentOverrides).toEqual(['button-radius']);
      }
    });

    it('returns NO_JSON_BLOCK for plain conversational responses without json blocks', () => {
      const response = 'I can help you design a theme! What colors or aesthetic do you prefer?';
      const result = extractThemeResult(response);
      expect(result.status).toBe('NO_JSON_BLOCK');
    });

    it('returns INVALID_JSON with error details for truncated or malformed JSON blocks', () => {
      const response = `Here is the theme:

\`\`\`json
{
  "metadata": {
    "id": "broken",
    "name": "Broken Theme
\`\`\``;

      const result = extractThemeResult(response);
      expect(result.status).toBe('INVALID_JSON');
      if (result.status === 'INVALID_JSON') {
        expect(result.errorDetails).toBeDefined();
        expect(typeof result.errorDetails).toBe('string');
        expect(result.errorDetails.length).toBeGreaterThan(0);
      }
    });

    it('returns INVALID_SCHEMA when required colorScheme keys are missing', () => {
      const incompleteTheme = {
        ...sampleValidTheme,
        colorScheme: {
          primary: '#10B981',
          // Missing other required colors
        },
      };

      const response = `\`\`\`json
${JSON.stringify(incompleteTheme)}
\`\`\``;

      const result = extractThemeResult(response);
      expect(result.status).toBe('INVALID_SCHEMA');
      if (result.status === 'INVALID_SCHEMA') {
        expect(result.errorDetails).toContain('colorScheme');
      }
    });

    it('returns INVALID_SCHEMA when color hex format is invalid', () => {
      const invalidHexTheme = {
        ...sampleValidTheme,
        colorScheme: {
          ...sampleValidTheme.colorScheme,
          primary: 'rgb(0, 255, 0)', // Not hex format
        },
      };

      const response = `\`\`\`json
${JSON.stringify(invalidHexTheme)}
\`\`\``;

      const result = extractThemeResult(response);
      expect(result.status).toBe('INVALID_SCHEMA');
      if (result.status === 'INVALID_SCHEMA') {
        expect(result.errorDetails).toContain('primary');
      }
    });

    it('returns INVALID_SCHEMA when metadata string fields are missing', () => {
      const invalidMetadataTheme = {
        ...sampleValidTheme,
        metadata: {
          id: 'test',
          name: 'Test',
          // Missing author, version, etc.
        },
      };

      const response = `\`\`\`json
${JSON.stringify(invalidMetadataTheme)}
\`\`\``;

      const result = extractThemeResult(response);
      expect(result.status).toBe('INVALID_SCHEMA');
      if (result.status === 'INVALID_SCHEMA') {
        expect(result.errorDetails).toContain('metadata');
      }
    });
  });

  describe('extractThemeFromResponse (backward compatibility)', () => {
    it('returns AIThemeResponse object for valid theme response', () => {
      const response = `\`\`\`json
${JSON.stringify(sampleValidTheme)}
\`\`\``;

      const parsed = extractThemeFromResponse(response);
      expect(parsed).not.toBeNull();
      expect(parsed?.theme.metadata.id).toBe('valid-test-theme');
    });

    it('returns null for malformed JSON or conversational messages', () => {
      expect(extractThemeFromResponse('Hello world')).toBeNull();
      expect(extractThemeFromResponse('```json\n{ invalid json\n```')).toBeNull();
    });
  });
});
