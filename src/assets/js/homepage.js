/**
 * homepage.js
 * JavaScript loaded ONLY on the homepage (index.njk)
 *
 * Initializes homepage-specific features:
 * - Artifact click tracking (localStorage "seen" state)
 * - Stampede effect on logo click
 * - Chaos hover effects on navbar links
 * - Stampede audio (the logo's own sounds are handled by logo.js)
 *
 * Since this file only loads on index.njk, these features stay homepage-only
 * without needing any conditional logic.
 */

import { initAudioCtx, loadAudio } from './audio.js'
import { initStampede } from './stampede.js'
import { initChaosHover } from './chaos-hover.js'
import { initArtifactTracking, wipeClickData, refreshArtifactUI } from './artifacts.js'

/**
 * Initialize homepage features when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
	// Initialize homepage features
	initArtifactTracking()
	initStampede()
	initChaosHover()

	// Stampede's sound only. The logo's own clips are preloaded by logo.js.
	initAudioCtx()
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
