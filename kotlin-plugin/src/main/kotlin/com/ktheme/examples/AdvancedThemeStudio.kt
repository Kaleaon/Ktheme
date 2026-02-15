package com.ktheme.examples

import com.ktheme.library.KthemeAPI
import com.ktheme.models.*
import com.ktheme.utils.ColorUtils
import java.awt.*
import java.awt.event.ActionEvent
import javax.swing.*
import javax.swing.border.EmptyBorder
import kotlin.math.cos
import kotlin.math.sin
import kotlin.random.Random

/**
 * Advanced visual app for creating rich themes with animations, transitions, particles and glow.
 */
class AdvancedThemeStudio : JFrame("Ktheme Advanced Theme Studio") {
    private val nameField = JTextField("Aurora Motion")
    private val descriptionField = JTextField("Dynamic neon theme with particles and glow")
    private val authorField = JTextField(System.getProperty("user.name"))

    private val primaryField = JTextField("#7C4DFF")
    private val secondaryField = JTextField("#00E5FF")
    private val backgroundField = JTextField("#0B1024")

    private val transitionsToggle = JCheckBox("Enable transitions", true)
    private val transitionsDuration = JSlider(100, 1200, 450)

    private val animationToggle = JCheckBox("Enable UI animation", true)
    private val animationDuration = JSlider(100, 2000, 700)

    private val particlesToggle = JCheckBox("Enable particles", true)
    private val particlesCount = JSlider(10, 180, 90)
    private val particlesSpeed = JSlider(1, 20, 8)

    private val glowToggle = JCheckBox("Enable glow", true)
    private val glowRadius = JSlider(4, 40, 18)
    private val glowIntensity = JSlider(1, 100, 65)
    private val glowPulse = JCheckBox("Pulse glow", true)

    private val previewPanel = AnimatedThemePreviewPanel()

    init {
        defaultCloseOperation = EXIT_ON_CLOSE
        size = Dimension(1250, 760)
        minimumSize = Dimension(1000, 660)
        setLocationRelativeTo(null)

        contentPane = JPanel(BorderLayout(12, 12)).apply {
            border = EmptyBorder(14, 14, 14, 14)
            background = Color(15, 20, 40)
        }

        contentPane.add(createTitlePanel(), BorderLayout.NORTH)
        contentPane.add(createEditorPanel(), BorderLayout.WEST)
        contentPane.add(createPreviewPanel(), BorderLayout.CENTER)
        contentPane.add(createActionsPanel(), BorderLayout.SOUTH)

        refreshPreview()
    }

    private fun createTitlePanel(): JComponent = JPanel(BorderLayout()).apply {
        isOpaque = false
        border = EmptyBorder(0, 0, 6, 0)
        add(JLabel("Advanced Theme Studio").apply {
            font = Font(Font.SANS_SERIF, Font.BOLD, 26)
            foreground = Color(235, 242, 255)
        }, BorderLayout.WEST)
        add(JLabel("Create cinematic themes with particles, glow, transitions, and animation").apply {
            foreground = Color(162, 178, 214)
            horizontalAlignment = SwingConstants.RIGHT
        }, BorderLayout.EAST)
    }

    private fun createEditorPanel(): JComponent = JPanel(BorderLayout(8, 8)).apply {
        preferredSize = Dimension(400, 0)
        background = Color(18, 26, 54)
        border = BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(Color(44, 60, 110), 1),
            EmptyBorder(10, 10, 10, 10)
        )

        val tabs = JTabbedPane().apply {
            addTab("Identity", createIdentityTab())
            addTab("Colors", createColorsTab())
            addTab("Effects", createEffectsTab())
        }

