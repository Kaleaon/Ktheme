pluginManagement {
    repositories {
        maven { url = uri("https://maven-central.storage-download.googleapis.com/maven2") }
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        mavenLocal()
        maven { url = uri("https://maven-central.storage-download.googleapis.com/maven2") }
        google()
        mavenCentral()
    }
}

rootProject.name = "ktheme"

include(":ktheme-runtime")
include(":ktheme-core")
include(":ktheme-compose")

project(":ktheme-runtime").projectDir = file("libs/ktheme-runtime")
project(":ktheme-core").projectDir = file("libs/ktheme-core")
project(":ktheme-compose").projectDir = file("libs/ktheme-compose")
