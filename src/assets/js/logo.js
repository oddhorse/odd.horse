/**
 * logo.js
 * Behaviour for the oddhorse logo component (_includes/logo.njk).
 *
 * The logo is meant to be droppable: any number of them can appear on a page,
 * at any size, with or without a tagline. So this module finds every
 * .logo-container on the page and wires each one up independently.
 *
 * What is PER INSTANCE: tagline text, rotation index, rotation timer, and the
 * DOM handlers for that logo's own letters. Each instance keeps its state in a
 * closure, so two logos rotate taglines independently.
 *
 * What is SHARED: the audio. audio.js is a module-level singleton (one
 * AudioContext, one buffer cache), and every logo registers its letters
 * against those same handlers. So N logos never means N downloads or N
 * AudioContexts, and clicking the same letter on two logos restarts one sound
 * rather than layering two copies of it.
 *
 * Audio preloads once the page has finished loading, during idle time, so it
 * never competes with the page itself but is ready before anyone clicks. The
 * clips are small (~97KB for all nine), so there is no reason to wait longer.
 *
 * Clicks play SYNCHRONOUSLY. Browsers only let audio start inside a user
 * gesture; any `await` before playAudio() leaves that gesture, the context
 * stays suspended, and the click is silent. So: never await before playing.
 */

import { hasAudio, initAudioCtx, loadAudio, playAudio, resumeAudio } from './audio.js'

// ===== CONSTANTS =====

const ROTATION_INTERVAL_MS = 10000

/**
 * Letter class -> sound. The key is what audio.js caches the buffer under,
 * so every logo instance reuses the same decoded audio.
 */
const LETTER_SOUNDS = {
	'letter-icon': 'yeah-thats-it',
	'letter-o1': 'o1',
	'letter-d1': 'd1',
	'letter-d2': 'd2',
	'letter-h': 'h',
	'letter-o2': 'o2',
	'letter-r': 'r',
	'letter-s': 's',
	'letter-e': 'e',
}

// ===== SHARED AUDIO =====

/** Per-clip load promises, so each clip is fetched once no matter how many
 *  logos or clicks ask for it. */
const clipLoads = new Map()

/**
 * Load one clip, once. Later calls for the same key share the first promise.
 * @param {string} key - Sound key, also the audio filename
 * @returns {Promise<void>} Resolves when decoded; logs rather than rejects
 */
function loadClip(key) {
	if (!clipLoads.has(key)) {
		clipLoads.set(
			key,
			loadAudio(key, [
				`/assets/audio/${key}.ogg`,
				`/assets/audio/${key}.mp3`,
			]).catch((err) => {
				// Surface failures: a silently swallowed error here looks
				// exactly like "clicks do nothing".
				console.error(`logo: could not load sound "${key}"`, err)
			}),
		)
	}
	return clipLoads.get(key)
}

/**
 * Preload every clip used by any logo on the page.
 * Only loads letters actually present, so a mark-only logo fetches one clip.
 */
function preloadAudio() {
	const needed = new Set()
	for (const piece of document.querySelectorAll('.header-logo-piece')) {
		for (const cls of Object.keys(LETTER_SOUNDS)) {
			if (piece.classList.contains(cls)) needed.add(LETTER_SOUNDS[cls])
		}
	}
	if (needed.size === 0) return

	initAudioCtx()
	for (const key of needed) loadClip(key)
}

/**
 * Run preloadAudio once the page has fully loaded, in idle time.
 * `load` waits for images/fonts; requestIdleCallback then waits for the main
 * thread to be free, so audio never delays anything the visitor can see.
 */
function schedulePreload() {
	const idle = () =>
		'requestIdleCallback' in window
			? requestIdleCallback(preloadAudio, { timeout: 2000 })
			: setTimeout(preloadAudio, 200)

	if (document.readyState === 'complete') idle()
	else window.addEventListener('load', idle, { once: true })
}

/**
 * Resume the AudioContext on the visitor's first gesture anywhere on the page.
 *
 * The context is created during idle preload, before any gesture, so it
 * starts suspended. resume() is asynchronous, so resuming inside a letter's
 * own click means that first sound is started a beat before the context is
 * running. pointerdown fires before click in the same interaction, so
 * unlocking here means even the very first letter plays on a running context.
 */
