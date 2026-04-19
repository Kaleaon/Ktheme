package com.ktheme.core

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.decodeFromJsonElement

const val SCHEMA_VERSION = 1

typealias ThemeMigration = (JsonObject) -> JsonObject

private val migrations: Map<Int, ThemeMigration> = mapOf(
    1 to { theme ->
        buildJsonObject {
            theme.forEach { (key, value) -> put(key, value) }
            put("schemaVersion", SCHEMA_VERSION)
        }
    }
)

@Serializable
private data class MinimalThemeMetadata(
    val id: String? = null,
    val name: String? = null
)

@Serializable
private data class MinimalThemeImportEnvelope(
    val schemaVersion: Int? = null,
    val metadata: MinimalThemeMetadata? = null
)

data class ParsedThemeImportMetadata(
    val schemaVersion: Int,
    val metadataId: String?,
    val metadataName: String?
)

fun parseThemeImportMetadata(rawTheme: JsonObject, json: Json): ParsedThemeImportMetadata {
    val envelope = json.decodeFromJsonElement<MinimalThemeImportEnvelope>(rawTheme)
    return ParsedThemeImportMetadata(
        schemaVersion = envelope.schemaVersion ?: 0,
        metadataId = envelope.metadata?.id,
        metadataName = envelope.metadata?.name
    )
}

fun migrateTheme(rawTheme: JsonObject, fromVersion: Int, toVersion: Int): JsonObject {
    if (fromVersion > toVersion) {
        throw IllegalArgumentException(
            "Cannot migrate theme backwards from schema $fromVersion to $toVersion"
        )
    }

    var migratedTheme = rawTheme

    for (targetVersion in (fromVersion + 1)..toVersion) {
        val migrateToVersion = migrations[targetVersion]
            ?: throw IllegalArgumentException("No migration path for schema version $targetVersion")
        migratedTheme = migrateToVersion(migratedTheme)
    }

    return migratedTheme
}
