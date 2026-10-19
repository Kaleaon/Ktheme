import { NormalizedThemeTokens } from "../ir/tokenIR";
import { TokenRenderer } from "./TokenRenderer";
import { VectorIRNode } from "../../core/VectorTransformer";

export interface AndroidComposeExport {
  colorScheme: Record<string, string>;
  semanticColors: Record<string, string>;
  typography: Record<string, unknown>;
  effects: Record<string, unknown>;
  adaptation: Record<string, unknown>;
  icons?: Record<string, VectorIRNode>;
  kotlin: string;
}

export interface AndroidComposeOptions {
  packageName?: string;
  vectorIcons?: VectorIRNode[];
}

const MATERIAL3_COLOR_SCHEME_KEYS = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "background",
  "onBackground",
  "surface",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "surfaceDim",
  "surfaceBright",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "outline",
  "outlineVariant",
  "scrim",
  "inverseSurface",
  "inverseOnSurface",
  "inversePrimary",
] as const;

function formatArgbHex(hex: string): string {
  const clean = hex.replace("#", "").trim().toUpperCase();
  if (clean.length === 8) {
    return clean;
  }
  if (clean.length === 6) {
    return `FF${clean}`;
  }
  if (clean.length === 3) {
    const [r, g, b] = clean;
    return `FF${r}${r}${g}${g}${b}${b}`;
  }
  if (clean.length === 4) {
    const [a, r, g, b] = clean;
    return `${a}${a}${r}${r}${g}${g}${b}${b}`;
  }
  return clean.padStart(8, "F");
}

function asComposeColor(hex: string): string {
  return `Color(0x${formatArgbHex(hex)})`;
}

