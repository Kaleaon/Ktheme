// apps/linkpoint-android/app/src/main/kotlin/com/linkpoint/LinkpointApp.kt
//
// Application class — the Hilt graph root. Nothing else lives here;
// every singleton is declared in `di/`.

package com.linkpoint

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class LinkpointApp : Application()
