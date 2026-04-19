plugins {
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.serialization") version "1.9.22"
    `maven-publish`
    application
}

group = "com.ktheme"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    // Kotlin
    implementation(kotlin("stdlib"))
    
    // JSON serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")
    
    // Compose Material 3 adapter support
    implementation("org.jetbrains.compose.material3:material3:1.6.11")
    implementation("org.jetbrains.compose.ui:ui-graphics:1.6.11")

    // Testing
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(11)
}

application {
    mainClass.set("com.ktheme.examples.AdvancedThemeStudioKt")
}

tasks.jar {
    manifest {
        attributes["Main-Class"] = "com.ktheme.examples.AdvancedThemeStudioKt"
    }
    
    // Create fat JAR with all dependencies
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            groupId = "com.ktheme"
            artifactId = "ktheme-kotlin"
            version = "1.0.0"
            
            from(components["java"])
        }
    }
}
