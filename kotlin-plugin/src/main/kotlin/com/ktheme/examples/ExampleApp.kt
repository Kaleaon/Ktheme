package com.ktheme.examples

import com.ktheme.library.KthemeAPI
import com.ktheme.library.ThemeChangeListener
import com.ktheme.models.Theme
import com.ktheme.utils.ColorUtils
import java.awt.*
import javax.swing.*

/**
 * Example application showing how to integrate with Ktheme Library
 * 
 * This demonstrates:
 * - Accessing shared themes
 * - Applying themes to your app
 * - Subscribing to theme changes
 */
class ExampleApp : JFrame() {
    private var currentTheme: Theme? = null
    private val contentPanel: JPanel
    private val themeLabel: JLabel
    
    init {
        title = "Example App - Ktheme Integration"
        defaultCloseOperation = EXIT_ON_CLOSE
        size = Dimension(600, 400)
        setLocationRelativeTo(null)
        
        // Main content
        contentPanel = JPanel().apply {
            layout = BorderLayout(20, 20)
            border = BorderFactory.createEmptyBorder(20, 20, 20, 20)
        }
        
        // Header
        val header = JLabel("Example Application").apply {
            font = Font(Font.SANS_SERIF, Font.BOLD, 24)
            horizontalAlignment = SwingConstants.CENTER
        }
        contentPanel.add(header, BorderLayout.NORTH)
        
        // Theme info
        themeLabel = JLabel("No theme applied").apply {
            horizontalAlignment = SwingConstants.CENTER
        }
        contentPanel.add(themeLabel, BorderLayout.CENTER)
        
        // Buttons
        val buttonPanel = JPanel(FlowLayout()).apply {
            add(JButton("Browse Themes").apply {
                addActionListener { browseThemes() }
            })
            add(JButton("Apply Random Theme").apply {
                addActionListener { applyRandomTheme() }
            })
        }
        contentPanel.add(buttonPanel, BorderLayout.SOUTH)
        
        contentPane.add(contentPanel)
        
        // Subscribe to theme changes
        KthemeAPI.onThemeChanged(object : ThemeChangeListener {
            override fun onThemeAdded(theme: Theme) {
                println("New theme available: ${theme.metadata.name}")
            }
            
            override fun onThemeRemoved(themeId: String) {
                println("Theme removed: $themeId")
            }
            
            override fun onThemeUpdated(theme: Theme) {
                println("Theme updated: ${theme.metadata.name}")
            }
        })
    }
    
    private fun browseThemes() {
        val themes = KthemeAPI.getAvailableThemes()
        
        if (themes.isEmpty()) {
            JOptionPane.showMessageDialog(
                this,
                "No shared themes available.\nRun the Ktheme Library app and share some themes first!",
                "No Themes",
                JOptionPane.INFORMATION_MESSAGE
            )
            return
        }
        
        val themeNames = themes.map { it.metadata.name }.toTypedArray()
        val selected = JOptionPane.showInputDialog(
            this,
            "Select a theme:",
            "Available Themes",
            JOptionPane.QUESTION_MESSAGE,
            null,
            themeNames,
            themeNames[0]
        ) as? String
        
        selected?.let {
            val theme = themes.find { t -> t.metadata.name == it }
            theme?.let { applyTheme(it) }
        }
    }
    
    private fun applyRandomTheme() {
        val themes = KthemeAPI.getAvailableThemes()
        if (themes.isNotEmpty()) {
            applyTheme(themes.random())
        } else {
            JOptionPane.showMessageDialog(
                this,
                "No themes available. Share themes from Ktheme Library first!",
                "No Themes",
                JOptionPane.WARNING_MESSAGE
            )
        }
    }
    
    private fun applyTheme(theme: Theme) {
        currentTheme = theme
        
        try {
            // Apply colors to the app
            val bgColor = Color(ColorUtils.hexToColorInt(theme.colorScheme.background))
            val fgColor = Color(ColorUtils.hexToColorInt(theme.colorScheme.onBackground))
            val primaryColor = Color(ColorUtils.hexToColorInt(theme.colorScheme.primary))
            
            contentPanel.background = bgColor
            themeLabel.foreground = fgColor
            themeLabel.text = """
                <html>
                <center>
                <h2>Theme Applied: ${theme.metadata.name}</h2>
                <p>${theme.metadata.description}</p>
                <p><i>by ${theme.metadata.author}</i></p>
                </center>
                </html>
            """.trimIndent()
            
            // Update all components
            updateComponentColors(contentPanel, bgColor, fgColor, primaryColor)
            
        } catch (e: Exception) {
            println("Error applying theme: ${e.message}")
        }
    }
    
    private fun updateComponentColors(container: Container, bg: Color, fg: Color, primary: Color) {
        container.background = bg
        container.foreground = fg
        
        for (component in container.components) {
            when (component) {
                is JButton -> {
                    component.background = primary
                    component.foreground = fg
                }
                is JLabel -> {
                    component.foreground = fg
                }
                is Container -> {
                    updateComponentColors(component, bg, fg, primary)
                }
            }
        }
        
        container.repaint()
    }
}

/**
 * Main entry point for example app
 */
fun main() {
    println("""
        ╔════════════════════════════════════════════════════════════╗
        ║           Example App - Ktheme Integration Demo            ║
        ╚════════════════════════════════════════════════════════════╝
        
        This app demonstrates how to integrate with Ktheme Library:
        
        1. Run the Ktheme Library app first
        2. Share some themes from the library
        3. Use this app to browse and apply shared themes
        
        Shared themes directory: ${KthemeAPI.getSharedDirectory()}
        
    """.trimIndent())
    
    SwingUtilities.invokeLater {
        ExampleApp().isVisible = true
    }
}
