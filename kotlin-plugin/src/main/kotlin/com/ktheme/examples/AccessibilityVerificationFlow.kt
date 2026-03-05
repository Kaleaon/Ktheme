package com.ktheme.examples

import com.ktheme.ui.ThemeLibraryWindow
import javax.swing.SwingUtilities

/**
 * Sample verification flow for accessibility in ThemeLibraryWindow.
 *
 * Run this class and use TalkBack/screen-reader output while stepping through the checklist.
 */
object AccessibilityVerificationFlow {
    private val checklist = listOf(
        "Tab order should follow visual order: Search field -> Search button -> Theme list -> Apply -> Share -> Export -> Import.",
        "Moving the theme selection with arrow keys should announce the selected theme and mode.",
        "Applying, sharing, importing, or exporting themes should update status announcements.",
        "Preview changes should announce the active theme name and author.",
        "Interactive controls should expose explicit accessible names and role hints."
    )

    @JvmStatic
    fun main(args: Array<String>) {
        println("=== Ktheme Accessibility Verification Flow ===")
        checklist.forEachIndexed { index, item ->
            println("${index + 1}. $item")
        }

        SwingUtilities.invokeLater {
            ThemeLibraryWindow().apply {
                isVisible = true
                toFront()
                requestFocus()
            }
        }
    }
}
