export interface WebExporterOptions {
  includeEffects?: boolean;
  includeTypography?: boolean;
  includeCorners?: boolean;
}

export type CssVarsOptions = WebExporterOptions;
export type TailwindConfigOptions = WebExporterOptions;

export interface EffectVarsExport {
  vars: Record<string, string>;
  tailwind: {
    colors?: Record<string, string>;
    boxShadow?: Record<string, string>;
    backgroundImage?: Record<string, string>;
    backdropBlur?: Record<string, string>;
  };
}

export interface TypographyVarsExport {
  vars: Record<string, string>;
  tailwind: {
    fontFamily?: Record<string, string | string[]>;
    fontSize?: Record<string, string>;
    fontWeight?: Record<string, string>;
    lineHeight?: Record<string, string>;
    letterSpacing?: Record<string, string>;
  };
}

export interface CornerVarsExport {
  vars: Record<string, string>;
  tailwind: {
    borderRadius?: Record<string, string>;
  };
}
