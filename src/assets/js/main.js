/**
 * main.js
 * Main entry point for odd.horse JavaScript
 *
 * Initializes all site functionality:
 * - Navbar hover effects (logo color changes)
 * - Color system (derives hover colors from page color)
 * - Modal system (contact and links popups)
 *
 * Order matters: setupNavbar must run before defineColors to ensure
 * navbar link colors are available when computing derived colors.
 */

import { defineColors } from './colors.js'
import { setupNavbar } from './navbar.js'
import { setupModals } from './modals.js'
import { setupAudio } from './audio.js'
import { initHeaderLogo } from './header-logo.js'



/**
 * Initialize all site functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
	setupNavbar()
	defineColors()
	setupModals()
	initHeaderLogo()
	// call centralized audio setup
	setupAudio()
})
