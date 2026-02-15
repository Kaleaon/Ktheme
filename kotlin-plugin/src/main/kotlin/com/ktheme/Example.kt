package com.ktheme

import com.ktheme.core.ThemeEngine
import com.ktheme.utils.ColorUtils
import java.io.File

/**
 * Example application demonstrating Ktheme usage
 */
fun main() {
    println("🎨 Ktheme Kotlin Plugin Example\n")
    println("=" .repeat(50))
    
    // Create theme engine
    val engine = ThemeEngine()
    
    // Load themes from JSON files
    val themesDir = File("../themes/examples")
    if (themesDir.exists()) {
        println("\n📁 Loading themes from ${themesDir.absolutePath}...\n")
        
        themesDir.listFiles()?.filter { it.extension == "json" }?.forEach { file ->
            try {
                engine.loadThemeFromFile(file)
                println("  ✓ Loaded: ${file.nameWithoutExtension}")
            } catch (e: Exception) {
                println("  ✗ Failed to load ${file.name}: ${e.message}")
            }
        }
    } else {
        println("\n⚠️  Themes directory not found: ${themesDir.absolutePath}")
        println("   Please ensure you're running from the kotlin-plugin directory")
    }
    
    // List all loaded themes
    println("\n📚 Available Themes (${engine.getAllThemes().size}):")
    engine.getAllThemes().forEach { theme ->
        println("  - ${theme.metadata.name} (${theme.metadata.id})")
        println("    Tags: ${theme.metadata.tags.joinToString(", ")}")
    }
    
    // Set active theme
    println("\n🎨 Setting active theme to 'navy-gold'...")
    try {
        engine.setActiveTheme("navy-gold")
        
        engine.getActiveTheme()?.let { theme ->
            println("\n✓ Active Theme: ${theme.metadata.name}")
            println("  Description: ${theme.metadata.description}")
            println("  Author: ${theme.metadata.author}")
            
            println("\n🎨 Color Scheme:")
            with(theme.colorScheme) {
                println("  Primary: $primary")
                println("  On Primary: $onPrimary")
                println("  Background: $background")
                println("  On Background: $onBackground")
                println("  Surface: $surface")
                println("  On Surface: $onSurface")
            }
            
            theme.effects?.let { effects ->
                println("\n✨ Visual Effects:")
                effects.metallic?.let {
                    println("  Metallic: ${it.variant} (intensity: ${it.intensity})")
                }
                effects.shadows?.let {
                    println("  Shadows: elevation ${it.elevation}, blur ${it.blur}")
                }
                effects.shimmer?.let {
                    println("  Shimmer: speed ${it.speed}, intensity ${it.intensity}")
                }
            }
        }
    } catch (e: Exception) {
        println("  ✗ Error: ${e.message}")
    }
    
    // Search themes
    println("\n🔍 Searching for metallic themes...")
    val metallicThemes = engine.searchByTags(listOf("metallic"))
    println("  Found ${metallicThemes.size} metallic themes:")
    metallicThemes.forEach { theme ->
        println("    - ${theme.metadata.name}")
    }
    
    // Color utilities demo
    println("\n🌈 Color Utilities Demo:")
    val goldColor = "#D4AF37"
    println("  Original color: $goldColor")
    
    val rgb = ColorUtils.hexToRgb(goldColor)
    println("  RGB: r=${rgb.r}, g=${rgb.g}, b=${rgb.b}")
    
    val darker = ColorUtils.darken(goldColor, 20f)
    println("  20% darker: $darker")
    
    val lighter = ColorUtils.lighten(goldColor, 20f)
    println("  20% lighter: $lighter")
    
    val contrast = ColorUtils.getContrastColor("#0A1630")
    println("  Contrast for navy: $contrast")
    
    val mixed = ColorUtils.mix(goldColor, "#0A1630", 0.5f)
    println("  Mixed with navy: $mixed")
    
    // Validation demo
    println("\n✓ Theme Validation:")
    engine.getAllThemes().firstOrNull()?.let { theme ->
        val validation = engine.validateTheme(theme)
        println("  Theme: ${theme.metadata.name}")
        println("  Valid: ${validation.valid}")
        if (validation.errors.isNotEmpty()) {
            println("  Errors: ${validation.errors.joinToString(", ")}")
        }
        if (validation.warnings.isNotEmpty()) {
            println("  Warnings: ${validation.warnings.joinToString(", ")}")
        }
    }
    
    println("\n" + "=".repeat(50))
    println("✓ Example completed successfully!")
}
