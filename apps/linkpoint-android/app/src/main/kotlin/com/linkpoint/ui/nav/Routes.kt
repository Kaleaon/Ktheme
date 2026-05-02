// apps/linkpoint-android/app/src/main/kotlin/com/linkpoint/ui/nav/Routes.kt
//
// Type-safe navigation routes. Sealed hierarchy + helper builders so
// callers can `nav.go(Route.LinkDetail("l-1"))` without re-typing
// the underlying string template.

package com.linkpoint.ui.nav

sealed class Route(val path: String) {
    // auth
    data object Splash       : Route("splash")
    data object Welcome      : Route("welcome")
    data object SignIn       : Route("auth/sign-in")
    data object SignUp       : Route("auth/sign-up")
    data object ForgotPassword : Route("auth/forgot")
    data object VerifyEmail  : Route("auth/verify")

    // onboarding
    data object Onboarding1  : Route("onb/1")
    data object Onboarding2  : Route("onb/2")
    data object Onboarding3  : Route("onb/3")
    data object ProfileSetup : Route("onb/profile")
    data object ImportLinks  : Route("onb/import")

    // home
    data object Home         : Route("home")
    data object Discover     : Route("discover")
    data object Trending     : Route("trending")

    // profile
    data object MyProfile    : Route("me")
    data object EditProfile  : Route("me/edit")
    data class  PublicProfile(val handle: String) : Route("u/$handle") {
        companion object { const val template = "u/{handle}"; const val arg = "handle" }
    }
    data class  Followers(val userId: String) : Route("u/$userId/followers") {
        companion object { const val template = "u/{userId}/followers"; const val arg = "userId" }
    }
    data class  Following(val userId: String) : Route("u/$userId/following") {
        companion object { const val template = "u/{userId}/following"; const val arg = "userId" }
    }

    // links
    data object LinksList    : Route("links")
    data class  LinkDetail(val id: String) : Route("links/$id") {
        companion object { const val template = "links/{id}"; const val arg = "id" }
    }
    data object AddLink      : Route("links/new")
    data class  EditLink(val id: String) : Route("links/$id/edit") {
        companion object { const val template = "links/{id}/edit"; const val arg = "id" }
    }
    data object ReorderLinks : Route("links/reorder")

    // collections
    data object Collections  : Route("collections")
    data class  CollectionDetail(val id: String) : Route("collections/$id") {
        companion object { const val template = "collections/{id}"; const val arg = "id" }
    }
    data object NewCollection: Route("collections/new")

    // search
    data object Search       : Route("search")

    // notifications + inbox
    data object Notifications: Route("notifications")
    data object Inbox        : Route("inbox")
    data class  Conversation(val id: String) : Route("inbox/$id") {
        companion object { const val template = "inbox/{id}"; const val arg = "id" }
    }

    // settings
    data object Settings     : Route("settings")
    data object ThemePicker  : Route("settings/theme")

    // analytics
    data object Analytics    : Route("analytics")
    data class  LinkStats(val id: String) : Route("analytics/$id") {
        companion object { const val template = "analytics/{id}"; const val arg = "id" }
    }

    // share
    data object ShareSheet   : Route("share")
    data object QRCode       : Route("share/qr")
}
