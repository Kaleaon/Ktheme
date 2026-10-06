import { Theme } from "../core/types";
import { extractThemeTokens } from "./ir/extractIR";
import {
  flutterRenderer,
  FlutterThemeExport,
} from "./renderers/flutterRenderer";

export type { FlutterThemeExport };

export function toFlutterTheme(theme: Theme): FlutterThemeExport {
  const ir = extractThemeTokens(theme);
  return flutterRenderer.render(ir);
}