export class AndroidComposeRenderer
  implements TokenRenderer<AndroidComposeExport>
{
  readonly id = "android-compose";
  readonly name = "Android Jetpack Compose Exporter";

  render(
    tokens: NormalizedThemeTokens,
    options?: AndroidComposeOptions,
  ): AndroidComposeExport {
    const packageName = options?.packageName ?? "io.ktheme.compose";

    const colorScheme = MATERIAL3_COLOR_SCHEME_KEYS.reduce<
      Record<string, string>
    >((acc, key) => {
      acc[key] = tokens.color[key];
      return acc;
    }, {});

    const semanticColors: Record<string, string> = {
      success: tokens.color.semantic.success,
      warning: tokens.color.semantic.warning,
      info: tokens.color.semantic.info,
      critical: tokens.color.semantic.critical,
    };

    let packageHeader = `package ${packageName}\n\nimport androidx.compose.material3.darkColorScheme\nimport androidx.compose.material3.lightColorScheme\nimport androidx.compose.runtime.CompositionLocalProvider\nimport androidx.compose.runtime.staticCompositionLocalOf\nimport androidx.compose.ui.graphics.Color`;

    let kotlinIcons = "";
    const iconsMap: Record<string, VectorIRNode> = {};

    if (options?.vectorIcons && options.vectorIcons.length > 0) {
      packageHeader += `\nimport androidx.compose.ui.graphics.SolidColor\nimport androidx.compose.ui.graphics.vector.ImageVector\nimport androidx.compose.ui.graphics.vector.addPathNodes\nimport androidx.compose.ui.graphics.vector.path\nimport androidx.compose.ui.unit.dp`;

      const iconValDefs = options.vectorIcons
        .map((icon) => {
          iconsMap[icon.id] = icon;
          const propName =
            icon.name.charAt(0).toUpperCase() + icon.name.slice(1);
          const pathDefs = icon.paths
            .map((p) => {
              const fillArg =
                p.fill && p.fill !== "none"
                  ? `SolidColor(${asComposeColor(p.fill)})`
                  : "null";
              const strokeArg =
                p.stroke && p.stroke !== "none"
                  ? `SolidColor(${asComposeColor(p.stroke)})`
                  : "null";
              const strokeWidthArg = p.strokeWidth ?? 0;
              return `            path(\n                fill = ${fillArg},\n                stroke = ${strokeArg},\n                strokeLineWidth = ${strokeWidthArg}f,\n                pathData = addPathNodes("${p.d}")\n            )`;
            })
            .join("\n");

          return `    val ${propName}: ImageVector by lazy {\n        ImageVector.Builder(\n            name = "${propName}",\n            defaultWidth = ${icon.width}.dp,\n            defaultHeight = ${icon.height}.dp,\n            viewportWidth = ${icon.viewBox.width}f,\n            viewportHeight = ${icon.viewBox.height}f\n        ).apply {\n${pathDefs}\n        }.build()\n    }`;
        })
        .join("\n\n");

      kotlinIcons = `\n\nobject KthemeIcons {\n${iconValDefs}\n}`;
    }

    const colorSchemeFunction = tokens.darkMode
      ? "darkColorScheme"
      : "lightColorScheme";
    const kotlinColorScheme = `val KthemeColorScheme = ${colorSchemeFunction}(\n${Object.entries(
      colorScheme,
    )
      .map(([key, value]) => `    ${key} = ${asComposeColor(value)}`)
      .join(",\n")}\n)`;

    const kotlinSemanticColors = `data class KthemeSemanticColors(\n    val success: Color,\n    val warning: Color,\n    val info: Color,\n    val critical: Color\n)\n\nval KthemeSemanticColors = KthemeSemanticColors(\n${Object.entries(
      semanticColors,
    )
      .map(([key, value]) => `    ${key} = ${asComposeColor(value)}`)
      .join(",\n")}\n)`;

    const kotlinTypography = `object KthemeTypography {\n    val fontFamily = "${tokens.typography.fontFamily}"\n    val fontSizeSmall = ${tokens.typography.fontSize.small}.sp\n    val fontSizeMedium = ${tokens.typography.fontSize.medium}.sp\n    val fontSizeLarge = ${tokens.typography.fontSize.large}.sp\n    val fontSizeXLarge = ${tokens.typography.fontSize.xlarge}.sp\n}`;

    const kotlinAdaptation = `object KthemeAdaptation {\n    val density = "${tokens.layout.density}"\n    val cornerStyle = "${tokens.layout.cornerStyle}"\n}`;

    const layoutStd = tokens.layoutStandard;
    const kotlinLayout = `data class KthemeLayout(\n    val id: String = "${layoutStd?.id ?? 'compose'}",\n    val name: String = "${layoutStd?.name ?? 'Compose'}",\n    val navPhone: String = "${layoutStd?.navigation?.phone ?? 'bar'}",\n    val navWide: String = "${layoutStd?.navigation?.wide ?? 'rail'}",\n    val adaptiveWidthDp: Int = 720,\n    val cornerLargeDp: Int = ${layoutStd?.corners?.large ?? 18},\n    val cornerPanelDp: Int = ${layoutStd?.corners?.panel ?? 14},\n    val cornerTileDp: Int = ${layoutStd?.corners?.tile ?? 12},\n    val cornerCoverDp: Int = ${layoutStd?.corners?.cover ?? 6},\n    val cornerControlDp: Int = ${layoutStd?.corners?.control ?? 999},\n    val cornerIconDp: Int = ${layoutStd?.corners?.icon ?? 10},\n    val cornerArtworkDp: Int = ${layoutStd?.corners?.artwork ?? 20},\n    val typographyBody: String = "${layoutStd?.typography?.body ?? 'Roboto'}",\n    val minimumMetadataSp: Int = ${layoutStd?.typography?.minimumMetadata ?? 10},\n    val contentCase: String = "${layoutStd?.typography?.contentCase ?? 'preserve'}",\n    val navigationCase: String = "${layoutStd?.typography?.navigationCase ?? 'preserve'}",\n    val surfaces: String = "${layoutStd?.surfaces ?? 'compose'}",\n    val actions: String = "${layoutStd?.actions ?? 'theme-effect'}",\n    val player: String = "${layoutStd?.player ?? 'docked'}",\n    val shadow: String = "${layoutStd?.shadow ?? 'theme-effect'}"\n)\n\nval LocalKthemeLayout = staticCompositionLocalOf { KthemeLayout() }`;

    return {
      colorScheme,
      semanticColors,
      typography: tokens.typography as unknown as Record<string, unknown>,
      effects: tokens.effects as unknown as Record<string, unknown>,
      adaptation: tokens.adaptation as unknown as Record<string, unknown>,
      icons: Object.keys(iconsMap).length > 0 ? iconsMap : undefined,
      kotlin: `${packageHeader}\n\n${kotlinColorScheme}\n\n${kotlinSemanticColors}\n\n${kotlinTypography}\n\n${kotlinAdaptation}\n\n${kotlinLayout}${kotlinIcons}`,
    };
  }
}

export const androidComposeRenderer = new AndroidComposeRenderer();
