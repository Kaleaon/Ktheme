// apps/linkpoint-android/app/src/main/kotlin/com/linkpoint/data/repo/ThemePreferences.kt
//
// Persistent settings — the active Ktheme id + onboarding flag.
// DataStore is used because it is Flow-native and survives process
// death without a Room schema.

package com.linkpoint.data.repo

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore by preferencesDataStore("linkpoint")

@Singleton
class ThemePreferences @Inject constructor(
    @ApplicationContext private val ctx: Context,
) {
    private val ACTIVE_THEME = stringPreferencesKey("active_theme_id")
    private val ONBOARDED    = booleanPreferencesKey("onboarded")

    val activeThemeId: Flow<String> = ctx.dataStore.data.map { it[ACTIVE_THEME] ?: "navy-gold" }
    val onboarded:    Flow<Boolean> = ctx.dataStore.data.map { it[ONBOARDED] ?: false }

    suspend fun setActiveTheme(id: String) {
        ctx.dataStore.edit { it[ACTIVE_THEME] = id }
    }
    suspend fun markOnboarded() {
        ctx.dataStore.edit { it[ONBOARDED] = true }
    }
}
