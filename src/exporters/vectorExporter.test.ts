import { Theme, IconToken } from '../core/types';
import { toAndroidCompose } from './toAndroidCompose';
import { toBlenderPropertyGroup } from './toBlenderPropertyGroup';
import { exportSvgVars, toWebSvgComponent, toWebSvgSprite } from './web';

describe('Vector Exporter Pipeline', () => {
  const settingsIcon: IconToken = {
    id: 'settings',
    name: 'Settings',
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M12 15a3 3 0 100-6 3 3 0 000 6z',
        fill: 'primary'
      }
    ]
  };

  const addIcon: IconToken = {
    id: 'add',
    name: 'Add',
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
        fill: 'secondary'
      }
    ]
  };

  const themeWithAssets: Theme = {
    metadata: {
      id: 'icon-export-theme',
      name: 'Icon Export Theme',
      description: 'Theme with vector icon assets',
      author: 'Test',
      version: '1.0.0',
      tags: ['icons'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    },
    darkMode: true,
    colorScheme: {
      primary: '#102030',
      onPrimary: '#FFFFFF',
      primaryContainer: '#203040',
      onPrimaryContainer: '#FFFFFF',
      secondary: '#405060',
      onSecondary: '#FFFFFF',
      secondaryContainer: '#506070',
      onSecondaryContainer: '#FFFFFF',
      tertiary: '#708090',
      onTertiary: '#FFFFFF',
      tertiaryContainer: '#8090A0',
      onTertiaryContainer: '#FFFFFF',
      error: '#D32F2F',
      onError: '#FFFFFF',
      errorContainer: '#FFCDD2',
      onErrorContainer: '#000000',
      background: '#121212',
      onBackground: '#FFFFFF',
      surface: '#1E1E1E',
      onSurface: '#FFFFFF',
      surfaceVariant: '#2A2A2A',
      onSurfaceVariant: '#EEEEEE',
      outline: '#777777',
      outlineVariant: '#888888',
      scrim: '#000000',
      inverseSurface: '#FFFFFF',
      inverseOnSurface: '#000000',
      inversePrimary: '#102030'
    },
    assets: {
      icons: {
        settings: settingsIcon,
        add: addIcon
      }
    }
  };

  it('exports Android Compose Kotlin code with type-safe ImageVector definitions', () => {
    const exported = toAndroidCompose(themeWithAssets);

    expect(exported.kotlin).toContain('object KthemeIcons');
    expect(exported.kotlin).toContain('val Settings: ImageVector by lazy');
    expect(exported.kotlin).toContain('val Add: ImageVector by lazy');
    expect(exported.kotlin).toContain('pathData = addPathNodes("M12 15a3 3 0 100-6 3 3 0 000 6z")');
    expect(exported.kotlin).toContain('SolidColor(Color(0xFF102030))');
    expect(exported.icons?.settings).toBeDefined();
    expect(exported.icons?.add).toBeDefined();
  });

  it('exports Blender PropertyGroup Python code with bpy.utils.previews registration', () => {
    const exported = toBlenderPropertyGroup(themeWithAssets);

    expect(exported.pythonScript).toContain('_ktheme_icon_previews = None');
    expect(exported.pythonScript).toContain('def register_ktheme_icons():');
    expect(exported.pythonScript).toContain('def unregister_ktheme_icons():');
    expect(exported.pythonScript).toContain('def get_ktheme_icon_id(key):');
    expect(exported.pythonScript).toContain('register_ktheme_icons()');
  });

  it('exports Web inline SVG components and CSS symbol sprites', () => {
    const component = toWebSvgComponent(settingsIcon, themeWithAssets);
    expect(component).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(component).toContain('d="M12 15a3 3 0 100-6 3 3 0 000 6z"');
    expect(component).toContain('fill="#102030"');

    const sprite = toWebSvgSprite(themeWithAssets.assets!, themeWithAssets);
    expect(sprite).toContain('<symbol id="icon-settings"');
    expect(sprite).toContain('<symbol id="icon-add"');

    const svgVars = exportSvgVars(themeWithAssets);
    expect(svgVars.components.settings).toBeDefined();
    expect(svgVars.components.add).toBeDefined();
    expect(svgVars.symbolSprite).toContain('icon-settings');
  });
});
