/**
 * core.js
 * Core JavaScript loaded on ALL pages
 *
 * Initializes the two things every page needs:
 * - Logo hover tinting (delegated, so it also covers dynamically added links)
 * - Modal system (contact, stream and socials popups)
 *
 * Colour derivation used to live here too, via colors.js. It is now done in
 * CSS with relative color syntax — see --link-hover-color in global.css.
 */

import { setupLogoHover } from './logo-hover.js'
import { setupModals } from './modals.js'

document.addEventListener('DOMContentLoaded', () => {
	setupLogoHover()
	setupModals()
})
