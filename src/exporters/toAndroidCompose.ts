import { Theme } from "../core/types";
import { VectorTransformer, VectorIRNode } from "../core/VectorTransformer";
import { extractThemeTokens } from "./ir/extractIR";
import {
  androidComposeRenderer,
  AndroidComposeExport,
  AndroidComposeOptions,
} from "./renderers/androidComposeRenderer";

export type { AndroidComposeExport, AndroidComposeOptions };

export function toAndroidCompose(
  theme: Theme,
  options?: AndroidComposeOptions,
): AndroidComposeExport {
  const ir = extractThemeTokens(theme);

  const vectorIcons: VectorIRNode[] = [...(options?.vectorIcons || [])];
  if (theme.assets?.icons) {
    for (const iconToken of Object.values(theme.assets.icons)) {
      vectorIcons.push(VectorTransformer.transformIcon(iconToken, theme));
    }
  }

  const mergedOptions: AndroidComposeOptions = {
    ...options,
    vectorIcons: vectorIcons.length > 0 ? vectorIcons : undefined,
  };

  return androidComposeRenderer.render(ir, mergedOptions);
}
