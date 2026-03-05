package com.ktheme.ui

import com.ktheme.library.ThemeLibrary
import com.ktheme.models.Theme
import com.ktheme.utils.AccessibilityUtils
import java.awt.*
import java.io.File
import javax.swing.*
import javax.swing.border.EmptyBorder
import javax.swing.filechooser.FileNameExtensionFilter

/**
 * Main Theme Library Window - Standalone application for browsing and managing themes
 */
class ThemeLibraryWindow : JFrame() {
    private val library = ThemeLibrary()
    private lateinit var scrollWheel: ThemeScrollWheel
    private lateinit var previewPanel: ThemePreviewPanel
    private lateinit var searchField: JTextField
    private lateinit var searchButton: JButton
    private lateinit var applyButton: JButton
    private lateinit var shareButton: JButton
    private lateinit var exportButton: JButton
    private lateinit var importButton: JButton
    private lateinit var statusLabel: JLabel
    private var currentTheme: Theme? = null

    init {
        title = "Ktheme Library - Theme Manager"
        defaultCloseOperation = EXIT_ON_CLOSE

        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName())
        } catch (e: Exception) {
            // Use default look and feel
        }

        setupUI()
        setupMenuBar()
        loadThemes()

        size = Dimension(1000, 700)
        setLocationRelativeTo(null)
        minimumSize = Dimension(800, 600)
    }

    private fun setupUI() {
        layout = BorderLayout(10, 10)

        val mainPanel = JPanel(BorderLayout(10, 10)).apply {
            border = EmptyBorder(10, 10, 10, 10)
        }

        val leftPanel = JPanel(BorderLayout()).apply {
            preferredSize = Dimension(350, 0)
            border = BorderFactory.createTitledBorder("Available Themes")
        }

        scrollWheel = ThemeScrollWheel(emptyList())
        leftPanel.add(scrollWheel, BorderLayout.CENTER)

        val searchPanel = createSearchPanel()
        leftPanel.add(searchPanel, BorderLayout.NORTH)

        mainPanel.add(leftPanel, BorderLayout.WEST)

        val rightPanel = JPanel(BorderLayout()).apply {
            border = BorderFactory.createTitledBorder("Theme Preview")
        }

        previewPanel = ThemePreviewPanel()
        rightPanel.add(previewPanel, BorderLayout.CENTER)

        val buttonPanel = createButtonPanel()
        rightPanel.add(buttonPanel, BorderLayout.SOUTH)

        mainPanel.add(rightPanel, BorderLayout.CENTER)

        val statusBar = createStatusBar()
        mainPanel.add(statusBar, BorderLayout.SOUTH)

        contentPane.add(mainPanel)
        configureWindowAccessibility(mainPanel)
    }

    private fun configureWindowAccessibility(mainPanel: JPanel) {
        AccessibilityUtils.configureControl(
            searchField,
            "Search themes",
            "text field",
            "Enter a theme name or tag and press Search to filter results.",
            "Type query then press Enter or Search"
        )
        AccessibilityUtils.configureControl(
            searchButton,
            "Search",
            "button",
            "Search themes using the entered query.",
            "Enter or Space activates"
        )
        AccessibilityUtils.configureControl(
            applyButton,
            "Apply Theme",
            "button",
            "Apply the selected theme to the demo preview.",
            "Enter or Space activates"
        )
        AccessibilityUtils.configureControl(
            shareButton,
            "Share Theme",
            "button",
            "Copy the selected theme into the shared Ktheme directory."
        )
        AccessibilityUtils.configureControl(
            exportButton,
            "Export Theme",
            "button",
            "Export the selected theme to a JSON file."
        )
        AccessibilityUtils.configureControl(
            importButton,
            "Import Theme",
            "button",
            "Import a theme from a JSON file."
        )
        AccessibilityUtils.configureControl(
            statusLabel,
            "Theme status",
            "status",
            "Announces results for selection changes and theme actions."
        )

        val focusOrder = listOf(
            searchField,
            searchButton,
            scrollWheel.getThemeListComponent(),
            applyButton,
            shareButton,
            exportButton,
            importButton
        )
        AccessibilityUtils.applyDeterministicFocusOrder(mainPanel, focusOrder)
    }

    private fun announceStatus(message: String) {
        statusLabel.text = " $message"
        AccessibilityUtils.announceState(statusLabel, message)
    }

    private fun createSearchPanel(): JPanel {
        return JPanel(BorderLayout(5, 5)).apply {
            border = EmptyBorder(5, 5, 10, 5)

            searchField = JTextField().apply {
                toolTipText = "Search themes by name or tags"
                addActionListener {
                    val query = text.trim()
                    if (query.isNotEmpty()) {
                        searchThemes(query)
                    }
                }
            }

            searchButton = JButton("🔍").apply {
                addActionListener {
                    val query = searchField.text.trim()
                    if (query.isNotEmpty()) {
                        searchThemes(query)
                    }
                }
            }

            add(searchField, BorderLayout.CENTER)
            add(searchButton, BorderLayout.EAST)
        }
    }

    private fun createButtonPanel(): JPanel {
        return JPanel(FlowLayout(FlowLayout.RIGHT, 10, 10)).apply {
            applyButton = JButton("Apply Theme").apply {
                addActionListener { applyTheme() }
                toolTipText = "Apply selected theme to this application"
            }
            add(applyButton)

            shareButton = JButton("Share Theme").apply {
                addActionListener { shareTheme() }
                toolTipText = "Share theme with other applications"
            }
            add(shareButton)

            exportButton = JButton("Export Theme").apply {
                addActionListener { exportTheme() }
                toolTipText = "Export theme to file"
            }
            add(exportButton)

            importButton = JButton("Import Theme").apply {
                addActionListener { importTheme() }
                toolTipText = "Import theme from file"
            }
            add(importButton)
        }
    }

    private fun createStatusBar(): JPanel {
        return JPanel(BorderLayout()).apply {
            border = BorderFactory.createEtchedBorder()
            preferredSize = Dimension(0, 25)

            statusLabel = JLabel(" Ready").apply {
                font = Font(Font.SANS_SERIF, Font.PLAIN, 11)
            }
            add(statusLabel, BorderLayout.WEST)
        }
    }

    private fun setupMenuBar() {
        val menuBar = JMenuBar()

        val fileMenu = JMenu("File").apply {
            add(JMenuItem("Import Theme...").apply { addActionListener { importTheme() } })
            add(JMenuItem("Export Theme...").apply { addActionListener { exportTheme() } })
            addSeparator()
            add(JMenuItem("Reload Themes").apply { addActionListener { loadThemes() } })
            addSeparator()
            add(JMenuItem("Exit").apply { addActionListener { dispose() } })
        }
        menuBar.add(fileMenu)

        val viewMenu = JMenu("View").apply {
            add(JMenuItem("Show All Themes").apply { addActionListener { showAllThemes() } })
            add(JMenuItem("Show Dark Themes").apply { addActionListener { filterThemes { it.darkMode } } })
            add(JMenuItem("Show Light Themes").apply { addActionListener { filterThemes { !it.darkMode } } })
        }
        menuBar.add(viewMenu)

        val helpMenu = JMenu("Help").apply {
            add(JMenuItem("About").apply { addActionListener { showAbout() } })
            add(JMenuItem("Theme Directory").apply { addActionListener { showThemeDirectories() } })
        }
        menuBar.add(helpMenu)

        jMenuBar = menuBar
    }

    private fun loadThemes() {
        val bundledDir = File("../themes/examples").takeIf { it.exists() }
            ?: File("themes/examples").takeIf { it.exists() }

        library.loadAllThemes(bundledDir)
        val themes = library.getAllThemes()

        contentPane.removeAll()
        setupUI()

        scrollWheel = ThemeScrollWheel(themes).apply {
            addSelectionListener { theme ->
                currentTheme = theme
                previewPanel.showTheme(theme)
                announceStatus("Selected ${theme.metadata.name} (${if (theme.darkMode) "dark" else "light"})")
            }
        }

        val leftPanel = ((contentPane.components[0] as JPanel).components[0] as JPanel)
        leftPanel.remove(0)
        leftPanel.add(scrollWheel, BorderLayout.CENTER)

        configureWindowAccessibility(contentPane.components[0] as JPanel)
        announceStatus("Loaded ${themes.size} themes")
        revalidate()
        repaint()

        println("Loaded ${themes.size} themes")
    }

    private fun searchThemes(query: String) {
        val results = library.searchThemes(query)
        announceStatus("Search for '$query' returned ${results.size} themes")
        JOptionPane.showMessageDialog(
            this,
            "Found ${results.size} themes matching '$query'",
            "Search Results",
            JOptionPane.INFORMATION_MESSAGE
        )
    }

    private fun filterThemes(predicate: (Theme) -> Boolean) {
        val filtered = library.getAllThemes().filter(predicate)
        announceStatus("Filter applied. ${filtered.size} themes shown")
        JOptionPane.showMessageDialog(
            this,
            "Showing ${filtered.size} filtered themes",
            "Filter Applied",
            JOptionPane.INFORMATION_MESSAGE
        )
    }

    private fun showAllThemes() {
        loadThemes()
    }

    private fun applyTheme() {
        currentTheme?.let { theme ->
            announceStatus("Applied ${theme.metadata.name} to preview")
            JOptionPane.showMessageDialog(
                this,
                "Theme '${theme.metadata.name}' applied to preview!\nIn a real app, this would apply the theme to all UI components.",
                "Theme Applied",
                JOptionPane.INFORMATION_MESSAGE
            )
        } ?: run {
            announceStatus("No theme selected. Please select a theme first")
            JOptionPane.showMessageDialog(
                this,
                "Please select a theme first",
                "No Theme Selected",
                JOptionPane.WARNING_MESSAGE
            )
        }
    }

    private fun shareTheme() {
        currentTheme?.let { theme ->
            if (library.shareTheme(theme.metadata.id)) {
                announceStatus("Shared ${theme.metadata.name}")
                JOptionPane.showMessageDialog(
                    this,
                    "Theme '${theme.metadata.name}' shared successfully!\nOther applications can now access it from:\n${library.getSharedThemesDirectory().absolutePath}",
                    "Theme Shared",
                    JOptionPane.INFORMATION_MESSAGE
                )
            } else {
                announceStatus("Failed to share ${theme.metadata.name}")
                JOptionPane.showMessageDialog(
                    this,
                    "Failed to share theme",
                    "Error",
                    JOptionPane.ERROR_MESSAGE
                )
            }
        }
    }

    private fun exportTheme() {
        currentTheme?.let { theme ->
            val fileChooser = JFileChooser().apply {
                dialogTitle = "Export Theme"
                fileFilter = FileNameExtensionFilter("JSON Files (*.json)", "json")
                selectedFile = File("${theme.metadata.id}.json")
            }

            if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
                val file = fileChooser.selectedFile.let {
                    if (!it.name.endsWith(".json")) File(it.parentFile, "${it.name}.json") else it
                }

                if (library.exportTheme(theme.metadata.id, file)) {
                    announceStatus("Exported ${theme.metadata.name} to ${file.name}")
                    JOptionPane.showMessageDialog(
                        this,
                        "Theme exported to:\n${file.absolutePath}",
                        "Export Successful",
                        JOptionPane.INFORMATION_MESSAGE
                    )
                }
            }
        }
    }

    private fun importTheme() {
        val fileChooser = JFileChooser().apply {
            dialogTitle = "Import Theme"
            fileFilter = FileNameExtensionFilter("JSON Files (*.json)", "json")
        }

        if (fileChooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
            val theme = library.importTheme(fileChooser.selectedFile)
            if (theme != null) {
                announceStatus("Imported ${theme.metadata.name}")
                JOptionPane.showMessageDialog(
                    this,
                    "Theme '${theme.metadata.name}' imported successfully!",
                    "Import Successful",
                    JOptionPane.INFORMATION_MESSAGE
                )
                loadThemes()
            } else {
                announceStatus("Failed to import theme")
                JOptionPane.showMessageDialog(
                    this,
                    "Failed to import theme",
                    "Import Failed",
                    JOptionPane.ERROR_MESSAGE
                )
            }
        }
    }

    private fun showAbout() {
        JOptionPane.showMessageDialog(
            this,
            """
                Ktheme Library - Theme Manager
                Version 1.0.0

                A powerful theme management system for cross-application theming.

                • Browse and preview themes
                • Share themes across applications
                • Import and export themes
                • 14 beautiful preset themes included

                Created with ❤️ by the Ktheme team
            """.trimIndent(),
            "About Ktheme Library",
            JOptionPane.INFORMATION_MESSAGE
        )
    }

    private fun showThemeDirectories() {
        JOptionPane.showMessageDialog(
            this,
            """
                Theme Directories:

                Shared Themes (cross-app):
                ${library.getSharedThemesDirectory().absolutePath}

                User Themes:
                ${library.getUserThemesDirectory().absolutePath}

                You can place theme JSON files in these directories
                and they will be automatically loaded.
            """.trimIndent(),
            "Theme Directories",
            JOptionPane.INFORMATION_MESSAGE
        )
    }
}

/**
 * Main entry point for the Theme Library application
 */
fun main() {
    SwingUtilities.invokeLater {
        ThemeLibraryWindow().isVisible = true
    }
}
