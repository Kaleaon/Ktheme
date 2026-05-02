// apps/linkpoint-android/app/src/main/kotlin/com/linkpoint/data/model/Models.kt
//
// All domain models in one file. Pure Kotlin (no androidx imports).
// Every model is `@Serializable` so the same shapes round-trip
// through Ktor and DataStore (JSON-encoded).

package com.linkpoint.data.model

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: String,
    val handle: String,           // "@dani"
    val displayName: String,
    val bio: String = "",
    val avatarUrl: String? = null,
    val bannerUrl: String? = null,
    val themeId: String = "navy-gold",
    val followers: Int = 0,
    val following: Int = 0,
    val verified: Boolean = false,
)

@Serializable
data class Link(
    val id: String,
    val ownerId: String,
    val title: String,
    val url: String,
    val description: String = "",
    val iconUrl: String? = null,
    val collectionId: String? = null,
    val pinned: Boolean = false,
    val clicks: Int = 0,
    val createdAt: Long = 0L,
)

@Serializable
data class Collection(
    val id: String,
    val ownerId: String,
    val name: String,
    val description: String = "",
    val color: String = "#D4AF37",
    val linkCount: Int = 0,
)

@Serializable
data class Post(
    // A "share" — when a user posts a link to their followers' feed.
    val id: String,
    val authorId: String,
    val link: Link,
    val note: String = "",
    val likes: Int = 0,
    val reshares: Int = 0,
    val likedByMe: Boolean = false,
    val createdAt: Long = 0L,
)

@Serializable
data class Notification(
    val id: String,
    val kind: Kind,
    val actorHandle: String,
    val target: String,
    val createdAt: Long = 0L,
    val read: Boolean = false,
) {
    enum class Kind { Follow, Like, Reshare, Mention, ProfileVisit }
}

@Serializable
data class Conversation(
    val id: String,
    val withUser: User,
    val lastMessage: String,
    val lastAt: Long = 0L,
    val unread: Int = 0,
)

@Serializable
data class Message(
    val id: String,
    val convoId: String,
    val fromMe: Boolean,
    val body: String,
    val sentAt: Long = 0L,
)

@Serializable
data class LinkStat(
    val day: String,        // "Mon" | "Tue"…
    val clicks: Int,
)

@Serializable
data class AnalyticsSummary(
    val views7d: Int,
    val clicks7d: Int,
    val ctr: Float,             // 0–1
    val topLinks: List<Pair<String, Int>>,
    val daily: List<LinkStat>,
)

/** Result wrapper used by repositories; not exposed past ViewModels. */
sealed interface DataResult<out T> {
    data class Ok<T>(val value: T) : DataResult<T>
    data class Err(val message: String) : DataResult<Nothing>
}
