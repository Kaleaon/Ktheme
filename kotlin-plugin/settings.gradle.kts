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

rootProject.name = "ktheme-kotlin"
