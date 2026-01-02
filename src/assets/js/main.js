/**
 * main.js
 * Main entry point for odd.horse JavaScript
 *
 * Initializes all site functionality:
 * - Navbar hover effects (logo color changes)
 * - Color system (derives hover colors from page color)
 * - Artifact tracking (marks clicked links with filled dots)
 * - Modal system (contact and links popups)
 *
 * Order matters: setupNavbar must run before defineColors to ensure
 * navbar link colors are available when computing derived colors.
 */

import { defineColors } from './colors.js'
import { setupNavbar } from './navbar.js'
import { initArtifactTracking, wipeClickData, refreshArtifactUI } from './artifacts.js'
import { setupModals } from './modals.js'

/**
 * Initialize all site functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
	setupNavbar()
	defineColors()
	initArtifactTracking()
	setupModals()
})

/**
 * Expose artifact functions to console for debugging
 * Usage:
 *   window.wipeClickData() - Clear all click data
 *   window.refreshArtifactUI() - Refresh UI to match current localStorage state
 */
window.wipeClickData = wipeClickData
window.refreshArtifactUI = refreshArtifactUI
