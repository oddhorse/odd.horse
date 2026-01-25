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
import { initAudioCtx, loadAudio, playAudio, resumeAudio } from './audio.js'
import { initHeaderLogo } from './header-logo.js'

/**
 * Initialize all site functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
	setupNavbar()
	defineColors()
	setupModals()
	initHeaderLogo()

	// Initialize audio context
	initAudioCtx()

	// Preload audio on first user gesture
	function onceLoad() {
		document.removeEventListener('pointerdown', onceLoad)
		loadAudio('wheel-of-fortune', ['/assets/audio/yeah-thats-it.ogg', '/assets/audio/yeah-thats-it.mp3']).catch(() => { })
	}
	document.addEventListener('pointerdown', onceLoad, { once: true })

	// Wire logo click to play audio
	const logo = document.querySelector('.logo-link')
	if (logo) {
		logo.addEventListener('click', async () => {
			try { await resumeAudio() } catch (e) { }
			playAudio('wheel-of-fortune')
		})
	}
})
