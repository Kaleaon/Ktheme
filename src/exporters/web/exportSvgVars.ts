import { AssetCatalog, IconToken, Theme } from "../../core/types";
import { VectorTransformer, VectorIRNode } from "../../core/VectorTransformer";

export interface WebSvgExport {
  components: Record<string, string>;
  symbolSprite: string;
}

export function toWebSvgComponent(icon: IconToken, theme?: Theme): string {
  const ir: VectorIRNode = VectorTransformer.transformIcon(icon, theme);
  const vb = `${ir.viewBox.x} ${ir.viewBox.y} ${ir.viewBox.width} ${ir.viewBox.height}`;

  const pathElements = ir.paths
    .map((p) => {
      let attrs = `d="${p.d}"`;
      if (p.fill) attrs += ` fill="${p.fill}"`;
      if (p.stroke) attrs += ` stroke="${p.stroke}"`;
      if (p.strokeWidth !== undefined)
        attrs += ` stroke-width="${p.strokeWidth}"`;
      if (p.strokeLinecap) attrs += ` stroke-linecap="${p.strokeLinecap}"`;
      if (p.strokeLinejoin) attrs += ` stroke-linejoin="${p.strokeLinejoin}"`;
      if (p.fillRule) attrs += ` fill-rule="${p.fillRule}"`;
      if (p.opacity !== undefined) attrs += ` opacity="${p.opacity}"`;
      return `  <path ${attrs} />`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ir.width}" height="${ir.height}" viewBox="${vb}" aria-hidden="true">\n${pathElements}\n</svg>`;
}

export function toWebSvgSprite(catalog: AssetCatalog, theme?: Theme): string {
  if (!catalog.icons || Object.keys(catalog.icons).length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none;"></svg>`;
  }

  const symbols = Object.values(catalog.icons)
    .map((icon) => {
      const ir = VectorTransformer.transformIcon(icon, theme);
      const vb = `${ir.viewBox.x} ${ir.viewBox.y} ${ir.viewBox.width} ${ir.viewBox.height}`;

      const pathElements = ir.paths
        .map((p) => {
          let attrs = `d="${p.d}"`;
          if (p.fill) attrs += ` fill="${p.fill}"`;
          if (p.stroke) attrs += ` stroke="${p.stroke}"`;
          if (p.strokeWidth !== undefined)
            attrs += ` stroke-width="${p.strokeWidth}"`;
          if (p.strokeLinecap) attrs += ` stroke-linecap="${p.strokeLinecap}"`;
          if (p.strokeLinejoin)
            attrs += ` stroke-linejoin="${p.strokeLinejoin}"`;
          if (p.fillRule) attrs += ` fill-rule="${p.fillRule}"`;
          if (p.opacity !== undefined) attrs += ` opacity="${p.opacity}"`;
          return `    <path ${attrs} />`;
        })
        .join("\n");

      return `  <symbol id="icon-${ir.id}" viewBox="${vb}">\n${pathElements}\n  </symbol>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">\n${symbols}\n</svg>`;
}

export function exportSvgVars(theme: Theme): WebSvgExport {
  const components: Record<string, string> = {};
  const icons = theme.assets?.icons || {};

  for (const [key, icon] of Object.entries(icons)) {
    components[key] = toWebSvgComponent(icon, theme);
  }

  const symbolSprite = theme.assets
    ? toWebSvgSprite(theme.assets, theme)
    : `<svg xmlns="http://www.w3.org/2000/svg" style="display:none;"></svg>`;

  return {
    components,
    symbolSprite,
  };
}
