import { Theme } from '../../core/types';
import { TypographyVarsExport, WebExporterOptions } from './types';

export function exportTypographyVars(
  theme: Theme,
  options?: WebExporterOptions
): TypographyVarsExport {
  if (options?.includeTypography === false) {
    return { vars: {}, tailwind: {} };
  }

  const vars: Record<string, string> = {};

  const fontFamily = theme.typography?.fontFamily ?? 'system-ui, -apple-system, sans-serif';
  const smallSize = theme.typography?.fontSize?.small ?? 12;
  const mediumSize = theme.typography?.fontSize?.medium ?? 14;
  const largeSize = theme.typography?.fontSize?.large ?? 18;
  const xlargeSize = theme.typography?.fontSize?.xlarge ?? 24;

  const lightWeight = theme.typography?.fontWeight?.light ?? 300;
  const regularWeight = theme.typography?.fontWeight?.regular ?? 400;
  const mediumWeight = theme.typography?.fontWeight?.medium ?? 500;
  const boldWeight = theme.typography?.fontWeight?.bold ?? 700;

  const lineHeight = theme.typography?.lineHeight ?? 1.5;
  const letterSpacing = theme.typography?.letterSpacing ?? 0;

  vars['--ktheme-font-family'] = fontFamily;
  vars['--ktheme-font-size-small'] = `${smallSize}px`;
  vars['--ktheme-font-size-medium'] = `${mediumSize}px`;
  vars['--ktheme-font-size-large'] = `${largeSize}px`;
  vars['--ktheme-font-size-xlarge'] = `${xlargeSize}px`;

  vars['--ktheme-font-weight-light'] = String(lightWeight);
  vars['--ktheme-font-weight-regular'] = String(regularWeight);
  vars['--ktheme-font-weight-medium'] = String(mediumWeight);
  vars['--ktheme-font-weight-bold'] = String(boldWeight);

  vars['--ktheme-line-height'] = String(lineHeight);
  vars['--ktheme-letter-spacing'] = `${letterSpacing}em`;

  return {
    vars,
    tailwind: {
      fontFamily: {
        primary: [fontFamily]
      },
      fontSize: {
        small: `${smallSize}px`,
        medium: `${mediumSize}px`,
        large: `${largeSize}px`,
        xlarge: `${xlargeSize}px`
      },
      fontWeight: {
        light: String(lightWeight),
        regular: String(regularWeight),
        medium: String(mediumWeight),
        bold: String(boldWeight)
      },
      lineHeight: {
        normal: String(lineHeight)
      },
      letterSpacing: {
        normal: `${letterSpacing}em`
      }
    }
  };
}
