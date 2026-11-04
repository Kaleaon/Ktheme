package com.ktheme.ui

import java.awt.image.BufferedImage
import java.io.File
import javax.imageio.ImageIO
import javax.swing.JList
import javax.swing.JPanel
import javax.swing.SwingUtilities
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ThemeLibraryWindowTest {

    @Test
    fun `ThemeLibraryWindow displays all 24 canonical themes when launched`() {
        if (java.awt.GraphicsEnvironment.isHeadless()) {
            return
        }
        var window: ThemeLibraryWindow? = null
        SwingUtilities.invokeAndWait {
            window = ThemeLibraryWindow()
        }

        val frame = window!!
        try {
            SwingUtilities.invokeAndWait {
                frame.pack()
                frame.setSize(1000, 700)
            }

            // Find JList<Theme> in the component tree
            val themeLists = mutableListOf<JList<*>>()
            fun findLists(comp: java.awt.Component) {
                if (comp is JList<*>) {
                    themeLists.add(comp)
                }
                if (comp is java.awt.Container) {
                    for (child in comp.components) {
                        findLists(child)
                    }
                }
            }
            findLists(frame)

            assertTrue(themeLists.isNotEmpty(), "Expected to find theme JList in ThemeLibraryWindow")
            val list = themeLists.first()
            assertEquals(24, list.model.size, "Expected 24 canonical themes in the scroll wheel list")

            // Render window to image for visual verification and PR artifact
            val image = BufferedImage(1000, 700, BufferedImage.TYPE_INT_ARGB)
            val graphics = image.createGraphics()
            SwingUtilities.invokeAndWait {
                frame.paint(graphics)
            }
            graphics.dispose()

            val screenshotFile = File("/tmp/theme-library-window.png")
            ImageIO.write(image, "png", screenshotFile)
            assertTrue(screenshotFile.exists() && screenshotFile.length() > 0, "Expected screenshot to be generated")
        } finally {
            SwingUtilities.invokeAndWait {
                frame.dispose()
            }
        }
    }
}
