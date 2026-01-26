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

	// Initialize audio context and preload sounds immediately (no lag on first click)
	initAudioCtx()
	loadAudio('o1', ['/assets/audio/o1.ogg', '/assets/audio/o1.mp3']).catch(() => { })
	loadAudio('d1', ['/assets/audio/d1.ogg', '/assets/audio/d1.mp3']).catch(() => { })
	loadAudio('d2', ['/assets/audio/d2.ogg', '/assets/audio/d2.mp3']).catch(() => { })
	loadAudio('h', ['/assets/audio/h.ogg', '/assets/audio/h.mp3']).catch(() => { })
	loadAudio('o2', ['/assets/audio/o2.ogg', '/assets/audio/o2.mp3']).catch(() => { })
	loadAudio('r', ['/assets/audio/r.ogg', '/assets/audio/r.mp3']).catch(() => { })
	loadAudio('s', ['/assets/audio/s.ogg', '/assets/audio/s.mp3']).catch(() => { })
	loadAudio('e', ['/assets/audio/e.ogg', '/assets/audio/e.mp3']).catch(() => { })
	loadAudio('wheel-of-fortune', ['/assets/audio/yeah-thats-it.ogg', '/assets/audio/yeah-thats-it.mp3']).catch(() => { })
})
