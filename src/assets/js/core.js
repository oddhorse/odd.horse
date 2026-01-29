/**
 * core.js
 * Core JavaScript loaded on ALL pages
 *
 * Initializes essential site functionality:
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

/**
 * Initialize core site functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
	setupNavbar()
	defineColors()
	setupModals()
})
