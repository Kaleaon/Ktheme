// apps/linkpoint-android/app/src/main/kotlin/com/linkpoint/MainActivity.kt
//
// Single-activity host. `LinkpointNavHost` does all routing.
// `KthemeProvider` reads the active theme id from DataStore so the
// app paints itself with the user's chosen Ktheme preset on launch.

package com.linkpoint

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.linkpoint.data.repo.ThemePreferences
import com.linkpoint.ui.nav.LinkpointNavHost
import dagger.hilt.android.AndroidEntryPoint
import dagger.hilt.android.lifecycle.HiltViewModel
import io.ktheme.compose.KthemeTheme
import io.ktheme.presets.Presets
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val vm: AppShellViewModel = hiltViewModel()
            val themeId by vm.themeId.collectAsState()
            KthemeTheme(theme = Presets.load(themeId)) {
                LinkpointNavHost()
            }
        }
    }
}

@HiltViewModel
class AppShellViewModel @Inject constructor(
    prefs: ThemePreferences,
) : ViewModel() {
    val themeId = prefs.activeThemeId.stateIn(
        viewModelScope, SharingStarted.Eagerly, "navy-gold"
    )
}
