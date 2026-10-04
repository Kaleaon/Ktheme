import { Theme } from '../core/types';
import { normalizeSemanticRoles, toHexColor } from './utils';

export interface BlenderPropertyGroupExport {
  pythonScript: string;
  propertyNames: string[];
}

function hexToRgbaTuple(hex: string): [number, number, number, number] {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    return [
      Math.round(r * 10000) / 10000,
      Math.round(g * 10000) / 10000,
      Math.round(b * 10000) / 10000,
      1.0
    ];
  } else if (cleanHex.length === 8) {
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    const a = parseInt(cleanHex.substring(6, 8), 16) / 255;
    return [
      Math.round(r * 10000) / 10000,
      Math.round(g * 10000) / 10000,
      Math.round(b * 10000) / 10000,
      Math.round(a * 10000) / 10000
    ];
  }
  return [0.5, 0.5, 0.5, 1.0];
}

function formatTuple(tuple: [number, number, number, number]): string {
  return `(${tuple[0]}, ${tuple[1]}, ${tuple[2]}, ${tuple[3]})`;
}

export function toBlenderPropertyGroup(theme: Theme): BlenderPropertyGroupExport {
  const semantic = normalizeSemanticRoles(theme);

  const colors: Record<string, string> = {
    primary: toHexColor(theme.colorScheme.primary),
    on_primary: toHexColor(theme.colorScheme.onPrimary),
    primary_container: toHexColor(theme.colorScheme.primaryContainer),
    on_primary_container: toHexColor(theme.colorScheme.onPrimaryContainer),
    secondary: toHexColor(theme.colorScheme.secondary),
    on_secondary: toHexColor(theme.colorScheme.onSecondary),
    secondary_container: toHexColor(theme.colorScheme.secondaryContainer),
    on_secondary_container: toHexColor(theme.colorScheme.onSecondaryContainer),
    tertiary: toHexColor(theme.colorScheme.tertiary),
    on_tertiary: toHexColor(theme.colorScheme.onTertiary),
    tertiary_container: toHexColor(theme.colorScheme.tertiaryContainer),
    on_tertiary_container: toHexColor(theme.colorScheme.onTertiaryContainer),
    error: toHexColor(theme.colorScheme.error),
    on_error: toHexColor(theme.colorScheme.onError),
    error_container: toHexColor(theme.colorScheme.errorContainer),
    on_error_container: toHexColor(theme.colorScheme.onErrorContainer),
    background: toHexColor(theme.colorScheme.background),
    on_background: toHexColor(theme.colorScheme.onBackground),
    surface: toHexColor(theme.colorScheme.surface),
    on_surface: toHexColor(theme.colorScheme.onSurface),
    surface_variant: toHexColor(theme.colorScheme.surfaceVariant),
    on_surface_variant: toHexColor(theme.colorScheme.onSurfaceVariant),
    outline: toHexColor(theme.colorScheme.outline),
    outline_variant: toHexColor(theme.colorScheme.outlineVariant),
    scrim: toHexColor(theme.colorScheme.scrim),
    inverse_surface: toHexColor(theme.colorScheme.inverseSurface),
    inverse_on_surface: toHexColor(theme.colorScheme.inverseOnSurface),
    inverse_primary: toHexColor(theme.colorScheme.inversePrimary),
    semantic_success: semantic.success,
    semantic_warning: semantic.warning,
    semantic_info: semantic.info,
    semantic_critical: semantic.critical
  };

  const propertyNames: string[] = [
    ...Object.keys(colors),
    'layout_margin',
    'layout_spacing',
    'panel_width_scale',
    'button_height_scale',
    'icon_set'
  ];

  const colorPropLines = Object.entries(colors)
    .map(([key, hex]) => {
      const tuple = hexToRgbaTuple(hex);
      const name = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return `    ${key}: bpy.props.FloatVectorProperty(name="${name}", subtype='COLOR', size=4, min=0.0, max=1.0, default=${formatTuple(
        tuple
      )}, update=on_ktheme_update)`;
    })
    .join('\n');

  const pythonScript = `import bpy


def on_ktheme_update(self, context):
    try:
        from . import ktheme_runtime
        if hasattr(ktheme_runtime, "on_property_update"):
            ktheme_runtime.on_property_update(self, context)
    except Exception:
        pass


class KthemePropertyGroup(bpy.types.PropertyGroup):
${colorPropLines}

    layout_margin: bpy.props.FloatProperty(name="Layout Margin", default=4.0, min=0.0, max=32.0, update=on_ktheme_update)
    layout_spacing: bpy.props.FloatProperty(name="Layout Spacing", default=6.0, min=0.0, max=32.0, update=on_ktheme_update)
    panel_width_scale: bpy.props.FloatProperty(name="Panel Width Scale", default=1.0, min=0.5, max=3.0, update=on_ktheme_update)
    button_height_scale: bpy.props.FloatProperty(name="Button Height Scale", default=1.0, min=0.5, max=3.0, update=on_ktheme_update)

    icon_set: bpy.props.EnumProperty(
        name="Icon Set",
        items=[
            ('DEFAULT', 'Default', 'Standard Blender stock icons'),
            ('COMPACT', 'Compact', 'Compact theme icon set'),
            ('EXPRESSIVE', 'Expressive', 'Expressive theme icon set')
        ],
        default='DEFAULT',
        update=on_ktheme_update
    )


def register_ktheme_properties():
    bpy.utils.register_class(KthemePropertyGroup)
    bpy.types.WindowManager.ktheme = bpy.props.PointerProperty(type=KthemePropertyGroup, options={'SKIP_SAVE'})


def unregister_ktheme_properties():
    if hasattr(bpy.types.WindowManager, "ktheme"):
        del bpy.types.WindowManager.ktheme
    bpy.utils.unregister_class(KthemePropertyGroup)
`;

  return {
    pythonScript,
    propertyNames
  };
}
