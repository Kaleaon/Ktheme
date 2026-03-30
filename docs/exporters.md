# Exporters: Cross-platform theme token bundles

Ktheme exporters convert a `Theme` into target-specific token bundles so teams can share one source of truth across web and native stacks.

## 1) CSS Variables (`toCssVars`)

```ts
import { toCssVars } from '@ktheme/engine';

const { cssText } = toCssVars(theme);
document.head.insertAdjacentHTML('beforeend', `<style>${cssText}</style>`);
```

## 2) Tailwind (`toTailwindConfig`)

```ts
import { toTailwindConfig } from '@ktheme/engine';

const kthemeTokens = toTailwindConfig(theme);

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: kthemeTokens.darkMode,
  theme: {
    extend: {
      ...kthemeTokens.theme.extend
    }
  }
};
```

## 3) Android Compose (`toAndroidCompose`)

```ts
import { toAndroidCompose } from '@ktheme/engine';

const { kotlin } = toAndroidCompose(theme);
// write kotlin into a generated file, then consume in MaterialTheme
```

```kotlin
MaterialTheme(
  colorScheme = KthemeColorScheme,
) {
  AppContent()
}
```

## 4) SwiftUI (`toSwiftUI`)

```ts
import { toSwiftUI } from '@ktheme/engine';

const { swift } = toSwiftUI(theme);
// write swift into your design-system target
```

```swift
struct ContentView: View {
  let palette = KthemePalette()

  var body: some View {
    Text("Hello")
      .padding()
      .background(palette.surface)
      .foregroundStyle(palette.primary)
  }
}
```

## 5) Flutter (`toFlutterTheme`)

```ts
import { toFlutterTheme } from '@ktheme/engine';

const { dart } = toFlutterTheme(theme);
// write dart into your app/lib/theme folder
```

```dart
MaterialApp(
  theme: ThemeData(colorScheme: kthemeColorScheme),
  home: const HomeScreen(),
)
```

## 6) W3C Design Tokens (`toDesignTokensJson`)

```ts
import { toDesignTokensJson } from '@ktheme/engine';

const tokens = toDesignTokensJson(theme);
const json = JSON.stringify(tokens, null, 2);
```

This export follows the design tokens community group draft structure (`$schema`, `$type`, `$value`) and includes semantic roles for `success`, `warning`, `info`, and `critical`.
