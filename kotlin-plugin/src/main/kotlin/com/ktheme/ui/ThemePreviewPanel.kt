package com.ktheme.ui

import com.ktheme.models.Theme
import com.ktheme.utils.ColorUtils
import java.awt.*
import javax.swing.*
import javax.swing.border.EmptyBorder

/**
 * Theme Preview Panel - Shows detailed preview of a selected theme
 */
class ThemePreviewPanel : JPanel() {
    private val titleLabel: JLabel
    private val descriptionLabel: JLabel
    private val authorLabel: JLabel
    private val tagsLabel: JLabel
    private val colorPalettePanel: JPanel
    private val previewPanel: JPanel
    
    init {
        layout = BorderLayout(10, 10)
        border = EmptyBorder(15, 15, 15, 15)
        background = Color.WHITE
        
        // Header section
        val headerPanel = JPanel().apply {
            layout = BoxLayout(this, BoxLayout.Y_AXIS)
            isOpaque = false
            
            titleLabel = JLabel("Select a theme").apply {
                font = Font(Font.SANS_SERIF, Font.BOLD, 24)
                alignmentX = Component.LEFT_ALIGNMENT
            }
            add(titleLabel)
            
            add(Box.createVerticalStrut(5))
            
            descriptionLabel = JLabel().apply {
                font = Font(Font.SANS_SERIF, Font.PLAIN, 14)
                foreground = Color.DARK_GRAY
                alignmentX = Component.LEFT_ALIGNMENT
            }
            add(descriptionLabel)
            
            add(Box.createVerticalStrut(5))
            
            authorLabel = JLabel().apply {
                font = Font(Font.SANS_SERIF, Font.ITALIC, 12)
                foreground = Color.GRAY
                alignmentX = Component.LEFT_ALIGNMENT
            }
            add(authorLabel)
            
            add(Box.createVerticalStrut(5))
            
            tagsLabel = JLabel().apply {
                font = Font(Font.SANS_SERIF, Font.PLAIN, 11)
                foreground = Color.GRAY
                alignmentX = Component.LEFT_ALIGNMENT
            }
            add(tagsLabel)
        }
        
        add(headerPanel, BorderLayout.NORTH)
        
        // Color palette section
        colorPalettePanel = JPanel().apply {
            layout = GridLayout(0, 4, 10, 10)
            border = BorderFactory.createTitledBorder("Color Palette")
            background = Color.WHITE
        }
        add(colorPalettePanel, BorderLayout.CENTER)
        
        // Visual preview section
        previewPanel = JPanel().apply {
            layout = BorderLayout()
            border = BorderFactory.createTitledBorder("Theme Preview")
            background = Color.WHITE
            preferredSize = Dimension(0, 200)
        }
        add(previewPanel, BorderLayout.SOUTH)
    }
    
    /**
     * Update preview with a theme
     */
    fun showTheme(theme: Theme?) {
        if (theme == null) {
            clearPreview()
            return
        }
        
        // Update header
        titleLabel.text = theme.metadata.name
        descriptionLabel.text = "<html>${theme.metadata.description}</html>"
        authorLabel.text = "by ${theme.metadata.author}"
        tagsLabel.text = "Tags: ${theme.metadata.tags.joinToString(", ")}"
        
        // Update color palette
        updateColorPalette(theme)
        
        // Update visual preview
        updateVisualPreview(theme)
    }
    
    private fun clearPreview() {
        titleLabel.text = "Select a theme"
        descriptionLabel.text = ""
        authorLabel.text = ""
        tagsLabel.text = ""
        colorPalettePanel.removeAll()
        previewPanel.removeAll()
        revalidate()
        repaint()
    }
    
    private fun updateColorPalette(theme: Theme) {
        colorPalettePanel.removeAll()
        
        val colors = mapOf(
            "Primary" to theme.colorScheme.primary,
            "Secondary" to theme.colorScheme.secondary,
            "Background" to theme.colorScheme.background,
            "Surface" to theme.colorScheme.surface,
            "On Primary" to theme.colorScheme.onPrimary,
            "On Secondary" to theme.colorScheme.onSecondary,
            "On Background" to theme.colorScheme.onBackground,
            "On Surface" to theme.colorScheme.onSurface
        )
        
        colors.forEach { (name, colorHex) ->
            colorPalettePanel.add(createColorSwatch(name, colorHex))
        }
        
        colorPalettePanel.revalidate()
        colorPalettePanel.repaint()
    }
    
    private fun createColorSwatch(name: String, colorHex: String): JPanel {
        return JPanel().apply {
            layout = BorderLayout(5, 5)
            border = BorderFactory.createLineBorder(Color.LIGHT_GRAY, 1)
            background = Color.WHITE
            
            // Color box
            val colorBox = object : JPanel() {
                init {
                    preferredSize = Dimension(0, 40)
                    try {
                        background = Color(ColorUtils.hexToColorInt(colorHex))
                    } catch (e: Exception) {
                        background = Color.GRAY
                    }
                }
            }
            add(colorBox, BorderLayout.CENTER)
            
            // Label
            val label = JLabel("<html><center>$name<br><small>$colorHex</small></center></html>").apply {
                font = Font(Font.SANS_SERIF, Font.PLAIN, 10)
                horizontalAlignment = SwingConstants.CENTER
            }
            add(label, BorderLayout.SOUTH)
        }
    }
    
    private fun updateVisualPreview(theme: Theme) {
        previewPanel.removeAll()
        
        val preview = object : JPanel() {
            init {
                layout = BorderLayout(10, 10)
                border = EmptyBorder(10, 10, 10, 10)
                
                try {
                    background = Color(ColorUtils.hexToColorInt(theme.colorScheme.background))
                    
                    // Sample UI elements
                    val contentPanel = JPanel().apply {
                        layout = BoxLayout(this, BoxLayout.Y_AXIS)
                        isOpaque = false
                        
                        // Sample button
                        add(JButton("Sample Button").apply {
                            background = Color(ColorUtils.hexToColorInt(theme.colorScheme.primary))
                            foreground = Color(ColorUtils.hexToColorInt(theme.colorScheme.onPrimary))
                            isFocusPainted = false
                            alignmentX = Component.LEFT_ALIGNMENT
                        })
                        
                        add(Box.createVerticalStrut(10))
                        
                        // Sample text
                        add(JLabel("Sample text in this theme").apply {
                            foreground = Color(ColorUtils.hexToColorInt(theme.colorScheme.onBackground))
                            alignmentX = Component.LEFT_ALIGNMENT
                        })
                        
                        add(Box.createVerticalStrut(10))
                        
                        // Sample panel
                        add(JPanel().apply {
                            layout = FlowLayout(FlowLayout.LEFT)
                            background = Color(ColorUtils.hexToColorInt(theme.colorScheme.surface))
                            border = EmptyBorder(10, 10, 10, 10)
                            
                            add(JLabel("Surface element").apply {
                                foreground = Color(ColorUtils.hexToColorInt(theme.colorScheme.onSurface))
                            })
                            
                            alignmentX = Component.LEFT_ALIGNMENT
                        })
                    }
                    
                    add(contentPanel, BorderLayout.CENTER)
                    
                } catch (e: Exception) {
                    add(JLabel("Preview not available"), BorderLayout.CENTER)
                }
            }
        }
        
        previewPanel.add(preview, BorderLayout.CENTER)
        previewPanel.revalidate()
        previewPanel.repaint()
    }
}
