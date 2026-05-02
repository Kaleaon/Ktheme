// apps/linkpoint-android/app/src/main/kotlin/com/linkpoint/data/repo/SampleData.kt
//
// Seed data so the app is fully clickable without a backend. Real
// repos can swap this for a Ktor API call without touching ViewModels.

package com.linkpoint.data.repo

import com.linkpoint.data.model.*

object SampleData {

    val me = User(
        id = "u-me",
        handle = "@dani",
        displayName = "Dani Ortega",
        bio = "Building Linkpoint. Curating the small web. Brunch enthusiast.",
        themeId = "navy-gold",
        followers = 1284,
        following = 312,
        verified = true,
    )

    val users = listOf(
        me,
        User("u-1", "@arden",   "Arden Vale",      "design systems · type · type · type", themeId = "rose-gold",       followers = 4810,  following = 220),
        User("u-2", "@kestrel", "Kestrel Mahoney", "infosec, side projects, niche fonts",  themeId = "neo-noir-neon",   followers = 2390,  following = 401),
        User("u-3", "@nina",    "Nina Park",       "UX research at a hospital",            themeId = "calm-clinical",   followers = 980,   following = 122),
        User("u-4", "@hex",     "Hex",             "// terminal · git · vim",              themeId = "ink-terminal-modern", followers = 12_490, following = 17),
        User("u-5", "@solene",  "Solène Brun",     "art deco, ballet, Paris",              themeId = "art-deco",        followers = 8_120, following = 590),
        User("u-6", "@mira",    "Mira Sandoval",   "soft botanical web crafts",            themeId = "frutiger-aero",   followers = 670,   following = 88),
    )

    val collections = listOf(
        Collection("c-1", me.id, "Reading list",     "What I'm reading this month",   "#D4AF37", linkCount = 9),
        Collection("c-2", me.id, "Design crit",      "Posts that made me think",      "#B76E79", linkCount = 6),
        Collection("c-3", me.id, "Tools",            "Stuff I use every day",         "#4A90E2", linkCount = 12),
        Collection("c-4", me.id, "Writing",          "My published essays",           "#9C8970", linkCount = 4),
    )

    val myLinks = listOf(
        Link("l-1", me.id, "Ktheme — design system", "https://ktheme.dev",          "An open-source theme engine.", pinned = true,  collectionId = "c-3", clicks = 1402),
        Link("l-2", me.id, "On metallic gradients",  "https://dani.ink/metallic",    "Why we kept five stops.",     collectionId = "c-4", clicks = 612),
        Link("l-3", me.id, "Frutiger Aero, revisited", "https://dani.ink/aero",     "A love letter to gloss.",     collectionId = "c-2", clicks = 304),
        Link("l-4", me.id, "Reading list — May",     "https://dani.ink/reading-may", "",                            collectionId = "c-1", clicks = 71),
        Link("l-5", me.id, "Bluesky",                "https://bsky.app/profile/dani","",                            collectionId = "c-3", clicks = 5_004),
        Link("l-6", me.id, "GitHub",                 "https://github.com/dani",      "",                            collectionId = "c-3", clicks = 2_115),
        Link("l-7", me.id, "Are.na",                 "https://are.na/dani",          "",                            collectionId = "c-1", clicks = 290),
        Link("l-8", me.id, "Portfolio",              "https://dani.ink",             "",                            collectionId = null,   clicks = 9_402, pinned = true),
        Link("l-9", me.id, "Newsletter",             "https://dani.ink/letter",      "Once a fortnight.",           collectionId = null,   clicks = 1_011),
    )

    val feed: List<Post> = listOf(
        Post("p-1", "u-1", Link("fl-1", "u-1", "The poetry of input fields", "https://arden.studio/inputs", "When the field talks back."), note = "this rules", likes = 84, reshares = 12, likedByMe = true),
        Post("p-2", "u-4", Link("fl-2", "u-4", "git aliases I won't shut up about", "https://hex.dev/git-aliases", ""), likes = 412, reshares = 78),
        Post("p-3", "u-3", Link("fl-3", "u-3", "Calm UI for ICU dashboards", "https://nina.health/calm-ui", "Studied for 18 months. Patterns inside."), note = "case study finally up", likes = 209, reshares = 41),
        Post("p-4", "u-5", Link("fl-4", "u-5", "Ballet of the Bauhaus, restaged", "https://solene.fr/bauhaus", ""), likes = 51, reshares = 4),
        Post("p-5", "u-2", Link("fl-5", "u-2", "noir/neon palette generator", "https://kestrel.computer/noir", "single-page, web component, MIT"), likes = 188, reshares = 33, likedByMe = true),
        Post("p-6", "u-6", Link("fl-6", "u-6", "soft botanical home page archive", "https://mira.garden/archive", ""), likes = 122, reshares = 27),
    )

    val notifications = listOf(
        Notification("n-1", Notification.Kind.Like,    "@arden",   "your link \"Frutiger Aero, revisited\""),
        Notification("n-2", Notification.Kind.Follow,  "@hex",     ""),
        Notification("n-3", Notification.Kind.Reshare, "@nina",    "your link \"On metallic gradients\""),
        Notification("n-4", Notification.Kind.Mention, "@solene",  "in \"Ballet of the Bauhaus, restaged\""),
        Notification("n-5", Notification.Kind.ProfileVisit, "@kestrel", "viewed your profile"),
    )

    val conversations: List<Conversation> = users.drop(1).take(4).map {
        Conversation("c-${it.id}", it, "thanks for the follow!", unread = if (it.id == "u-1") 2 else 0)
    }

    val messages: Map<String, List<Message>> = mapOf(
        "c-u-1" to listOf(
            Message("m-1", "c-u-1", false, "hey saw your metallic post — beautiful", 0L),
            Message("m-2", "c-u-1", true,  "thanks!! took forever to land the angles", 0L),
            Message("m-3", "c-u-1", false, "totally worth it. mind if I link it?", 0L),
        )
    )

    val analytics = AnalyticsSummary(
        views7d = 4_812,
        clicks7d = 1_207,
        ctr = 0.251f,
        topLinks = listOf(
            "Portfolio" to 412,
            "Bluesky" to 308,
            "Ktheme — design system" to 211,
            "GitHub" to 144,
            "Newsletter" to 132,
        ),
        daily = listOf(
            LinkStat("Mon", 90), LinkStat("Tue", 112), LinkStat("Wed", 188),
            LinkStat("Thu", 154), LinkStat("Fri", 220), LinkStat("Sat", 260),
            LinkStat("Sun", 183),
        ),
    )

    val trendingTags = listOf("#metallic", "#solarpunk", "#smallweb", "#aero", "#noir", "#typography", "#tools")
}
