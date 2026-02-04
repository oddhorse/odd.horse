/**
 * homepage.js
 * JavaScript loaded ONLY on the homepage (index.njk)
 *
 * Initializes homepage-specific features:
 * - Header logo tagline rotation and audio
 * - Stampede effect on logo click
 * - Chaos hover effects on navbar links
 * - Audio preloading for all interactive sounds
 *
 * Since this file only loads on index.njk, all features (including audio)
 * naturally stay homepage-only without needing lazy loading.
 */

import { initAudioCtx, loadAudio } from './audio.js'
import { initHeaderLogo } from './header-logo.js'
import { initStampede } from './stampede.js'
import { initChaosHover } from './chaos-hover.js'
import { wipeClickData, refreshArtifactUI } from './artifacts.js'

/**
 * Initialize homepage features when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
	// Initialize homepage features
	initHeaderLogo()
	initStampede()
	initChaosHover()

	// Initialize audio context and preload sounds immediately (no lag on first click)
	// This runs on homepage only since this file only loads on index.njk
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
	loadAudio('stampede', ['/assets/audio/elephant.ogg', '/assets/audio/elephant.mp3']).catch(() => { })

	// Expose beta/debug functions on window for console access (works in production without beta menu)
	window.wipeClickData = wipeClickData
	window.refreshArtifactUI = refreshArtifactUI
	window.wipe = function () {
		wipeClickData()
		refreshArtifactUI()
		console.log('Click data cleared and UI refreshed')
	}
	window.help = function () {
		console.log("debug functions available:\n  wipeClickData() - clear all click data\n  refreshArtifactUI() - refresh artifact ui\n  wipe() - clear click data and refresh ui\n  help() - show this help message")
	}

})
