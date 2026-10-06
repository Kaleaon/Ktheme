plugins {
    kotlin("jvm") version "2.0.0" apply false
    kotlin("android") version "2.0.0" apply false
    kotlin("plugin.serialization") version "2.0.0" apply false
    id("com.android.library") version "8.5.0" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.0" apply false
}

subprojects {
    plugins.withId("maven-publish") {
        configure<PublishingExtension> {
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
    }
}

