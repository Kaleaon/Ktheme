// apps/linkpoint-android/settings.gradle.kts
//
// Includes the published Ktheme libraries plus the Linkpoint app.
// `ktheme-core` and `ktheme-compose` are wired as composite builds
// against the sources in /libs so the app picks up local edits.

pluginManagement {
    repositories {
        maven { url = uri("https://maven-central.storage-download.googleapis.com/maven2") }
        gradlePluginPortal()
        google()
        mavenCentral()
    }
    plugins {
        id("org.jetbrains.kotlin.jvm") version "2.0.0"
        id("org.jetbrains.kotlin.android") version "2.0.0"
        id("org.jetbrains.kotlin.plugin.serialization") version "2.0.0"
        id("org.jetbrains.kotlin.plugin.compose") version "2.0.0"
        id("com.android.library") version "8.5.0"
        id("com.android.application") version "8.5.0"
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        maven { url = uri("https://maven-central.storage-download.googleapis.com/maven2") }
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
