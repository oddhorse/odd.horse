/**
 * main.js
 * Main entry point for odd.horse JavaScript
 *
 * Initializes all site functionality:
 * - Navbar hover effects (logo color changes)
 * - Color system (derives hover colors from page color)
 * - Artifact tracking (marks clicked links with filled dots)
 *
 * Order matters: setupNavbar must run before defineColors to ensure
 * navbar link colors are available when computing derived colors.
 */

import { defineColors } from './colors.js'
import { setupNavbar } from './navbar.js'
import { initArtifactTracking } from './artifacts.js'

/**
 * Initialize all site functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
	setupNavbar()
	defineColors()
	initArtifactTracking()
})
