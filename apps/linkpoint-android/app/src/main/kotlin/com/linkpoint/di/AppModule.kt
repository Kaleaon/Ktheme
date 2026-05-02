// apps/linkpoint-android/app/src/main/kotlin/com/linkpoint/di/AppModule.kt
//
// Hilt graph. The fake repositories are `@Singleton` so a single
// in-memory store persists across configuration changes. To switch
// to a real backend, swap these `@Provides` for a `@Binds` against
// a Ktor-backed implementation.

package com.linkpoint.di

import com.linkpoint.data.repo.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    // Fakes are `@Singleton` already; this module exists to give us
    // a single place to swap them for real implementations later.

    @Provides @Singleton fun auth():    AuthRepository    = AuthRepository()
    @Provides @Singleton fun profile(): ProfileRepository = ProfileRepository()
    @Provides @Singleton fun links():   LinkRepository    = LinkRepository()
    @Provides @Singleton fun cols():    CollectionRepository = CollectionRepository()
    @Provides @Singleton fun feed():    FeedRepository    = FeedRepository()
    @Provides @Singleton fun search():  SearchRepository  = SearchRepository()
    @Provides @Singleton fun notifs():  NotificationRepository = NotificationRepository()
    @Provides @Singleton fun msgs():    MessageRepository = MessageRepository()
    @Provides @Singleton fun analytics(): AnalyticsRepository = AnalyticsRepository()
}