        add(tabs, BorderLayout.CENTER)
    }

    private fun createIdentityTab(): JComponent = panelWithFields(
        "Theme Name" to nameField,
        "Description" to descriptionField,
        "Author" to authorField
    )

    private fun createColorsTab(): JComponent = panelWithFields(
        "Primary" to primaryField,
        "Secondary" to secondaryField,
        "Background" to backgroundField
    )

    private fun createEffectsTab(): JComponent = JPanel().apply {
        layout = BoxLayout(this, BoxLayout.Y_AXIS)
        border = EmptyBorder(10, 6, 10, 6)
        isOpaque = false

        add(effectGroup("Transitions", transitionsToggle, transitionsDuration, "Duration"))
        add(Box.createVerticalStrut(8))
        add(effectGroup("Animations", animationToggle, animationDuration, "Duration"))
        add(Box.createVerticalStrut(8))
        add(effectGroup("Particles", particlesToggle, particlesCount, "Count"))
        add(labeledSlider("Particle speed", particlesSpeed))
        add(Box.createVerticalStrut(8))
        add(effectGroup("Glow", glowToggle, glowRadius, "Radius"))
        add(labeledSlider("Glow intensity", glowIntensity))
        add(glowPulse.apply { alignmentX = LEFT_ALIGNMENT })
    }

    private fun effectGroup(title: String, toggle: JCheckBox, slider: JSlider, sliderLabel: String): JComponent = JPanel().apply {
        layout = BoxLayout(this, BoxLayout.Y_AXIS)
        isOpaque = false
        border = BorderFactory.createTitledBorder(title)
        add(toggle.apply { alignmentX = LEFT_ALIGNMENT })
        add(labeledSlider(sliderLabel, slider))
    }

    private fun labeledSlider(label: String, slider: JSlider): JComponent = JPanel(BorderLayout()).apply {
        isOpaque = false
        alignmentX = LEFT_ALIGNMENT
        add(JLabel(label), BorderLayout.WEST)
        slider.paintTicks = true
        slider.paintLabels = true
        slider.majorTickSpacing = ((slider.maximum - slider.minimum) / 4).coerceAtLeast(1)
        add(slider, BorderLayout.CENTER)
    }

    private fun panelWithFields(vararg rows: Pair<String, JComponent>): JComponent = JPanel(GridBagLayout()).apply {
        isOpaque = false
        border = EmptyBorder(12, 8, 12, 8)

        val gbc = GridBagConstraints().apply {
            fill = GridBagConstraints.HORIZONTAL
            insets = Insets(6, 0, 6, 0)
            weightx = 1.0
            gridx = 0
        }

        rows.forEachIndexed { index, row ->
            gbc.gridy = index * 2
            add(JLabel(row.first), gbc)
            gbc.gridy = index * 2 + 1
            add(row.second, gbc)
        }
    }

    private fun createPreviewPanel(): JComponent = JPanel(BorderLayout()).apply {
        background = Color(9, 14, 31)
        border = BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(Color(44, 60, 110), 1),
            EmptyBorder(10, 10, 10, 10)
        )
        add(previewPanel, BorderLayout.CENTER)
    }

    private fun createActionsPanel(): JComponent = JPanel(FlowLayout(FlowLayout.RIGHT, 10, 0)).apply {
        isOpaque = false

        val updatePreview = JButton("Update Preview")
        val saveJson = JButton("Save Theme JSON")
        val shareSystemWide = JButton("Share via API")

        updatePreview.addActionListener { refreshPreview() }
        saveJson.addActionListener { saveTheme() }
        shareSystemWide.addActionListener { shareTheme() }

        add(updatePreview)
        add(saveJson)
        add(shareSystemWide)
    }

    private fun refreshPreview() {
        val theme = buildTheme()
        previewPanel.applyTheme(theme)
    }

    private fun saveTheme() {
        runCatching {
            val theme = buildTheme()
            val chooser = JFileChooser().apply {
                selectedFile = java.io.File("${theme.metadata.id}.json")
            }
            if (chooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
                val output = chooser.selectedFile.let {
                    if (it.name.endsWith(".json")) it else java.io.File(it.parentFile, "${it.name}.json")
                }
                val json = kotlinx.serialization.json.Json { prettyPrint = true }
                output.writeText(json.encodeToString(Theme.serializer(), theme))
                JOptionPane.showMessageDialog(this, "Saved theme to ${output.absolutePath}")
            }
        }.onFailure {
            JOptionPane.showMessageDialog(this, "Could not save theme: ${it.message}", "Error", JOptionPane.ERROR_MESSAGE)
        }
    }

    private fun shareTheme() {
        runCatching {
            val theme = buildTheme()
            val shared = KthemeAPI.shareTheme(theme)
            if (shared) {
                JOptionPane.showMessageDialog(
                    this,
                    "Theme shared successfully.\nAvailable to other apps at:\n${KthemeAPI.getSharedDirectory().absolutePath}"
                )
            } else {
                JOptionPane.showMessageDialog(this, "Theme sharing failed", "Error", JOptionPane.ERROR_MESSAGE)
            }
        }.onFailure {
            JOptionPane.showMessageDialog(this, "Could not share theme: ${it.message}", "Error", JOptionPane.ERROR_MESSAGE)
        }
    }

    private fun buildTheme(): Theme {
        val primary = normalizeHex(primaryField.text)
        val secondary = normalizeHex(secondaryField.text)
        val background = normalizeHex(backgroundField.text)
        val onBg = ColorUtils.getContrastColor(background)
        val now = System.currentTimeMillis().toString()

        return Theme(
            metadata = ThemeMetadata(
                id = nameField.text.trim().lowercase().replace(Regex("[^a-z0-9]+"), "-").trim('-'),
                name = nameField.text.trim(),
                description = descriptionField.text.trim(),
                author = authorField.text.trim(),
                version = "1.0.0",
                tags = listOf("advanced", "animated", "shared"),
                createdAt = now,
                updatedAt = now
            ),
            darkMode = true,
            colorScheme = buildColorScheme(primary, secondary, background),
            effects = VisualEffects(
                metallic = MetallicEffects(
                    enabled = true,
                    variant = "CUSTOM",
                    gradient = MetallicGradient(
                        base = primary,
                        highlight = ColorUtils.lighten(primary, 26f),
                        shadow = ColorUtils.darken(primary, 28f),
                        shimmer = ColorUtils.lighten(primary, 44f)
                    ),
                    intensity = 0.72f
                ),
                shadows = ShadowEffects(true, 12, 18, "#00000088"),
                animations = AnimationEffects(animationToggle.isSelected, animationDuration.value, "easeInOutCubic"),
                transitions = TransitionEffects(
                    enabled = transitionsToggle.isSelected,
                    duration = transitionsDuration.value,
                    properties = listOf("background", "foreground", "shadow", "transform")
                ),
                particles = ParticleEffects(
                    enabled = particlesToggle.isSelected,
                    count = particlesCount.value,
                    speed = particlesSpeed.value / 10f,
                    size = 4,
                    color = secondary
                ),
                glow = GlowEffects(
                    enabled = glowToggle.isSelected,
                    radius = glowRadius.value,
                    intensity = glowIntensity.value / 100f,
                    color = primary,
                    pulse = glowPulse.isSelected
                )
            )
        )
    }

    private fun buildColorScheme(primary: String, secondary: String, background: String): ColorScheme {
        val onPrimary = ColorUtils.getContrastColor(primary)
        val onSecondary = ColorUtils.getContrastColor(secondary)
        val onBackground = ColorUtils.getContrastColor(background)
        val surface = ColorUtils.lighten(background, 8f)

        return ColorScheme(
            primary = primary,
            onPrimary = onPrimary,
            primaryContainer = ColorUtils.darken(primary, 22f),
            onPrimaryContainer = ColorUtils.lighten(onPrimary, 2f),
            secondary = secondary,
            onSecondary = onSecondary,
            secondaryContainer = ColorUtils.darken(secondary, 24f),
            onSecondaryContainer = ColorUtils.lighten(onSecondary, 2f),
            tertiary = ColorUtils.mix(primary, secondary, 0.5f),
            onTertiary = onBackground,
            tertiaryContainer = ColorUtils.darken(ColorUtils.mix(primary, secondary, 0.5f), 35f),
            onTertiaryContainer = onBackground,
            error = "#FF5252",
            onError = "#FFFFFF",
            errorContainer = "#550000",
            onErrorContainer = "#FFCDD2",
            background = background,
            onBackground = onBackground,
            surface = surface,
            onSurface = onBackground,
            surfaceVariant = ColorUtils.lighten(surface, 7f),
            onSurfaceVariant = onBackground,
            outline = ColorUtils.mix(primary, onBackground, 0.5f),
            outlineVariant = ColorUtils.mix(secondary, onBackground, 0.6f),
            scrim = "#000000AA",
            inverseSurface = ColorUtils.lighten(background, 80f),
            inverseOnSurface = ColorUtils.getContrastColor(ColorUtils.lighten(background, 80f)),
            inversePrimary = ColorUtils.lighten(primary, 40f)
        )
    }

    private fun normalizeHex(value: String): String {
        val hex = if (value.startsWith("#")) value else "#$value"
        require(ColorUtils.isValidHex(hex)) { "Invalid color: $value" }
        return if (hex.length == 4) {
            "#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}"
        } else {
            hex.take(7)
        }
    }
}