function unlockOnFirstGesture() {
	const unlock = () => resumeAudio().catch(() => { })
	for (const type of ['pointerdown', 'keydown']) {
		window.addEventListener(type, unlock, { once: true, capture: true })
	}
}

// ===== HELPERS =====

/**
 * Add the bounce class, then remove it once the animation has run.
 * Duration is read from CSS so the timing stays in one place.
 * @param {HTMLElement} element - Element to bounce
 */
function bounce(element) {
	element.classList.add('hoverwink-animate')
	const duration =
		Number.parseFloat(
			getComputedStyle(element).getPropertyValue(
				'--hoverwink-transition-speed',
			),
		) * 1000
	setTimeout(() => element.classList.remove('hoverwink-animate'), duration)
}

/**
 * Wire up the rotating tagline for one logo, if it has one.
 * Returns silently when the logo was dropped in without a tagline.
 * @param {HTMLElement} root - The .logo-container element
 */
function setupTagline(root) {
	const tagline = root.querySelector('.tagline')
	if (!tagline) return

	let taglines = []
	try {
		taglines = JSON.parse(tagline.getAttribute('data-taglines') || '[]')
	} catch (err) {
		console.error('logo: could not parse data-taglines', err)
	}
	if (taglines.length === 0) return

	// Per-instance state: two logos rotate independently.
	const shuffled = [...taglines].sort(() => Math.random() - 0.5)
	let index = 0
	let timer = null

	const show = () => {
		tagline.innerHTML = shuffled[index]
		bounce(tagline)
	}

	const rotate = () => {
		index = (index + 1) % shuffled.length
		show()
	}

	const restartTimer = () => {
		if (timer) clearInterval(timer)
		timer = setInterval(rotate, ROTATION_INTERVAL_MS)
	}

	// Clicking the tagline advances it and resets the countdown
	tagline.addEventListener('click', () => {
		rotate()
		restartTimer()
	})

	show()
	tagline.style.opacity = 1
	restartTimer()
}

/**
 * Wire up per-letter bouncing and sounds for one logo.
 * @param {HTMLElement} root - The .logo-container element
 */
function setupLetters(root) {
	for (const piece of root.querySelectorAll('.header-logo-piece')) {
		// Find which sound this letter owns, if any
		const soundKey = Object.keys(LETTER_SOUNDS).find((cls) =>
			piece.classList.contains(cls),
		)

		// Deliberately NOT async — see the file header. Everything up to
		// playAudio() must run inside the click's user gesture.
		piece.addEventListener('click', () => {
			bounce(piece)
			if (!soundKey) return
			const key = LETTER_SOUNDS[soundKey]

			// Normally already running (unlockOnFirstGesture). Called again
			// here as a safety net; not awaited, on purpose.
			resumeAudio().catch(() => { })

			if (hasAudio(key)) {
				playAudio(key)
			} else {
				// Clicked before preload finished: fetch just this clip, then
				// play. Sticky activation from this click permits it.
				loadClip(key).then(() => playAudio(key))
			}
		})
	}
}

// ===== BOOTSTRAP =====

/**
 * Initialise a single logo.
 * @param {HTMLElement} root - The .logo-container element
 */
export function initLogo(root) {
	// Guard against double-init if this ever runs twice on the same element
	if (root.dataset.logoReady) return
	root.dataset.logoReady = 'true'

	setupTagline(root)
	setupLetters(root)
}

/**
 * Find and initialise every logo on the page.
 * @returns {void}
 */
export function initLogos() {
	for (const root of document.querySelectorAll('.logo-container')) {
		initLogo(root)
	}
}

// Self-initialising: the component's own <script> tag pulls this in, so a
// dropped-in logo works with no wiring at the page level. Duplicate module
// script tags are deduped by the browser, so this runs once regardless of
// how many logos are on the page.
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initLogos)
} else {
	initLogos()
}
schedulePreload()
unlockOnFirstGesture()
