# Linkpoint — Android app reference build

**Linkpoint** is a community link-sharing app: every member gets a public profile that hosts a curated, themable list of links + collections, plus a social feed of what people they follow are sharing. Think *Linktree × Pinboard × Bluesky*, with Ktheme as the visual substrate so every profile can wear a different metallic / iconic theme.

This module is a **reference build** — production-shaped Android code that exercises Ktheme end-to-end. It's intended as both:

1. A drop-in starting point for teams building Ktheme-themed apps.
2. The canonical example we point at from the README: *"here's what consuming Ktheme really looks like."*

## Stack

| Layer | Choice | Why |
|---|---|---|
| UI | **Jetpack Compose + Material 3** | First-class Ktheme target. |
| KMP | **Compose Multiplatform-ready** | `data/`, `domain/`, and most `ui/` modules are pure Kotlin, no Android imports — the `app` module is the only `androidx.*` consumer. |
| Architecture | **MVVM + StateFlow** | One `*ViewModel` per screen, `StateFlow<UiState>` exposed to Compose, side-effects via `Channel<UiEffect>`. |
| DI | **Hilt** | Activity-scoped graph; `@HiltViewModel` for screens; repositories `@Singleton`. |
| Navigation | **Navigation-Compose** | Single `NavHost`, type-safe routes via sealed `Route` hierarchy, full back-stack handling. |
| Async | **kotlinx.coroutines** + **Flow** | StateFlow for state, SharedFlow for events. |
| Persistence | **DataStore (Preferences)** | Active theme id, auth token, onboarding flag. |
| Image loading | **Coil 3** | Compose-Multiplatform-ready; smaller surface than Glide. |
| Networking (sample) | **Ktor client** | KMP-friendly; the fake repos can be swapped for real Ktor calls without touching ViewModels. |
| Serialization | **kotlinx.serialization** | Already a Ktheme dep; one parser everywhere. |
| Theming | **Ktheme + ktheme-compose** | This is the whole point. |

The fake repositories return seeded `SampleData` so the app is fully clickable without a backend.

## Screen inventory (36)

```
auth/         Splash · Welcome · SignIn · SignUp · ForgotPassword · VerifyEmail
onboarding/   Onboarding1 · Onboarding2 · Onboarding3 · ProfileSetup · ImportLinks
home/         Home(Feed) · Discover · Trending
profile/      MyProfile · EditProfile · PublicProfile · Followers · Following
links/        LinksList · LinkDetail · AddLink · EditLink · ReorderLinks
collections/  Collections · CollectionDetail · NewCollection
search/       Search
inbox/        Notifications · Inbox · Conversation
settings/     Settings · ThemePicker
analytics/    Analytics · LinkStats
share/        ShareSheet · QRCode
```

## Module layout

```
app/                       (com.android.application — single APK)
 ├─ data/                  models, repos, DI, SampleData, DataStore
 ├─ domain/                use cases (thin wrappers over repos)
 ├─ ui/
 │   ├─ theme/             KthemeBridge — wires ktheme-compose to MaterialTheme
 │   ├─ components/        shared composables
 │   ├─ nav/               LinkpointNavHost + Routes
 │   └─ <feature>/         screen + ViewModel pairs
 └─ MainActivity.kt
```

The `data/` and `domain/` packages are **pure Kotlin** (no `androidx.*`), so a future `composeApp/` Multiplatform module can `commonMain` them as-is.
