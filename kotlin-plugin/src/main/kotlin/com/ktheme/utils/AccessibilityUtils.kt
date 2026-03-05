package com.ktheme.utils

import java.awt.Component
import java.awt.Container
import java.awt.FocusTraversalPolicy
import javax.accessibility.AccessibleContext
import javax.swing.JComponent

/**
 * Reusable accessibility defaults for Swing controls used in Ktheme.
 */
object AccessibilityUtils {
    fun configureControl(
        component: JComponent,
        label: String,
        roleHint: String,
        description: String,
        keyboardHint: String? = null
    ) {
        component.toolTipText = description
        component.accessibleContext.accessibleName = "$label ($roleHint)"
        component.accessibleContext.accessibleDescription = buildString {
            append(description)
            keyboardHint?.let { append(" Keyboard: $it") }
        }
    }

    fun announceState(component: JComponent, stateMessage: String) {
        component.accessibleContext.accessibleDescription = stateMessage
        component.accessibleContext.firePropertyChange(
            AccessibleContext.ACCESSIBLE_VISIBLE_DATA_PROPERTY,
            null,
            stateMessage
        )
    }

    fun applyDeterministicFocusOrder(root: Container, orderedComponents: List<Component>) {
        root.focusTraversalPolicy = OrderedFocusTraversalPolicy(orderedComponents)
        if (root is JComponent) {
            root.isFocusCycleRoot = true
        }
    }

    private class OrderedFocusTraversalPolicy(
        private val orderedComponents: List<Component>
    ) : FocusTraversalPolicy() {
        override fun getComponentAfter(aContainer: Container, aComponent: Component): Component {
            val index = orderedComponents.indexOf(aComponent)
            val nextIndex = if (index < 0) 0 else (index + 1) % orderedComponents.size
            return orderedComponents[nextIndex]
        }

        override fun getComponentBefore(aContainer: Container, aComponent: Component): Component {
            val index = orderedComponents.indexOf(aComponent)
            val previousIndex = if (index <= 0) orderedComponents.lastIndex else index - 1
            return orderedComponents[previousIndex]
        }

        override fun getFirstComponent(aContainer: Container): Component = orderedComponents.first()

        override fun getLastComponent(aContainer: Container): Component = orderedComponents.last()

        override fun getDefaultComponent(aContainer: Container): Component = orderedComponents.first()
    }
}
