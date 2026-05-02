// libs/ktheme-compose/build.gradle.kts
//
// Jetpack Compose integration. Depends on ktheme-core for models and
// the engine. Targets Android (Compose Material 3) but the Modifiers
// are pure Compose so a Compose-Multiplatform consumer can use them
// on Desktop/iOS too with minor sourceSet rearrangement.

plugins {
    id("com.android.library") version "8.5.0"
    kotlin("android") version "2.0.0"
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.0"
    `maven-publish`
}

group = "io.ktheme"
version = "1.0.0"

android {
    namespace = "io.ktheme.compose"
    compileSdk = 35
    defaultConfig { minSdk = 24 }
    buildFeatures { compose = true }
    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    api(project(":ktheme-core"))
    implementation(platform("androidx.compose:compose-bom:2024.09.02"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.runtime:runtime")
    implementation("androidx.compose.animation:animation")
}
