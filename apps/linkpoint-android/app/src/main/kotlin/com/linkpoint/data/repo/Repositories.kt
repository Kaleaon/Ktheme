// apps/linkpoint-android/app/src/main/kotlin/com/linkpoint/data/repo/Repositories.kt
//
// Fake repositories. Each exposes Flow<…> so ViewModels can collect
// without caring whether the backing store is in-memory or a real
// Ktor + Room pair. Replace these with Ktor-backed implementations
// without touching the rest of the codebase.

package com.linkpoint.data.repo

import com.linkpoint.data.model.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.update
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor() {
    private val _signedIn = MutableStateFlow(false)
    val signedIn = _signedIn.asStateFlow()

    suspend fun signIn(email: String, password: String): DataResult<User> {
        delay(600)
        if (password.length < 6) return DataResult.Err("Password too short")
        _signedIn.value = true
        return DataResult.Ok(SampleData.me)
    }

    suspend fun signUp(email: String, handle: String, password: String): DataResult<User> {
        delay(900)
        _signedIn.value = true
        return DataResult.Ok(SampleData.me.copy(handle = handle))
    }

    suspend fun sendReset(email: String): DataResult<Unit> {
        delay(500); return DataResult.Ok(Unit)
    }

    fun signOut() { _signedIn.value = false }
}

@Singleton
class ProfileRepository @Inject constructor() {
    private val _me = MutableStateFlow(SampleData.me)
    val me = _me.asStateFlow()

    fun userByHandle(handle: String): User? =
        SampleData.users.firstOrNull { it.handle == handle }

    fun followers(userId: String): List<User> = SampleData.users.filter { it.id != userId }.take(8)
    fun following(userId: String): List<User> = SampleData.users.filter { it.id != userId }.drop(2)

    suspend fun update(displayName: String, bio: String): DataResult<User> {
        delay(400)
        _me.update { it.copy(displayName = displayName, bio = bio) }
        return DataResult.Ok(_me.value)
    }
}

@Singleton
class LinkRepository @Inject constructor() {
    private val _links = MutableStateFlow(SampleData.myLinks)
    val links = _links.asStateFlow()

    fun byId(id: String): Link? = _links.value.firstOrNull { it.id == id }

    suspend fun add(title: String, url: String, collectionId: String?): Link {
        delay(300)
        val link = Link(
            id = "l-${System.currentTimeMillis()}",
            ownerId = SampleData.me.id,
            title = title, url = url, collectionId = collectionId,
        )
        _links.update { it + link }
        return link
    }

    suspend fun update(id: String, title: String, url: String): Link? {
        delay(250)
        var updated: Link? = null
        _links.update { list ->
            list.map { if (it.id == id) it.copy(title = title, url = url).also { u -> updated = u } else it }
        }
        return updated
    }

    suspend fun reorder(ids: List<String>) {
        delay(150)
        _links.update { list ->
            val by = list.associateBy { it.id }
            ids.mapNotNull(by::get)
        }
    }

    suspend fun togglePin(id: String) {
        _links.update { list -> list.map { if (it.id == id) it.copy(pinned = !it.pinned) else it } }
    }

    suspend fun delete(id: String) {
        _links.update { list -> list.filterNot { it.id == id } }
    }
}

@Singleton
class CollectionRepository @Inject constructor() {
    private val _cols = MutableStateFlow(SampleData.collections)
    val collections = _cols.asStateFlow()

    fun byId(id: String): com.linkpoint.data.model.Collection? = _cols.value.firstOrNull { it.id == id }

    suspend fun create(name: String, description: String, color: String): com.linkpoint.data.model.Collection {
        delay(250)
        val c = com.linkpoint.data.model.Collection(
            id = "c-${System.currentTimeMillis()}", ownerId = SampleData.me.id,
            name = name, description = description, color = color,
        )
        _cols.update { it + c }
        return c
    }
}

@Singleton
class FeedRepository @Inject constructor() {
    fun home(): Flow<List<Post>> = flow {
        delay(250); emit(SampleData.feed)
    }
    fun discover(): Flow<List<Post>> = flow {
        delay(200); emit(SampleData.feed.shuffled())
    }
    fun trending(): Flow<List<Post>> = flow {
        delay(200); emit(SampleData.feed.sortedByDescending { it.likes })
    }

    suspend fun toggleLike(postId: String) { /* no-op for sample */ }
}

@Singleton
class SearchRepository @Inject constructor() {
    fun search(query: String): Flow<List<User>> = flow {
        delay(200)
        val q = query.trim().lowercase()
        emit(if (q.isEmpty()) SampleData.users
             else SampleData.users.filter {
                 it.handle.contains(q) || it.displayName.lowercase().contains(q)
             })
    }
}

@Singleton
class NotificationRepository @Inject constructor() {
    private val _items = MutableStateFlow(SampleData.notifications)
    val items: Flow<List<Notification>> = _items.asStateFlow()

    suspend fun markAllRead() {
        _items.update { list -> list.map { it.copy(read = true) } }
    }
}

@Singleton
class MessageRepository @Inject constructor() {
    fun conversations(): Flow<List<Conversation>> =
        MutableStateFlow(SampleData.conversations).asStateFlow()

    fun messages(convoId: String): Flow<List<Message>> =
        MutableStateFlow(SampleData.messages[convoId].orEmpty()).asStateFlow()
}

@Singleton
class AnalyticsRepository @Inject constructor() {
    fun summary(): Flow<AnalyticsSummary> = flow { delay(300); emit(SampleData.analytics) }
    fun stats(linkId: String): Flow<AnalyticsSummary> = summary()
}
