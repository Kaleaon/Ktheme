import { Theme } from '../../core/types';
import { CornerVarsExport, WebExporterOptions } from './types';

export function exportCornerVars(
  theme: Theme,
  options?: WebExporterOptions
): CornerVarsExport {
  if (options?.includeCorners === false) {
    return { vars: {}, tailwind: {} };
  }

  const vars: Record<string, string> = {};

  const smallCorner = theme.tokens?.corners?.small ?? 4;
  const mediumCorner = theme.tokens?.corners?.medium ?? 8;
  const largeCorner = theme.tokens?.corners?.large ?? 12;
  const xlargeCorner = theme.tokens?.corners?.xlarge ?? 16;

  vars['--ktheme-corner-small'] = `${smallCorner}px`;
  vars['--ktheme-corner-medium'] = `${mediumCorner}px`;
  vars['--ktheme-corner-large'] = `${largeCorner}px`;
  vars['--ktheme-corner-xlarge'] = `${xlargeCorner}px`;

  return {
    vars,
    tailwind: {
      borderRadius: {
        small: `${smallCorner}px`,
        medium: `${mediumCorner}px`,
        large: `${largeCorner}px`,
        xlarge: `${xlargeCorner}px`
      }
    }
  };
}
