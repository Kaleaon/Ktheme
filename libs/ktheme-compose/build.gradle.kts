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
    publishing {
        singleVariant("release") {
            withSourcesJar()
        }
    }
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
    testImplementation("junit:junit:4.13.2")
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            artifactId = "ktheme-compose"
            afterEvaluate {
                from(components["release"])
            }
            pom {
                name.set("Ktheme Compose")
                description.set("Jetpack Compose UI components and theme integration for Ktheme.")
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
    repositories {
        maven {
            name = "remoteMaven"
            url = uri(System.getenv("MAVEN_REPO_URL") ?: "https://repo.maven.apache.org/maven2")
            credentials {
                username = System.getenv("MAVEN_USERNAME") ?: ""
                password = System.getenv("MAVEN_PASSWORD") ?: ""
            }
        }
    }
}