private class AnimatedThemePreviewPanel : JPanel() {
    private var theme: Theme? = null
    private var tick: Int = 0
    private var particles: MutableList<Point> = mutableListOf()

    init {
        preferredSize = Dimension(760, 620)
        background = Color(8, 12, 30)
        Timer(33) { _: ActionEvent ->
            tick++
            animateParticles()
            repaint()
        }.start()
    }

    fun applyTheme(theme: Theme) {
        this.theme = theme
        val count = theme.effects?.particles?.count ?: 0
        particles = MutableList(count) {
            Point(Random.nextInt(width.coerceAtLeast(1)), Random.nextInt(height.coerceAtLeast(1)))
        }
        repaint()
    }

    private fun animateParticles() {
        val particleFx = theme?.effects?.particles ?: return
        if (!particleFx.enabled || particles.isEmpty()) return

        val speed = particleFx.speed.coerceAtLeast(0.1f)
        particles = particles.mapIndexed { index, p ->
            val angle = (tick * 0.03 + index).toFloat()
            val x = (p.x + cos(angle.toDouble()) * speed).toInt().mod(width.coerceAtLeast(1))
            val y = (p.y + sin((angle * 1.2f).toDouble()) * speed).toInt().mod(height.coerceAtLeast(1))
            Point(x, y)
        }.toMutableList()
    }

