// apps/linkpoint-android/settings.gradle.kts
//
// Includes the published Ktheme libraries plus the Linkpoint app.
// `ktheme-core` and `ktheme-compose` are wired as composite builds
// against the sources in /libs so the app picks up local edits.

pluginManagement {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
    versionCatalogs {
        create("libs") { from(files("../../gradle/libs.versions.toml")) }
    }
}

rootProject.name = "linkpoint-android"
include(":app")

includeBuild("../../libs/ktheme-core")
includeBuild("../../libs/ktheme-compose")
