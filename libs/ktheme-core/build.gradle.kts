// libs/ktheme-core/build.gradle.kts
//
// Pure Kotlin JVM library — no Android, no Compose, no platform deps.
// Models, parser, and engine live here so every consumer (Compose, KMP,
// CLI tooling, server-side render) shares one source of truth.
//
// Publishes as `io.ktheme:ktheme-core`.

plugins {
    kotlin("jvm") version "2.0.0"
    kotlin("plugin.serialization") version "2.0.0"
    `maven-publish`
}

group = "io.ktheme"
version = "1.0.0"

repositories { mavenCentral() }

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.1")
    testImplementation(kotlin("test"))
}

kotlin {
    jvmToolchain(17)
    explicitApi()
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
            artifactId = "ktheme-core"
            pom {
                name.set("Ktheme Core")
                description.set("Theme engine, JSON model, and preset catalog for the Ktheme design system.")
                url.set("https://github.com/Kaleaon/Ktheme")
                licenses {
                    license {
                        name.set("MIT")
                        url.set("https://opensource.org/license/mit")
                    }
                }
            }
        }
    }
}
