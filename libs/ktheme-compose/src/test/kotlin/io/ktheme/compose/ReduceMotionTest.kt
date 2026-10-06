package io.ktheme.compose

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ReduceMotionTest {

    @Test
    fun testLocalReduceMotionDefaultValueExists() {
        // Verify LocalReduceMotion CompositionLocal key exists and is non-null
        val local = LocalReduceMotion
        assertTrue(local != null)
    }
}
