package com.ktheme.ui

import com.ktheme.models.Theme
import com.ktheme.utils.ColorUtils
import java.awt.*
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent
import javax.swing.*
import javax.swing.border.EmptyBorder

/**
 * Theme Scroll Wheel - A scrollable list for theme selection with visual preview
 */
class ThemeScrollWheel(private val themes: List<Theme>) : JPanel() {
    private val themeList: JList<Theme>
    private val listeners = mutableListOf<(Theme) -> Unit>()
    
    init {
        layout = BorderLayout()
        
        // Create list model
        val listModel = DefaultListModel<Theme>()
        themes.forEach { listModel.addElement(it) }
        
        // Create JList with custom renderer
        themeList = JList(listModel).apply {
            cellRenderer = ThemeCellRenderer()
            selectionMode = ListSelectionModel.SINGLE_SELECTION
            visibleRowCount = 5
            fixedCellHeight = 80
            background = Color(250, 250, 250)
            
            // Add selection listener
            addListSelectionListener { event ->
                if (!event.valueIsAdjusting && selectedValue != null) {
                    notifyThemeSelected(selectedValue)
                }
            }
            
            // Add mouse listener for hover effect
            addMouseMotionListener(object : MouseAdapter() {
                override fun mouseMoved(e: MouseEvent) {
                    val index = locationToIndex(e.point)
                    if (index >= 0) {
                        selectedIndex = index
                    }
                }
            })
        }
        
        // Add to scroll pane
        val scrollPane = JScrollPane(themeList).apply {
            verticalScrollBarPolicy = JScrollPane.VERTICAL_SCROLLBAR_ALWAYS
            border = BorderFactory.createLineBorder(Color.LIGHT_GRAY, 1)
        }
        
        add(scrollPane, BorderLayout.CENTER)
    }
    
    /**
     * Get currently selected theme
     */
    fun getSelectedTheme(): Theme? = themeList.selectedValue
    
    /**
     * Set selected theme by ID
     */
    fun selectTheme(themeId: String) {
        val index = themes.indexOfFirst { it.metadata.id == themeId }
        if (index >= 0) {
            themeList.selectedIndex = index
            themeList.ensureIndexIsVisible(index)
        }
    }
    
    /**
     * Add selection listener
     */
    fun addSelectionListener(listener: (Theme) -> Unit) {
        listeners.add(listener)
    }
    
    private fun notifyThemeSelected(theme: Theme) {
        listeners.forEach { it(theme) }
    }
    
    /**
     * Custom cell renderer for theme items
     */
    private class ThemeCellRenderer : ListCellRenderer<Theme> {
        override fun getListCellRendererComponent(
            list: JList<out Theme>,
            theme: Theme,
            index: Int,
            isSelected: Boolean,
            cellHasFocus: Boolean
        ): Component {
            return ThemeCell(theme, isSelected)
        }
    }
    
    /**
     * Visual representation of a theme in the list
     */
    private class ThemeCell(private val theme: Theme, isSelected: Boolean) : JPanel() {
        init {
            layout = BorderLayout(10, 5)
            border = EmptyBorder(5, 10, 5, 10)
            
            // Background color based on selection
            background = if (isSelected) {
                Color(230, 240, 255)
            } else {
                Color(255, 255, 255)
            }
            
            // Left side: Color preview
            val colorPanel = createColorPreview()
            add(colorPanel, BorderLayout.WEST)
            
            // Center: Theme info
            val infoPanel = createInfoPanel()
            add(infoPanel, BorderLayout.CENTER)
            
            // Right side: Mode indicator
            val modeLabel = JLabel(if (theme.darkMode) "🌙" else "☀️").apply {
                font = Font(Font.SANS_SERIF, Font.PLAIN, 24)
            }
            add(modeLabel, BorderLayout.EAST)
        }
        
        private fun createColorPreview(): JPanel {
            return object : JPanel() {
                init {
                    preferredSize = Dimension(60, 60)
                    border = BorderFactory.createLineBorder(Color.GRAY, 1)
                }
                
                override fun paintComponent(g: Graphics) {
                    super.paintComponent(g)
                    val g2d = g as Graphics2D
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
                    
                    // Draw color swatches
                    val colors = listOf(
                        theme.colorScheme.primary,
                        theme.colorScheme.secondary,
                        theme.colorScheme.background,
                        theme.colorScheme.surface
                    )
                    
                    val swatchWidth = width / 2
                    val swatchHeight = height / 2
                    
                    colors.forEachIndexed { index, colorHex ->
                        try {
                            val color = Color(ColorUtils.hexToColorInt(colorHex))
                            g2d.color = color
                            val x = (index % 2) * swatchWidth
                            val y = (index / 2) * swatchHeight
                            g2d.fillRect(x, y, swatchWidth, swatchHeight)
                        } catch (e: Exception) {
                            // Skip invalid colors
                        }
                    }
                }
            }
        }
        
        private fun createInfoPanel(): JPanel {
            return JPanel().apply {
                layout = BoxLayout(this, BoxLayout.Y_AXIS)
                isOpaque = false
                
                // Theme name
                add(JLabel(theme.metadata.name).apply {
                    font = Font(Font.SANS_SERIF, Font.BOLD, 14)
                    alignmentX = Component.LEFT_ALIGNMENT
                })
                
                // Description
                add(Box.createVerticalStrut(3))
                add(JLabel("<html>${truncate(theme.metadata.description, 50)}</html>").apply {
                    font = Font(Font.SANS_SERIF, Font.PLAIN, 11)
                    foreground = Color.DARK_GRAY
                    alignmentX = Component.LEFT_ALIGNMENT
                })
                
                // Tags
                if (theme.metadata.tags.isNotEmpty()) {
                    add(Box.createVerticalStrut(3))
                    val tagsText = theme.metadata.tags.take(3).joinToString(", ")
                    add(JLabel("🏷️ $tagsText").apply {
                        font = Font(Font.SANS_SERIF, Font.PLAIN, 10)
                        foreground = Color.GRAY
                        alignmentX = Component.LEFT_ALIGNMENT
                    })
                }
            }
        }
        
        private fun truncate(text: String, maxLength: Int): String {
            return if (text.length > maxLength) {
                text.substring(0, maxLength) + "..."
            } else {
                text
            }
        }
    }
}