    override fun paintComponent(g: Graphics) {
        super.paintComponent(g)
        val current = theme ?: return
        val g2 = g as Graphics2D
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)

        val bg = Color(ColorUtils.hexToColorInt(current.colorScheme.background), true)
        val primary = Color(ColorUtils.hexToColorInt(current.colorScheme.primary), true)
        val secondary = Color(ColorUtils.hexToColorInt(current.colorScheme.secondary), true)
        val text = Color(ColorUtils.hexToColorInt(current.colorScheme.onBackground), true)

        g2.paint = GradientPaint(0f, 0f, bg, width.toFloat(), height.toFloat(), Color(bg.red / 2, bg.green / 2, bg.blue / 2))
        g2.fillRect(0, 0, width, height)

        val glow = current.effects?.glow
        if (glow?.enabled == true) {
            val pulseFactor = if (glow.pulse) 0.7 + 0.3 * (sin(tick * 0.06) + 1) / 2 else 1.0
            val alpha = (glow.intensity * 130 * pulseFactor).toInt().coerceIn(20, 220)
            g2.color = Color(primary.red, primary.green, primary.blue, alpha)
            val radius = glow.radius * 8
            g2.fillOval(width / 2 - radius / 2, height / 2 - radius / 2, radius, radius)
        }

        val transition = current.effects?.transitions
        if (transition?.enabled == true) {
            val band = ((tick * 6) % (width + 220)) - 220
            g2.paint = GradientPaint(
                band.toFloat(), 0f, Color(255, 255, 255, 0),
                (band + 220).toFloat(), 0f, Color(255, 255, 255, 40)
            )
            g2.fillRect(0, 0, width, height)
        }

        val particleFx = current.effects?.particles
        if (particleFx?.enabled == true) {
            val particleColor = Color(ColorUtils.hexToColorInt(particleFx.color), true)
            g2.color = Color(particleColor.red, particleColor.green, particleColor.blue, 170)
            val size = particleFx.size.coerceAtLeast(2)
            particles.forEach { p -> g2.fillOval(p.x, p.y, size, size) }
        }

        g2.color = Color(255, 255, 255, 28)
        g2.fillRoundRect(40, 52, width - 80, height - 104, 28, 28)

        g2.color = primary
        g2.fillRoundRect(70, 95, width - 140, 70, 20, 20)
        g2.color = ColorUtils.getContrastColor(current.colorScheme.primary).let { Color(ColorUtils.hexToColorInt(it), true) }
        g2.font = Font(Font.SANS_SERIF, Font.BOLD, 24)
        g2.drawString(current.metadata.name, 90, 140)

        g2.color = secondary
        g2.fillRoundRect(70, 190, 220, 48, 16, 16)
        g2.fillRoundRect(300, 190, 220, 48, 16, 16)

        g2.color = text
        g2.font = Font(Font.SANS_SERIF, Font.PLAIN, 16)
        g2.drawString("Transition: ${current.effects?.transitions?.enabled == true}", 80, 278)
        g2.drawString("Particles: ${current.effects?.particles?.enabled == true}", 80, 306)
        g2.drawString("Glow: ${current.effects?.glow?.enabled == true}", 80, 334)
        g2.drawString("Animation: ${current.effects?.animations?.enabled == true}", 80, 362)
        g2.drawString("Shared via API: ${KthemeAPI.getSharedDirectory().absolutePath}", 80, 412)
    }
}

fun main() {
    SwingUtilities.invokeLater {
        AdvancedThemeStudio().isVisible = true
    }
}
