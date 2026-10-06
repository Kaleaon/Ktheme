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
    composeOptions { kotlinCompilerExtensionVersion = "1.5.14" }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    if (findProject(":libs:ktheme-core") != null) {
        api(project(":libs:ktheme-core"))
    } else if (findProject(":ktheme-core") != null) {
        api(project(":ktheme-core"))
    } else {
        api("io.ktheme:ktheme-core:1.0.0")
    }
    implementation(platform("androidx.compose:compose-bom:2024.09.02"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.runtime:runtime")
    implementation("androidx.compose.animation:animation")
}
